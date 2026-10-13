#!/bin/bash
# Startup script for Customer Purchase Prediction System

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=========================================================="
echo " Starting Customer Purchase Prediction & Recommendation System"
echo "=========================================================="

# Start backend
echo "Starting FastAPI Backend on http://127.0.0.1:8000 ..."
"$ROOT_DIR/.venv/bin/uvicorn" backend.main:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

# Wait for backend
sleep 2

# Start frontend
echo "Starting Vite Frontend on http://127.0.0.1:5173 ..."
cd "$ROOT_DIR/frontend"
npm run dev -- --host 127.0.0.1 --port 5173 &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM EXIT

wait
