@echo off
echo Starting HR Attrition Backend (FastAPI)...
start "HR Backend" cmd /k "cd /d D:\HHTRQD\source\backend && C:\laragon\bin\python\python-3.13\python.exe -m uvicorn run:app --reload --host 0.0.0.0 --port 8000"
timeout /t 3 /nobreak
echo Starting HR Attrition Frontend (React)...
start "HR Frontend" cmd /k "cd /d D:\HHTRQD\source\frontend && npm run dev"
timeout /t 4 /nobreak
echo.
echo -----------------------------------------
echo Backend:  http://localhost:8000
echo Swagger:  http://localhost:8000/docs
echo Frontend: http://localhost:5173
echo -----------------------------------------
start http://localhost:5173
