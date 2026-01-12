# Backend (Flask + SQLite) — Beginner-friendly

This backend is a simple, beginner-friendly REST API using Flask, SQLAlchemy, and JWT-based auth.

Quick start

1. Create a virtual environment and activate it (Windows):

   python -m venv .venv
   .\.venv\Scripts\activate

2. Install dependencies:

   pip install -r requirements.txt

3. Copy `.env.example` to `.env` and update values if needed.

4. Initialize the database and run migrations:

   set FLASK_APP=run.py
   flask db init
   flask db migrate -m "initial"
   flask db upgrade

   (If you don't want migrations yet, simply run `python seed.py` to create tables and seed sample data.)

5. Start the app:

   python run.py

API endpoints (examples)

- POST /api/auth/signup -> {"username", "email", "password"}
- POST /api/auth/login -> {"email", "password"} -> returns access token
- GET /api/products
- GET /api/products/<id>
- POST /api/products (requires Authorization: Bearer <token>)

Notes

- Uses SQLite by default for simplicity; switch `DATABASE_URL` in `.env` to a Postgres URL when ready.
- The `seed.py` script creates a sample admin user and demo products.

If you want, I can now:
- Hook the frontend to call these endpoints, or
- Add a simple Jinja2 homepage that uses your existing frontend styles to look Apple-like.

Tell me which you'd prefer next.