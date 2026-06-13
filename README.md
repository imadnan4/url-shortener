# URL Shortener

A full stack URL shortener — Rust + Axum + PostgreSQL backend, React frontend.

## Project Structure

```
url-shortener/
├── backend/      # Rust API (Axum + sqlx + PostgreSQL)
└── frontend/     # React app (Vite + Tailwind + shadcn)
```

## Prerequisites

- [Rust](https://rustup.rs) (`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`)
- [Node.js](https://nodejs.org) (v18+)
- PostgreSQL

## Quick Start

```bash
git clone <repo-url>
cd url-shortener
```

Each part has its own setup instructions:
- [`backend/README.md`](./backend/README.md) — PostgreSQL setup, environment config, running the API
- [`frontend/README.md`](./frontend/README.md) — installing dependencies, running the dev server

Start the backend first (`cargo run`, default port `8080`), then the
frontend (`npm run dev`, default port `5173`).

## Features

- Shorten long URLs, with optional custom short codes
- Redirect via short code
- Click tracking / stats per short URL

## API Overview

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/shorten` | Create a short URL |
| GET | `/{code}` | Redirect to original URL |
| GET | `/api/stats/{code}` | Get click stats |

See `backend/README.md` for full request/response examples.
