# 📋 Tempora

A full-stack Kanban board designed to track task duration per column and reveal workflow bottlenecks.

The backend is core Java with no framework. I wanted to understand HTTP, routing and JSON handling myself before moving to Spring Boot.

**Status:** Backend API done | Frontend in progress

---

## ✨ What works right now

- REST API with full CRUD, input validation and JUnit 5 tests
- Board UI with three columns (`TODO` / `IN_PROGRESS` / `DONE`), showing live data from the API
- Drag & drop between columns (dnd-kit) - changes are saved to the backend with a `PUT` request
- Task priorities (`LOW` / `MEDIUM` / `HIGH`) with color-coded badges
- Loading and error states on the board

---

## 🛠 Tech

**Backend:** Java 17, Maven, JDK built-in `HttpServer`, Gson, JUnit 5. Storage is in-memory for now, SQLite + JDBC is next.

**Frontend:** React, TypeScript, Vite, Tailwind CSS v4, dnd-kit.

---

## 🔌 API

| Method | Path | Behavior |
| :--- | :--- | :--- |
| `GET` | `/tasks` | All tasks (200) |
| `POST` | `/tasks` | Create a task (201), empty title -> 400, status defaults to `TODO` |
| `GET` | `/tasks/{id}` | One task (200) or 404 |
| `PUT` | `/tasks/{id}` | Partial update - only the sent fields are changed (200) or 404 |
| `DELETE` | `/tasks/{id}` | Delete (204) or 404 |

Server runs on `localhost:8080`. CORS is whitelist-based (`localhost:5173` and `127.0.0.1:5173` are allowed).

---

## 🚀 Running it

Backend (needs Java 17+ and Maven):

```bash
cd backend
mvn compile exec:java
```

Frontend (needs Node.js):

```bash
cd frontend
npm install
npm run dev
```

Both need to run at the same time. Tests: `mvn test` in the backend folder.

---

## 🧠 Some decisions I made

- **No framework on purpose.** My browser blocked my own frontend and that's how I actually learned what CORS is - I wrote a whitelist filter for it instead of allowing `*`.
- **`PUT` does partial updates.** Drag & drop only needs to change `status`, so sending the whole object felt wrong. Only the fields you send get updated. I later learned this behavior is actually closer to what `PATCH` is for - noted for a future refactor.
- **In-memory storage first.** I didn't know SQL when I started, so I kept persistence out until the API worked. Adding SQLite with raw JDBC (no ORM) is the next step.

---

## 🗺️ Roadmap

- Time-in-column analytics (the core idea)
- Task creation form
- SQLite + JDBC, later maybe PostgreSQL
- Frontend tests
- CI with GitHub Actions
- Spring Boot version of the backend, to compare with this one

---

### 👩🏼‍💻 Author

**Ezgi Nur Yiğit**  ·  Software Development Student
> Built as a personal challenge right after finishing my 1st year (Summer 2026).
