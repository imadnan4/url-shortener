mod db;
mod errors;
mod handlers;
mod models;

use axum::{
    Router,
    routing::{get, post},
};

use tower_http::cors::CorsLayer;

// AppState is shared across all request handlers.
// We wrap the DB pool in Arc so it can be cloned cheaply (just a pointer copy)
// and shared safely across multiple concurrent requests.
#[derive(Clone)]
pub struct AppState {
    pub db: sqlx::PgPool,
    pub base_url: String,
}

#[tokio::main]
async fn main() {
    // Load .env file into environment variables
    dotenvy::dotenv().ok();

    // Initialize logging — prints request logs to terminal
    tracing_subscriber::fmt::init();

    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set in .env");
    let port = std::env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let base_url = std::env::var("BASE_URL").unwrap_or_else(|_| format!("http://localhost:{port}"));

    // Connect to Postgres — db::init_pool() lives in db.rs (Step 2)
    let pool = db::init_pool(&database_url).await;

    // Run migrations automatically on startup
    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .expect("Failed to run migrations");

    let state = AppState { db: pool, base_url };

    // ── Build the router ──────────────────────────────────
    let app = Router::new()
        .route("/api/health", get(handlers::health_check))
        .route("/api/shorten", post(handlers::shorten_url))
        .route("/api/stats/{code}", get(handlers::get_stats))
        .route("/{code}", get(handlers::redirect_to_url))
        .layer(CorsLayer::permissive()) // allow requests from React frontend
        .with_state(state);

    let addr = format!("0.0.0.0:{port}");
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();

    println!(" Server running on http://localhost:{port}");
    axum::serve(listener, app).await.unwrap();
}
