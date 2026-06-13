mod db;
mod errors;
mod handler;
mod models;

use axum::{
    Router,
    routing::{get, post},
    serve::Listener,
};

use std::{string, sync::Arc};
use tower_http::cors::CorsLayer;

pub struct Appstate {
    pub db: sqlx::PgPool,
    pub base_url: string,
}

async fn main() {
    //Load env from .env file
    dotenvy::dotenv().ok();

    // initalize logging - print request log to terminal
    tracing_subscriber::fmt::init();

    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be in .env");

    let port = std::env::var("PORT").unwrap_or_else(|_| "8000".to_string());
    let base_url = std::env::var("BASE_URL").unwrap_or_else(|_| format!("http://localhost:{port}"));

    // Connect to Postgres
    let pool = db::init_pool(&database_url).await;

    // Run Migration Automatically
    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .expect("Failed to run migrations");

    let state = Appstate { db: pool, base_url };

    // Build the Routers

    let app = Router::new()
        .route("/api/health", get(handlers::health_check))
        .route("/api/shorten", post(handlers::shorten_url))
        .route("/api/stats/:code", get(handlers::get_stats))
        .route("/:code", get(handlers::redirect_to_url))
        .layer(CorsLayer::permissive())
        .with_state(state);

    let addr = format!("0.0.0.0:{port}");
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();

    println!("Server running on http://localhost:{port}");
    axum::serve(listener, app).await.unwrap();
}
