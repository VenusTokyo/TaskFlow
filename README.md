# TaskFlow

A full-stack project and task management web app. Create projects, track tasks on a drag-and-drop Kanban board, and view your productivity at a glance.

---
<img width="1898" height="750" alt="image" src="https://github.com/user-attachments/assets/e8e9a71c-c1e7-4f38-b47a-f47662e51185" />
<img width="1918" height="912" alt="image" src="https://github.com/user-attachments/assets/5d8e7615-6101-4397-a438-1d75a4b72f84" />
<img width="1918" height="907" alt="image" src="https://github.com/user-attachments/assets/bdc7c3a4-1439-4481-9583-561032ac8f01" />

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, React Router v7, TanStack Query v5, Axios |
| Styling | Tailwind CSS v4, custom CSS (earthy editorial design system) |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| Backend | Node.js, Express v5 |
| Database | SQLite via **better-sqlite3** (raw SQL — no ORM) |
| Auth | JWT (`jsonwebtoken` · 7-day expiry) + `bcryptjs` password hashing |
| Dev tooling | nodemon |

---

## Folder Structure

```
taskflow/
├── client/                   Vite + React frontend
│   └── src/
│       ├── pages/
│       │   ├── Landing.jsx   Public marketing page
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx  Stats + recent projects
│       │   ├── Projects.jsx   Project list (CRUD)
│       │   ├── ProjectDetail.jsx  Kanban board
│       │   └── Profile.jsx    Edit name / bio
│       ├── components/
│       │   ├── Sidebar.jsx
│       │   ├── KanbanBoard.jsx  Drag-and-drop (dnd-kit)
│       │   ├── TaskCard.jsx
│       │   ├── ProjectCard.jsx
│       │   ├── StatCard.jsx
│       │   └── Modal.jsx
│       ├── lib/
│       │   ├── api.js         Axios instance + JWT interceptor
│       │   └── auth.js        localStorage token/user helpers
│       ├── App.jsx            Routes + QueryClientProvider
│       └── index.css          Tailwind v4 + CSS design tokens
│
├── server/
│   ├── db/
│   │   └── index.js          better-sqlite3 init + schema creation
│   ├── middleware/
│   │   └── auth.js           JWT verification middleware
│   ├── routes/
│   │   ├── auth.js           POST /register, POST /login
│   │   ├── users.js          GET|PUT /me, GET /stats
│   │   ├── projects.js       CRUD /projects (+ GET /:id)
│   │   └── tasks.js          CRUD /tasks
│   ├── index.js              Express entry point
│   ├── .env                  PORT + JWT_SECRET (git-ignored)
│   └── dev.db                SQLite database (auto-created, git-ignored)
│
└── .gitignore
```

---

## Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later

No other installation required — SQLite is embedded via `better-sqlite3`.

---

## Setup

### 1 — Clone and enter the project

```bash
git clone <repo-url>
cd taskflow
```

### 2 — Backend

```bash
cd server
npm install
```

Create `server/.env` (already present if you cloned this repo; otherwise create it):

```env
PORT=5000
JWT_SECRET=change_this_to_a_long_random_string
```

Start the server:

```bash
npm run dev          # nodemon (auto-restarts on changes)
# or
npm start            # plain node
```

The server starts on **http://localhost:5000**.  
The SQLite database (`dev.db`) is created automatically on first start — no migration step needed.

### 3 — Frontend (new terminal)

```bash
cd client
npm install
npm run dev
```

The client starts on **http://localhost:5173**.

Open your browser to **http://localhost:5173** and register a new account.

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Express server port |
| `JWT_SECRET` | *(required)* | Secret used to sign JWT tokens — use a long random string in production |

The frontend API base URL is hard-coded to `http://localhost:5000/api` in `client/src/lib/api.js`. Change it there if you move the server to a different host or port.

---

## API Endpoints

All authenticated routes require `Authorization: Bearer <token>` in the request header.

### Auth — no token required

| Method | Endpoint | Body | Response |
|---|---|---|---|
| `POST` | `/api/auth/register` | `{ name, email, password }` | `{ token, user }` |
| `POST` | `/api/auth/login` | `{ email, password }` | `{ token, user }` |

### Users — token required

| Method | Endpoint | Body | Response |
|---|---|---|---|
| `GET` | `/api/users/me` | — | current user (no password) |
| `PUT` | `/api/users/me` | `{ name, bio }` | updated user |
| `GET` | `/api/users/stats` | — | `{ totalProjects, totalTasks, completedTasks, overdueTasks }` |

### Projects — token required, scoped to logged-in user

| Method | Endpoint | Body | Response |
|---|---|---|---|
| `GET` | `/api/projects` | — | array of projects with `task_count` |
| `GET` | `/api/projects/:id` | — | single project |
| `POST` | `/api/projects` | `{ title, description? }` | created project |
| `PUT` | `/api/projects/:id` | `{ title?, description?, status? }` | updated project |
| `DELETE` | `/api/projects/:id` | — | `{ success: true }` |

### Tasks — token required

| Method | Endpoint | Body | Response |
|---|---|---|---|
| `GET` | `/api/tasks/project/:projectId` | — | array of tasks |
| `POST` | `/api/tasks` | `{ title, projectId, description?, priority?, dueDate? }` | created task |
| `PUT` | `/api/tasks/:id` | `{ title?, description?, status?, priority?, dueDate? }` | updated task |
| `DELETE` | `/api/tasks/:id` | — | `{ success: true }` |

**Task status values:** `todo` · `in_progress` · `done`  
**Task priority values:** `low` · `medium` · `high`  
**Project status values:** `active` · `completed` · `archived`

---

## Design System

The app uses a custom **"Muted Olive Editorial"** palette defined as CSS variables in `client/src/index.css`:

| Token | Value | Usage |
|---|---|---|
| `--bg-50` | `#FAF8F3` | Page background |
| `--bg-100` | `#F4F1EA` | Sidebar, section backgrounds |
| `--bg-200` | `#E7E1D6` | Card backgrounds |
| `--primary-800` | `#5F6F57` | Primary buttons, focus rings |
| `--primary-900` | `#4C5A46` | Button hover, CTA section |
| `--muted-300` | `#C2CBBE` | Borders |
| `--text-900` | `#2F3630` | Headings |
| `--text-500` | `#7C8B74` | Muted text, labels |

App typography uses `Times New Roman, Times, serif` italic. The landing page uses `DM Serif Display` for headings and `DM Sans` for body text (loaded from Google Fonts).

---

## Assumptions & Limitations

### Authentication
- Tokens are stored in `localStorage` — fine for development, but not hardened against XSS in a production context (consider `httpOnly` cookies + CSRF protection for a real deployment).
- JWT expiry is 7 days with no refresh mechanism. After expiry, the user is silently redirected to `/login`.
- No email verification, password reset, or "forgot password" flow.

### Data & Storage
- SQLite is used for simplicity. It works on a single machine with low concurrency. To scale, replace `better-sqlite3` with `pg` (PostgreSQL) and rewrite the raw SQL queries accordingly.
- The database is created automatically on server start using `CREATE TABLE IF NOT EXISTS`. There is no migration system — schema changes require manually altering or recreating `dev.db`.
- All IDs are UUIDs generated with Node's built-in `crypto.randomUUID()`.

### Users & Scoping
- Projects and tasks are strictly scoped to the logged-in user — there is no sharing or collaboration between accounts.
- The `user_id` on projects and `project_id` on tasks are enforced server-side on every request; clients cannot access other users' data.

### Avatars
- No image upload is supported. The profile page shows an initials-based placeholder generated from the user's name, using a teal-to-blue gradient circle.

### Kanban / Drag & Drop
- Drag and drop uses `@dnd-kit` with pointer-within collision detection, optimised for mouse/trackpad. Touch support works on most modern mobile browsers but is not explicitly tested.
- Dragging reorders status only (todo → in_progress → done); there is no within-column ordering — tasks within a column are sorted by `created_at ASC`.
- Status is updated immediately on drop via `PUT /api/tasks/:id`. If the request fails, the UI reverts on the next React Query refetch.

### Real-time
- There are no WebSockets or Server-Sent Events. Data refreshes on navigation and after every mutation. Open two browser tabs simultaneously and changes in one will not appear in the other until a manual page action triggers a refetch.

### Deployment
- The server and client are separate processes and are not configured for production deployment (no build pipeline, no reverse proxy config, no HTTPS). For production, build the client with `npm run build` (output in `client/dist/`) and serve it from a static host or the same Express server.
