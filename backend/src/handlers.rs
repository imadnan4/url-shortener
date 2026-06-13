use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
    response::{IntoResponse, Redirect},
};
use nanoid::nanoid;

use crate::{
    AppState,
    errors::AppError,
    models::{ShortenRequest, ShortenResponse, StatsResponse, Url},
};

// ── GET /api/health ───────────────────────────────────────
pub async fn health_check() -> impl IntoResponse {
    Json(serde_json::json!({ "status": "ok" }))
}

// ── POST /api/shorten ─────────────────────────────────────
pub async fn shorten_url(
    State(state): State<AppState>,
    Json(payload): Json<ShortenRequest>,
) -> Result<impl IntoResponse, AppError> {
    // 1. Basic validation
    if !payload.url.starts_with("http://") && !payload.url.starts_with("https://") {
        return Err(AppError::InvalidUrl);
    }

    // 2. Determine the short code
    let short_code = match payload.custom_code {
        Some(code) => {
            // 3. Check if custom code is already taken
            let existing = sqlx::query_as::<_, Url>("SELECT * FROM urls WHERE short_code = $1")
                .bind(&code)
                .fetch_optional(&state.db)
                .await?;

            if existing.is_some() {
                return Err(AppError::CodeToken);
            }
            code
        }
        // nanoid!(7) generates a random 7-character string like "aZ3kP9x"
        None => nanoid!(7),
    };

    // 4. Insert into database
    sqlx::query("INSERT INTO urls (short_code, original_url) VALUES ($1, $2)")
        .bind(&short_code)
        .bind(&payload.url)
        .execute(&state.db)
        .await?;

    // 5. Build and return the response
    let response = ShortenResponse {
        short_code: short_code.clone(),
        short_url: format!("{}/{}", state.base_url, short_code),
        original_url: payload.url,
    };

    Ok((StatusCode::CREATED, Json(response)).into_response())
}

// ── GET /:code ────────────────────────────────────────────

pub async fn redirect_to_url(
    State(state): State<AppState>,
    Path(code): Path<String>,
) -> Result<impl IntoResponse, AppError> {
    // Look up the URL by short_code
    let url = sqlx::query_as::<_, Url>("SELECT * FROM urls WHERE short_code = $1")
        .bind(&code)
        .fetch_optional(&state.db)
        .await?
        .ok_or(AppError::NotFound)?;

    // Increment click count (don't block the redirect on this)
    sqlx::query("UPDATE urls SET click_count = click_count + 1 WHERE short_code = $1")
        .bind(&code)
        .execute(&state.db)
        .await?;

    // 302 Found = temporary redirect (browser doesn't cache permanently)
    Ok(Redirect::temporary(&url.original_url))
}

// ── GET /api/stats/:code ──────────────────────────────────
// Returns click count and metadata for a short code.
pub async fn get_stats(
    State(state): State<AppState>,
    Path(code): Path<String>,
) -> Result<impl IntoResponse, AppError> {
    let url = sqlx::query_as::<_, Url>("SELECT * FROM urls WHERE short_code = $1")
        .bind(&code)
        .fetch_optional(&state.db)
        .await?
        .ok_or(AppError::NotFound)?;

    let response = StatsResponse {
        short_code: url.short_code,
        original_url: url.original_url,
        click_count: url.click_count,
        created_at: url.created_at,
    };

    Ok(Json(response))
}
