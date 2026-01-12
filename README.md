# Internship Project — Beginner-friendly guide

This repository contains a simple full-stack demo: a Flask backend and a static frontend.

Goals for beginners:
- Easy setup on Windows (PowerShell) and Linux/macOS (bash)
- Single command to seed the DB and run the app
- Frontend served by the backend to avoid CORS and cross-port issues
- Clear instructions and minimal concepts to get started

Quick start (Windows PowerShell)

1. Open PowerShell in the repository root.
2. Create a virtual environment and install dependencies:

   .\BACKEND\setup.ps1

3. Seed the DB and run the server:

   .\BACKEND\run-dev.ps1

4. Open http://127.0.0.1:5000 in your browser — you should see the frontend served from the backend.

Notes

- Backend uses Flask + SQLite for simplicity.
- Frontend is static HTML/CSS/JS placed in `FRONTEND/` and served by Flask.
- To reset the DB, re-run `python BACKEND\seed.py` or delete `BACKEND\data.db` and seed again.

If you want, I can also add a single PowerShell script that opens the browser automatically and checks the health endpoint.