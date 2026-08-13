# 📋 Tempora

A full-stack Kanban board that goes beyond task tracking by measuring how long each task actually takes — built with a hand-written Java REST API (no framework), PostgreSQL, and a full CI/CD pipeline.

[**Live Demo**](https://tempora-gray.vercel.app) · [**API**](https://tempora-cmd4.onrender.com)

> The backend runs on Render's free tier and sleeps after 15 minutes of inactivity — the first request can take up to 50 seconds to wake it up. Your data is safe though; it's stored in a managed Postgres database, not on the server itself.

**Status:** v1 almost done — auth, all pages, and analytics are working. A few loose ends left (see Roadmap) before I call it finished.

---

| Board                                | Analytics                                    |
| ------------------------------------ | -------------------------------------------- |
| ![Board](docs/screenshots/board.png) | ![Analytics](docs/screenshots/analytics.png) |

---

## ✨ What works right now

- User accounts — register, login, logout, JWT stored in an `httpOnly` cookie. Each user only sees their own board.
- Full CRUD REST API with input validation and JUnit 5 tests
- Persistent storage — tasks are saved in PostgreSQL (Neon) and survive server restarts
- Board with three columns (`TODO` / `IN_PROGRESS` / `DONE`), drag & drop between them (dnd-kit, touch-friendly), synced to the backend with a `PUT` request
- Create and edit tasks through a modal, with title validation; delete with a confirmation step
- Task priorities (`LOW` / `MEDIUM` / `HIGH`) with color-coded badges
- **Time-in-column analytics** — set an estimated duration on a task, watch a live counter while it's `IN_PROGRESS`, and see the actual time frozen once it's `DONE`. An analytics page compares estimated vs. actual time per task and highlights the ones that ran over or finished early.
- Full status-change history stored per task (`GET /tasks/{id}/history`) — the backend logs every transition, so time can't be hidden by moving a task back and forth
- A notifications page listing tasks that went over their estimated time, whether still in progress or already done
- Collapsible sidebar navigation (persisted, with hover tooltips), dark/light mode, responsive layout
- A settings page — appearance, board preferences, and account
- Loading and error states throughout
- CI on every pull request, and automatic deploys on merge

---

## 🛠 Tech

**Backend:** Java 17, Maven, JDK built-in `HttpServer`, Gson, JUnit 5, PostgreSQL with raw JDBC (no ORM), JWT (`jjwt`) + BCrypt (`jbcrypt`) for auth.

**Frontend:** React, TypeScript, Vite, Tailwind CSS v4, react-router-dom, dnd-kit, Recharts, lucide-react.

**Infra:** Docker (backend), Render (backend hosting), Neon (managed PostgreSQL), Vercel (frontend hosting), GitHub Actions (CI).

---

## 🔌 API

All `/tasks*` endpoints require a valid auth cookie.

| Method   | Path                  | Behavior                                                                      |
| :------- | :-------------------- | :---------------------------------------------------------------------------- |
| `POST`   | `/auth/register`      | Creates a user, hashes the password, sets the auth cookie (201)               |
| `POST`   | `/auth/login`         | Verifies credentials, sets the auth cookie (200)                              |
| `GET`    | `/auth/me`            | Returns the current user if the cookie is valid (200) or 401                  |
| `POST`   | `/auth/logout`        | Clears the auth cookie (200)                                                  |
| `GET`    | `/tasks`              | The current user's tasks, including duration fields (200)                     |
| `POST`   | `/tasks`              | Create a task (201), empty title -> 400, status defaults to `TODO`            |
| `GET`    | `/tasks/{id}`         | One task (200) or 404                                                         |
| `PUT`    | `/tasks/{id}`         | Partial update - only the sent fields are changed (200) or 404                |
| `DELETE` | `/tasks/{id}`         | Delete (204) or 404                                                           |
| `GET`    | `/tasks/{id}/history` | Full status-change history for a task (`fromStatus`, `toStatus`, `changedAt`) |

CORS is whitelist-based — local dev origins and the deployed frontend are allowed, everything else is blocked.

---

## 🚀 Running it locally

Backend (needs Java 17+, Maven, and a local PostgreSQL database):

```bash
cd backend
mvn compile exec:java
```

Requires `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, and `JWT_SECRET` as environment variables. The schema is created automatically on startup.

Frontend (needs Node.js):

```bash
cd frontend
npm install
npm run dev
```

The frontend reads the API address from `VITE_API_URL`. For local development, create `frontend/.env.local`:

```
VITE_API_URL=http://localhost:8080
```

Both need to run at the same time. Tests: `mvn test` in the backend folder.

---

## ⚙️ CI/CD

- **Backend CI** runs `mvn test` on every pull request
- **Frontend CI** runs `npm run build` to catch TypeScript and build errors before merge
- Both workflows use `dorny/paths-filter` so unrelated changes skip the actual steps but still report a result — otherwise a required check would sit pending forever on a PR that doesn't touch that side
- `main` is protected: pull request required, both checks must pass, squash-merge only
- Merging to `main` triggers an automatic redeploy on Vercel and Render

---

## 🧠 Some decisions I made

- **No framework, on purpose.** My browser blocked my own frontend once, and that's actually how I learned what CORS is. Wrote a whitelist filter for it instead of just allowing `*`.
- **`PUT` only updates what you send.** Drag & drop just changes `status`, so sending the whole task object every time felt dumb.
- **PostgreSQL instead of SQLite.** SQLite was the original plan, simpler, no server needed. But Render's free tier wipes the filesystem on restart, so the SQLite file would've been gone every time. Switched to PostgreSQL before I even wrote the SQLite code.
- **Raw JDBC, no ORM.** Wanted to actually write the SQL instead of Hibernate doing it for me.
- **JWT instead of sessions.** No framework = no built-in session store, so a token made more sense than building that myself.
- **JWT lives in an httpOnly cookie, not localStorage.** Can't be read by JS on the frontend, which is safer. Cost me a real bug though - needed `SameSite=None; Secure` for the cookie to survive Vercel talking to Render (different domains), took me a while to figure out why login worked but every request after it returned 401.
- **Backend calculates durations, not the frontend.** Frontend just sends a status change. If the frontend calculated the time, anyone could fake it with Postman.
- **Learned about migrations the hard way.** Added new columns, forgot `CREATE TABLE IF NOT EXISTS` does nothing if the table already exists. Production broke. Now I add both the column in `CREATE TABLE` and a separate `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`.
- **Docker for the backend.** Render doesn't run plain Java, so this wasn't really optional.

---

## 🗺️ Roadmap

**Loose ends before v1 is really done:**

- `tasks.user_id` should be `NOT NULL` now that every task belongs to a user - not migrated yet
- The "confirm before delete" setting exists in Settings but isn't wired up to the actual delete flow yet
- A task history view in the UI (the `/history` endpoint already exists, just not shown on a screen yet)

**After that:**

- A proper testing strategy for the database layer and for input validation (currently only tested manually / disabled)
- Splitting off a dedicated analytics/reporting endpoint
- Forgot-password flow
- Team features (multiple users on one board, roles, invites)
- Spring Boot version of the backend, to compare against this one

---

### 👩🏼‍💻 Author

**Ezgi Nur Yiğit** · Software Development Student

> Built as a personal challenge right after finishing my 1st year (Summer 2026).
