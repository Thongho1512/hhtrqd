# HR Attrition Prediction System

AI-powered workforce analytics platform built with FastAPI + React.

## Architecture

```
source/
├── WA_Fn-UseC_-HR-Employee-Attrition.csv   ← Dataset (no database needed)
├── backend/                                 ← Python FastAPI
│   ├── app/
│   │   ├── domain/         ← Entities (EmployeeRecord, PredictionResult)
│   │   ├── application/    ← DTOs, Interfaces, App Services
│   │   ├── infrastructure/ ← CSVLoader, SklearnMLService
│   │   └── api/            ← Routers, Dependencies (DI)
│   ├── requirements.txt
│   └── run.py
└── frontend/               ← React + Vite
    └── src/
        ├── pages/
        │   ├── Dashboard.jsx   ← Stats + Charts
        │   ├── TrainModel.jsx  ← Training + Metrics
        │   └── Prediction.jsx  ← Employee form + result
        └── api/api.js
```

## Quick Start

### 1. Start Backend (FastAPI)
```powershell
cd backend
C:\laragon\bin\python\python-3.13\python.exe -m uvicorn run:app --reload --port 8000
```

### 2. Start Frontend (React)
```powershell
cd frontend
npm run dev
```

### 3. Open in browser
- **Website**: http://localhost:5173
- **Swagger API docs**: http://localhost:8000/docs

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/dashboard/summary` | Dataset statistics |
| POST | `/api/ml/train` | Train RandomForest model |
| POST | `/api/ml/predict` | Predict employee attrition |
| GET | `/api/ml/status` | Check model status |

## ML Pipeline

1. Load CSV → 1470 employee records
2. Drop constant columns (EmployeeCount, Over18, etc.)
3. Encode label (Attrition: Yes→1, No→0)
4. ColumnTransformer: StandardScaler (numeric) + OneHotEncoder (categorical)
5. RandomForestClassifier (200 trees, balanced class weight)
6. Evaluate on 20% stratified holdout
7. Save with joblib (version-stamped)
