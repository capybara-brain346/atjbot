@echo off

:: Start the frontend
start cmd /c "cd frontend\react-chatbot && npm start"

:: Start the backend
python backend\app.py
