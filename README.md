# Complete Banking System

Full-stack banking app built with Django REST Framework and React. Includes secure auth, account management, social blogs with comments, transactions, and loans with admin approval.

## Features

- **Authentication and Security**

  - Email-based login, registration, JWT sessions
  - Password reset via OTP email
  - Optional Google sign-in (allauth)
  - Profile update with image avatar

- **Banking**

  - Balance view and history
  - Deposits and transfers between users (atomic, race-safe)
  - Transactions feed for incoming/outgoing and deposits

- **Loans**

  - Users can apply for loans with `amount`, `term_months`, and `interest_rate`
  - Admin can approve/reject; approval credits user balance and records a `LOAN` transaction

- **Social**

  - Blogs with optional image upload (served from `/media`)
  - Nested comments (1-level replies)
  - Admin can delete any blog

- **Users Directory**
  - List of users (name + account number)
  - Copy account number and search

## Tech Stack

- Backend: (core lang - python)Django, Django REST Framework, SimpleJWT, dj-rest-auth, allauth, Channels, MySQL
- Frontend:(core lang - javascript) React, Vite, MUI, Axios, React Router

## Project Structure

```
backend/
  core/            # Django project (settings, urls)
  accounts/        # App: models, serializers, views, urls
  media/           # Uploaded images (blogs, profiles)
frontend/front/
  src/             # React app
    components/    # Pages and UI
    services/      # API client
```

## Prerequisites

- Python 3.10+
- Node.js 18+
- MySQL 8+

If you are a beginner, install in this order:

- Install Python (add to PATH)
- Install Node.js (LTS)
- Install MySQL Server and create a database (e.g., bankx)

## Backend Setup (Django)

1. Create and activate venv

```bash
cd backend
python -m venv venv
./venv/Scripts/activate            # Windows PowerShell
```

2. Install dependencies (if requirements.txt is missing on your machine, install these manually)

```bash

pip install django djangorestframework djangorestframework-simplejwt django-oauth-toolkit django-allauth dj-rest-auth[with_social] mysqlclient python-decouple Pillow django-cors-headers channels channels-redis

```

3. Configure database

- Create a MySQL database (e.g., `bankx`)
- Edit `backend/core/settings.py` → `DATABASES['default']` with your DB name/user/password/host/port

4. Media and static

- `MEDIA_URL` is `/media/` and `MEDIA_ROOT` is `backend/media`
- In development, `core/urls.py` serves media when `DEBUG=True`

5. Migrate and create superuser

```bash
python manage.py migrate
python manage.py createsuperuser  # admin login for /admin and approvals
```

6. Run server

```bash
python manage.py runserver
```

Optional: Create backend/.env from this template if you prefer env files

```
DJANGO_SECRET_KEY=dev-insecure-key
DJANGO_DEBUG=true
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

DB_ENGINE=django.db.backends.mysql
DB_NAME=bankx
DB_USER=root
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=3306

EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
DEFAULT_FROM_EMAIL=K9TX Bank <no-reply@example.com>

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

## Frontend Setup (React + Vite)

1. Install deps

```bash
cd frontend/front
npm install
```

2. Dev API proxy is configured

- `vite.config.js` proxies `/api` and `/media` to `http://localhost:8000`
- Optional: set `VITE_API_URL` to your backend (else defaults to `/api`)

3. Run dev server

```bash
npm run dev
# App: http://localhost:5173
```

If npm asks to install dependencies, run:

```bash
npm install
```

## Using the App

- Sign up, log in, and explore sidebar pages (Home, Balance, Deposit, Transfer, Transactions, Blogs, Users, Loans, Profile, About)
- Loans: users apply; admins approve/reject on the Loans page
- Blogs: create posts with optional images; admins can delete posts
- Users: copy any account number for transfers

## Admin Tasks

Create an admin:

```bash
cd backend
./venv/Scripts/activate
python manage.py createsuperuser
```

Log in with that account in the app; admin-only controls appear automatically.

## Troubleshooting

- Blog images not showing

  - Ensure `MEDIA_URL` starts with `/` and Vite proxy includes `/media`
  - Restart both dev servers after config changes

- 401 after some time

  - Refresh token flow is built-in; if it fails, log out and log in again
