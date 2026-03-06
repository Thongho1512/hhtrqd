import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 120000, // 2 min for training
});

// ─── ML ──────────────────────────────────────────────────────────────────── //
export const trainModel = () => api.post('/api/ml/train');
export const predictAttrition = (data) => api.post('/api/ml/predict', data);
export const getModelStatus = () => api.get('/api/ml/status');
export const getDepartmentPrediction = (dept) => api.get(`/api/ml/predict/department/${dept}`);

// ─── Dashboard ───────────────────────────────────────────────────────────── //
export const getDashboardSummary = () => api.get('/api/dashboard/summary');
export const getEmployeeDetail = (id) => api.get(`/api/dashboard/employee/${id}`);

export default api;
