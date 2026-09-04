# Athena EHR Backoffice

A practice back-office admin tool that integrates with the Athena Health EHR API to manage appointment cancellation waitlists: it tracks patients waiting for an earlier appointment, matches them against newly opened slots based on their day/hour preferences, and sends personalized email notifications.

## Architecture

The project has two applications and one database:

- `managecancellations-api-master/` - the backend API. Node.js, Fastify, MongoDB (Mongoose). Talks to the Athena Health API and sends email via Gmail OAuth2 (Nodemailer).
- `managecancellations-admin-main/` - the admin frontend. React 18, Vite, Tailwind CSS. In production it is built to static files and served by a small Express server (`app.js`).
- MongoDB - stores admins, roles/access rights, and notification records.

There is also a `test-portal/` folder: a small, dependency-free static test harness used to exercise the Athena API endpoints directly, separate from the main app. It is not part of the Docker setup below; run it manually if needed with `node test-portal/server.js`.

## Running with Docker Compose (recommended)

Requirements: Docker and Docker Compose (the `docker compose` CLI plugin).

1. Copy the environment templates and fill in real values:

   ```
   cp .env.example .env
   cp managecancellations-api-master/.env.example managecancellations-api-master/.env
   cp managecancellations-admin-main/.env.example managecancellations-admin-main/.env
   ```

   Edit `managecancellations-api-master/.env` and fill in real values for the Athena Health credentials (`ATHENA_CLIENT_ID`, `ATHENA_CLIENT_SECRET`, `ATHENA_BASE_URL`, `ATHENA_PRACTICE_ID`), the Gmail OAuth2 credentials (`GMAIL_USER`, `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`, `GMAIL_REFRESH_TOKEN`), and a `JWT_SECRET`. The AWS values are unused placeholders kept only because the app's startup check requires them to be present; any non-empty string works. Leave `MONGO_HOST=mongo` as is, that is the name Docker Compose gives the database container on the internal network.

   The root `.env` is only used by `docker-compose.yml` to pass `VITE_BASE_URL`/`VITE_APP_TITLE`/`VITE_PORT` into the admin frontend as build-time arguments (Vite bakes these into the built bundle, so they are needed at build time, not just runtime). Keep it in sync with `managecancellations-admin-main/.env.example` if you change it.

2. Build and start everything:

   ```
   docker compose up --build
   ```

   This starts three containers: `mongo`, `api` (port 8033), and `admin` (port 8034). On its first start, the API container seeds a base Admin role and an `admin@ehr.com` user (this only happens if that data does not already exist, so it is safe on every restart).

3. Open the admin app at `http://localhost:8034`.

4. Log in. The seeded admin account has no password known to you yet, so first go to "Forgot password" on the sign-in screen, request a reset for `admin@ehr.com`, then use the reset flow to set your own password. (There is no email step required for this locally; the reset code is written to the `admins` collection in MongoDB, see `ResetPassword` in `managecancellations-api-master/controller/admin/auth.js` if you need to look it up directly.)

To stop everything: `docker compose down`. Data persists in the `mongo_data` Docker volume between restarts; to start completely fresh, run `docker compose down -v`.

## Running locally without Docker

Requirements: Node.js 20+, a running MongoDB instance.

Backend:

```
cd managecancellations-api-master
cp .env.example .env   # then edit .env, set MONGO_HOST to your local Mongo, e.g. 127.0.0.1
npm install
node seeder.js          # one-time, seeds the base admin role/user
node server.js
```

Frontend:

```
cd managecancellations-admin-main
cp .env.example .env    # VITE_PORT=5173 is the usual local dev port
npm install
npm run dev
```

## Environment variables

Every required variable is listed with a placeholder in each project's `.env.example` file:

- `managecancellations-api-master/.env.example`
- `managecancellations-admin-main/.env.example`

The backend (`config.js`) refuses to start if any required variable is missing, so a misconfigured `.env` fails immediately with a clear error rather than misbehaving silently.

## Security notes

- Real `.env` files are gitignored at both the root and each subproject; never commit them.
- Both application containers run as a dedicated non-root `appuser`, not root.
- The `dump/` folder (a MongoDB export) and `report/` folder are local-only artifacts, gitignored and not used by Docker Compose.
