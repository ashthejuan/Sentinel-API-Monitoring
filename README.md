# Sentinel — API monitoring

Monitors HTTP endpoints on a schedule: a **worker** pulls check tasks from **Redis**, measures latency and status, writes time-series data to **InfluxDB**, and can notify the **Spring Boot** backend on failures. The **React (Vite)** app handles authentication (via Supabase) and endpoint management. **Grafana** can visualize metrics from InfluxDB.

## Repository layout

| Path | Role |
|------|------|
| `frontend/` | React 19 + Vite UI |
| `backend/backend/` | Spring Boot API (Java 21), PostgreSQL via Supabase local port, Redis |
| `worker/` | Python consumer: Redis queue → HTTP checks → InfluxDB + webhook |
| `supabase/` | Supabase CLI project configuration |
| `docker-compose.yml` | Redis, InfluxDB 2.7, Grafana for local stacks |

## Prerequisites

- Docker and Docker Compose (for Redis, InfluxDB, Grafana)
- Java 21 and Maven (backend)
- Node.js (frontend)
- Python 3 with pip (worker)
- Supabase CLI if you run the database/auth stack locally

## Quick start (high level)

1. **Infrastructure** — From the repository root, start supporting services:

   ```bash
   docker compose up -d
   ```

   Default ports: Redis `6379`, InfluxDB `8086`, Grafana `3000`. Compose sets initial InfluxDB org/bucket/token values suitable for local testing; align the worker with whatever org, bucket, URL, and token you use.

2. **Database and auth** — Use Supabase local (or your hosted project) so the backend JDBC URL and the frontend Supabase client match your environment. Backend defaults in `backend/backend/src/main/resources/application.properties` target local Postgres on port `54322` and Redis on `6379`.

3. **Backend** — Run the Spring Boot app from `backend/backend/` (for example `mvn spring-boot:run`). Ensure the notification webhook URL used by the worker points at this API if you want failure reports.

4. **Worker** — Install dependencies and run:

   ```bash
   cd worker
   pip install -r requirements.txt
   python main.py
   ```

   Configure Redis host/port/queue and InfluxDB URL, organization, bucket, token, and webhook URL via the process environment so they match your deployment. The worker code applies sensible localhost defaults aligned with a typical `docker compose` setup.

5. **Frontend** — Install and run the dev server:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   The app expects `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` at build/runtime (Vite `import.meta.env`). Set them the way your toolchain provides (for example local or CI secrets store).

## Scripts (frontend)

- `npm run dev` — Vite dev server  
- `npm run build` — production build  
- `npm run preview` — preview production build  
- `npm run lint` — ESLint  

## License

No license file is included in this repository; add one if you distribute the project.
