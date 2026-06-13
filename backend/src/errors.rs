use axum::{
    Json,
    http::StatusCode,
    response::{IntoResponse, Response},
};
use serde_json::json;

pub enum AppError {
    NotFound,
    InvalidUrl,
    CodeToken,
    DatabaseError(sqlx::Error),
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, message) = match self {
            AppError::NotFound => (StatusCode::NOT_FOUND, "SHORT URL NOT FOUND".to_string()),
            AppError::InvalidUrl => (StatusCode::BAD_REQUEST, "INVALID URL provided".to_string()),
            AppError::CodeToken => (
                StatusCode::CONFLICT,
                "CUSTOM CODE ALREADY IN USE".to_string(),
            ),
            AppError::DatabaseError(e) => {
                tracing::error!("Database error {:?}, e");
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "SOMETHING WENT WRONG".to_string(),
                )
            }
        };

        let body = Json(json!({"status": "error","message": message}));
        (status, body).into_response()
    }
}

impl From<sqlx::Error> for AppError {
    fn from(err: sqlx::Error) -> Self {
        match err {
            sqlx::Error::RowNotFound => AppError::NotFound,
            other => AppError::DatabaseError(other),
        }
    }
}
