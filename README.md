# TaskFlow — Full-Stack Task Manager

A full-stack productivity application for creating, organizing, prioritizing, and tracking personal tasks. The project uses a React frontend with a Node.js/Express API, MongoDB persistence, and JWT-based authentication so each user can securely manage their own tasks.

## Live Demo

Frontend: https://task-manager-cyan-chi.vercel.app

## Features

- User registration and login with JWT authentication
- Password hashing with bcrypt
- Protected, user-specific task data
- Create, update, complete, and delete tasks
- Task status workflow: `todo`, `in-progress`, and `done`
- Priority levels: `low`, `medium`, and `high`
- Optional task descriptions and due dates
- Responsive React interface
- REST API backed by MongoDB and Mongoose
- Input validation and protected update fields

## Tech Stack

### Frontend
- React 19
- React Router
- Axios
- Tailwind CSS
- date-fns / React DatePicker
- Lucide React
- React DnD

### Backend
- Node.js
- Express 5
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- CORS
- dotenv

## Project Structure

```text
task-manager/
├── task-manager-frontend/
│   ├── public/
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
│   ├── .env.example
│   └── server.js
└── README.md
```

## API Overview

| Method | Endpoint | Description | Auth |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Create an account | No |
| POST | `/api/auth/login` | Sign in and receive JWT | No |
| GET | `/api/tasks` | Get the current user's tasks | Yes |
| POST | `/api/tasks` | Create a task | Yes |
| PUT | `/api/tasks/:id` | Update an owned task | Yes |
| DELETE | `/api/tasks/:id` | Delete an owned task | Yes |

Authenticated requests use:

```http
Authorization: Bearer <token>
```

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/raghuveer2410/task-manager.git
cd task-manager
```

### 2. Configure the backend

```bash
cd task-manager-backend
npm install
cp .env.example .env
```

Update `.env` with your own values:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

Start the API:

```bash
npm run dev
```

### 3. Start the frontend

Open a second terminal:

```bash
cd task-manager-frontend
npm install
npm start
```

The React development server runs on `http://localhost:3000` by default.

## Security Notes

- Environment files are excluded from version control.
- Passwords are hashed before being stored.
- JWT-protected endpoints scope task operations to the authenticated user.
- Editable task fields are explicitly whitelisted and validated.
- Never commit production credentials or secrets to the repository.

## Roadmap

The next phase evolves TaskFlow from a CRUD task manager into a productivity analytics platform:

- Productivity dashboard and completion-rate trends
- Overdue-task and priority analytics
- Weekly productivity summaries and streaks
- Smart task-priority scoring
- Natural-language task creation
- Automated testing and CI
- Optional ML-based deadline-risk prediction

## Resume Summary

**TaskFlow — Full-Stack Task Management Platform**  
Built a full-stack task management application using React, Node.js, Express, and MongoDB with JWT-based authentication, bcrypt password hashing, protected user-specific CRUD operations, task priorities, due dates, and a responsive interface.

## Author

Raghuveer Diya
