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

// ─── V1 Decision Support (Steps 1-4) ─────────────────────────────────────── //
export const predictDepartmentV1 = (deptId) => api.post('/api/v1/predictions/department', null, { params: { department_id: deptId } });
export const computeAHP = (groupCode, criteriaMatrix, alternativesMatrices = null) =>
    api.post('/api/v1/ahp/compute', {
        group_code: groupCode,
        criteria_matrix: criteriaMatrix,
        ...(alternativesMatrices ? { alternatives_matrices: alternativesMatrices } : {})
    });
export const getStrategyGroups = () => api.get('/api/v1/ahp/groups');
export const saveAHPResults = (data) => api.post('/api/v1/ahp/save-results', data);

// ─── Notes & Profile (Step 6) ────────────────────────────────────────────── //
export const getEmployeeNotes = (empId) => api.get(`/api/v1/notes/${empId}`);
export const createNote = (data) => api.post('/api/v1/notes/', data);
export const updateAttentionLevel = (data) => api.put('/api/v1/notes/attention', data);

export default api;
