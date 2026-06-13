# Backend — Rust + Axum + PostgreSQL

## 1. Install PostgreSQL

**Arch Linux:**
```bash
sudo pacman -S postgresql
sudo -iu postgres initdb -D /var/lib/postgres/data
sudo systemctl enable --now postgresql
```

**Debian/Ubuntu:**
```bash
sudo apt install postgresql
sudo systemctl enable --now postgresql
```

**macOS:**
```bash
brew install postgresql@16
brew services start postgresql@16
```

## 2. Create the database and user

```bash
sudo -iu postgres psql
```

Inside the `psql` shell:
```sql
CREATE USER your_username WITH PASSWORD 'your_password';
CREATE DATABASE urlshortener OWNER your_username;
GRANT ALL PRIVILEGES ON DATABASE urlshortener TO your_username;
\q
```

If the database already exists and you want a clean slate:
```sql
DROP DATABASE IF EXISTS urlshortener;
CREATE DATABASE urlshortener OWNER your_username;
```

## 3. Configure environment

From `backend/`:
```bash
cat > .env << 'EOF'
DATABASE_URL=postgres://your_username:your_password@localhost:5432/urlshortener
PORT=8080
BASE_URL=http://localhost:8080
EOF
```

Verify the connection:
```bash
psql postgres://your_username:your_password@localhost:5432/urlshortener -c "SELECT 1;"
```

## 4. Run

```bash
cargo run
```

First run compiles all dependencies (2-5 minutes). Migrations run
automatically on startup. You should see:
```
Server running on http://localhost:8080
```

## 5. Verify

```bash
curl http://localhost:8080/api/health
```
Expected: `{"status":"ok"}`

```bash
curl -X POST http://localhost:8080/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://github.com"}'
```
Expected: JSON with `short_code`, `short_url`, `original_url`

---

## Resetting the database (development only)

If migrations get into a bad state (e.g. version mismatch after editing
an already-applied migration):

```bash
psql postgres://your_username:your_password@localhost:5432/urlshortener
```
```sql
DROP TABLE IF EXISTS _sqlx_migrations;
DROP TABLE IF EXISTS urls;
\q
```
Then `cargo run` again — migrations reapply from scratch.

> ⚠️ This deletes all stored URLs. Only do this in development.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/shorten` | Create a short URL. Body: `{ "url": "...", "custom_code": "optional" }` |
| GET | `/{code}` | Redirect to the original URL |
| GET | `/api/stats/{code}` | Get click count and metadata for a short code |

## Dependencies

```bash
cargo add axum
cargo add tokio --features full
cargo add serde --features derive
cargo add serde_json
cargo add sqlx --features runtime-tokio,tls-rustls,postgres,chrono
cargo add chrono --features serde
cargo add nanoid
cargo add dotenvy
cargo add tower-http --features cors
cargo add tracing
cargo add tracing-subscriber
```
