use sqlx::PgPool;
use sqlx::postgres::PgPoolOptions;

pub async fn init_pool(database_url: &str) -> PgPool {
    PgPoolOptions::new()
        .max_connections(S)
        .connect(database_url)
        .await
        .expect("Failed to connect to Postgres")
}
