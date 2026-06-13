use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

// Matches a row in the "urls" table exactly
#[derive(Debug, Serialize, sqlx::FromRow)]
pub struct Url {
    pub id: i32,
    pub short_code: String,
    pub original_url: String,
    pub click_count: i32,
    pub created_at: DateTime<Utc>,
}

// incomming JSON body for POST /api/shorten
#[derive(Debug, Deserialize)]
pub struct ShortenRequest {
    pub url: String,
    pub custom_code: Option<String>,
}

// Json we send back after successful shortening a url
#[derive(Debug, Serialize)]
pub struct ShortenResponse {
    pub short_code: String,
    pub short_url: String,
    pub original_url: String,
}

// JSON return by GET /api/stats/:code
#[derive(Debug, Serialize)]
pub struct StatsResponse {
    pub short_code: String,
    pub original_url: String,
    pub click_count: i32,
    pub created_at: DateTime<Utc>,
}
