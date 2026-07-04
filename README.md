# School Management System

A full-stack school admin dashboard that reads live data from a MySQL `school` database.

- **Frontend:** React + Vite, Tailwind CSS, Recharts, Lucide icons, Axios
- **Backend:** Django (Python), raw SQL via Django's database cursor, django-cors-headers
- **Database:** MySQL (`school`)

No mock or hardcoded data is used — every table is populated by REST API calls to the Django backend, which queries MySQL directly.

## Project structure

```
school-management-system/
  client/                     React + Vite frontend
    src/
      components/             Reusable UI (Sidebar, Navbar, Badge, Modal, table states...)
      pages/                  Dashboard, Students, Classrooms, Teachers, Attendance, Courses, Exams, Results, Settings
      layouts/                AdminLayout (sidebar + navbar shell)
      services/               api.js — Axios calls to the backend
      hooks/                  useApiData — shared loading/error/data fetch hook
  server/                     Django backend
    manage.py                 Django management entry point
    requirements.txt
    .env.example
    school_management/        Project settings, root urls.py, wsgi/asgi
    api/                      The API app
      db.py                   Raw SQL query helpers (dictfetchall)
      views.py                One view per endpoint, same SQL/LEFT JOINs as before
      urls.py                 /api/... route table
      middleware.py           Centralized JSON error handling
```

## Why raw SQL instead of Django models?

The `school` database already exists with its own schema and data. Rather than guessing at
exact column names for tables like `teacher` and `course` (which weren't fully specified),
`api/db.py` runs SQL directly against the existing tables and returns plain dicts — the same
approach the original queries used, just executed through Django's database cursor instead of
mysql2. This means zero migrations are needed and nothing about your existing database changes.

## Setup steps

### 1. Install MySQL and import the database

Make sure MySQL is installed and running locally, and that a database named `school` exists with
these tables already populated with data:

- `student`
- `classroom`
- `teacher`
- `attendance`
- `course`
- `exam_type`
- `exam`
- `exam_result`

Key relationship used throughout the app:

```sql
SELECT s.*, c.*
FROM student s
LEFT JOIN classroom c ON s.classroom_id = c.classroom_id;
```

### 2. Create `server/.env`

Copy the example file and fill in your MySQL credentials:

```bash
cd server
cp .env.example .env
```

Then edit `server/.env`:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=school
DB_PORT=3306
PORT=8000
DJANGO_SECRET_KEY=change-this-to-a-random-secret-key
DJANGO_DEBUG=True
```

### 3. Install backend dependencies

It's recommended to use a virtual environment:

```bash
cd server
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

`mysqlclient` requires MySQL's development headers to build. On Ubuntu/Debian:
`sudo apt-get install default-libmysqlclient-dev build-essential pkg-config`.
On macOS with Homebrew: `brew install mysql-client pkg-config`.

### 4. Install frontend dependencies

```bash
cd client
npm install
```

### 5. Run the backend

```bash
cd server
python manage.py runserver 8000
```

The API will start at `http://localhost:8000`. Visit `http://localhost:8000/api/health` to
confirm it's running.

### 6. Run the frontend

In a separate terminal:

```bash
cd client
npm run dev
```

The dashboard will be available at `http://localhost:5173`.

### 7. Open the frontend in your browser

Navigate to `http://localhost:5173`. The Dashboard, Students, Classrooms, Teachers, Attendance,
Courses, Exams, and Results pages will load live data from your MySQL database.

## API reference

| Method | Endpoint                    | Description                                             |
|--------|------------------------------|-----------------------------------------------------------|
| GET    | `/api/health`                | Health check                                               |
| GET    | `/api/dashboard`             | Summary counts + recent students + classroom overview      |
| GET    | `/api/students`              | All students, LEFT JOINed with classroom                   |
| GET    | `/api/students/<id>`         | Single student with classroom details (404 if not found)   |
| GET    | `/api/classrooms`            | All classrooms with teacher id and student counts          |
| GET    | `/api/classrooms/<id>`       | Single classroom (404 if not found)                        |
| GET    | `/api/teachers`               | All teachers                                                |
| GET    | `/api/attendance`             | Attendance records with student name and course             |
| GET    | `/api/courses`                | All courses                                                 |
| GET    | `/api/exams`                  | Exams with exam type name                                   |
| GET    | `/api/results`                | Exam results with student, course, and exam names           |

All endpoints use `LEFT JOIN` (not `INNER JOIN`) so students without an assigned classroom, or
records with missing related data, still appear. Missing classroom fields are shown in the UI as
"Not Assigned" / "Unknown" rather than being hidden.

## Notes

- "Add Student", "Edit Student", and "Delete Student" buttons are present in the UI as required,
  but since only read (`GET`) endpoints were requested, they currently show a placeholder message
  instead of calling a write endpoint. Add `POST` / `PUT` / `DELETE` views to `api/views.py` and
  wire them up in `api/urls.py` when you're ready to support editing.
- The `teacher` and `course` tables are rendered dynamically from whatever columns the query
  returns (`SELECT *`), since their exact schema wasn't specified — no columns are hardcoded or
  invented.
- If the backend can't reach MySQL, `api/middleware.py` catches the database error and returns a
  clear JSON message (rather than Django's default HTML error page), and the frontend displays an
  in-app error state with a retry button.
