# TaskFlow — Productivity Analytics Task Manager

TaskFlow is a full-stack task management and productivity analytics application. It combines secure, user-scoped task CRUD with completion trends, overdue analysis, KPI reporting, and an explainable smart-priority score.

**Live frontend:** https://task-manager-cyan-chi.vercel.app  
**Backend API:** https://task-manager-jzey.onrender.com

## Portfolio Highlights

- React 19 dashboard with responsive task workflows
- Node.js and Express REST API with MongoDB/Mongoose persistence
- JWT authentication and bcrypt password hashing
- User-scoped authorization for every task and analytics query
- KPI dashboard: completion rate, overdue tasks, on-time rate, and productivity score
- Six-week completion trend with 7/30/90-day filtering
- Explainable task-priority scoring based on declared priority, due-date urgency, workflow status, and task age
- Completion timestamps for analytically correct historical metrics
- Automated analytics unit tests and GitHub Actions CI

The smart-priority feature is intentionally described as a **rule-based scoring model**, not trained machine learning. Its reasons are returned with each score so the output is transparent and auditable.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, React Router, Axios, Tailwind CSS, date-fns, React DnD |
| Backend | Node.js, Express 5, MongoDB, Mongoose |
| Security | JWT, bcryptjs, CORS, dotenv |
| Analytics | JavaScript aggregation, completion-time KPIs, heuristic scoring |
| Quality | Node test runner, React production build, GitHub Actions |

## Project Structure

```text
task-manager/
├── .github/workflows/ci.yml
├── task-manager-frontend/
│   ├── .env.example
│   └── src/
│       ├── Pages/
│       ├── api/
│       ├── auth/
│       ├── components/
│       └── layouts/
├── task-manager-backend/
│   ├── Middleware/
│   ├── Routes/
│   ├── models/
│   ├── services/
│   ├── test/
│   ├── .env.example
│   └── server.js
└── README.md
```

## Local Setup

### Prerequisites

- Node.js 20 or later
- npm
- A MongoDB database (local MongoDB or MongoDB Atlas)

### 1. Clone

```bash
git clone https://github.com/raghuveer2410/task-manager.git
cd task-manager
```

### 2. Start the backend

```bash
cd task-manager-backend
npm ci
cp .env.example .env
```

Set your own values in `task-manager-backend/.env`:

```env
PORT=8000
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER/taskflow
JWT_SECRET=generate-a-long-random-secret
```

Generate a JWT secret locally:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Run the API:

```bash
npm run dev
```

The backend is available at `http://localhost:8000`.

### 3. Start the frontend

In a second terminal:

```bash
cd task-manager/task-manager-frontend
npm ci
cp .env.example .env
npm start
```

For local development, `.env` should contain:

```env
REACT_APP_API_URL=http://localhost:8000
```

Open `http://localhost:3000`.

## API Reference

All request and response bodies use JSON. Protected endpoints require:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

| Method | Endpoint | Purpose | Auth |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Register and return a JWT | No |
| POST | `/api/auth/login` | Authenticate and return a JWT | No |
| GET | `/api/tasks` | List the current user's tasks | Yes |
| POST | `/api/tasks` | Create a task | Yes |
| PUT | `/api/tasks/:id` | Update an owned task | Yes |
| DELETE | `/api/tasks/:id` | Delete an owned task | Yes |
| GET | `/api/analytics/summary?range=30` | Return KPIs, trends, and smart priorities | Yes |

The analytics `range` must be `7`, `30`, or `90` days.

### Register

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Demo User","email":"demo@example.com","password":"StrongPass123"}'
```

### Login and save the token

```bash
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"StrongPass123"}' \
  | node -pe "JSON.parse(require('fs').readFileSync(0, 'utf8')).token")
```

### Create a task

```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Prepare internship applications","description":"Tailor resume and portfolio","status":"in-progress","priority":"high","dueDate":"2026-09-01"}'
```

### Get analytics

```bash
curl "http://localhost:8000/api/analytics/summary?range=30" \
  -H "Authorization: Bearer $TOKEN"
```

The response contains:

- `summary`: totals, completed, pending, overdue, completion rate, on-time rate, productivity score
- `statusBreakdown` and `priorityBreakdown`
- `weeklyTrend`: six weekly completion buckets
- `smartPriorities`: the five highest-scoring open tasks with score explanations

## Tests and CI

Run the backend analytics tests:

```bash
cd task-manager-backend
npm test
```

Verify the frontend production build:

```bash
cd task-manager-frontend
npm run build
```

GitHub Actions runs both checks on pull requests and pushes to `main`.

## Security

- Never commit `.env` files, database credentials, or JWT secrets.
- Credentials exposed in Git history must be rotated; deleting the file from the latest commit is not sufficient.
- Task updates whitelist editable fields and run Mongoose validators.
- Task and analytics queries are scoped to the authenticated user's ID.

## Analytics Methodology

`productivityScore` is a 0–100 weighted score:

- 60% completion rate
- 25% on-time completion rate
- 15% inverse overdue rate

Smart priority is a deterministic 0–100 score. It combines declared priority, due-date urgency, in-progress status, and an age boost. The API returns the contributing reasons, making the score suitable for explanation, testing, and later comparison with a trained model.

## Roadmap

- Add integration tests for authentication and task ownership
- Add streaks and calendar heatmaps
- Export analytics as CSV
- Collect labeled outcomes for a future deadline-risk model
- Compare the heuristic baseline with a trained classifier only after enough quality data exists

## Resume Summary

**TaskFlow — Full-Stack Productivity Analytics Platform**  
Built a React, Node.js, Express, and MongoDB task platform with JWT authentication, protected user-specific CRUD APIs, completion-trend analytics, KPI reporting, explainable priority scoring, automated unit tests, and GitHub Actions CI.

## Author

Raghuveer Diya
