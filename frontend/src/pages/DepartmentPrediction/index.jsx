import React, { useState, useEffect } from 'react';
import {
    BrainCircuit, Users, AlertTriangle, CheckCircle, TrendingUp,
    Search, Filter, Eye, FileText, ChevronRight, BarChart3, PieChart
} from 'lucide-react';
import { getDashboardSummary, predictDepartmentV1 } from '../../api/api';
import RiskTable from './RiskTable';
import RiskCharts from './RiskCharts';

export default function DepartmentPrediction({ onNavigate, predictionData, setPredictionData, selectedDept, setSelectedDept, setAhpContext }) {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Load departments for the dropdown
        getDashboardSummary().then(res => {
            if (res.data?.departmentStats) {
                setDepartments(res.data.departmentStats.map(d => d.department));
                if (res.data.departmentStats.length > 0) {
                    setSelectedDept(res.data.departmentStats[0].department);
                }
            }
        });
    }, []);

    const handleRunAnalysis = async () => {
        if (!selectedDept) return;
        setLoading(true);
        setError('');
        try {
            const res = await predictDepartmentV1(selectedDept);
            setPredictionData(res.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Lỗi khi chạy phân tích AI.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Header section */}
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>
                        Phân tích nguy cơ nghỉ việc
                    </h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Chọn phòng ban và chạy mô hình AI để nhận diện rủi ro nhân sự.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
                    <div className="form-group" style={{ margin: 0, minWidth: '200px' }}>
                        <label className="form-label">Phòng ban</label>
                        <select
                            className="form-select"
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                        >
                            <option value="">-- Chọn phòng ban --</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={handleRunAnalysis}
                        disabled={loading || !selectedDept}
                        style={{ height: '48px', padding: '0 24px' }}
                    >
                        {loading ? <div className="spinner" style={{ width: '20px', height: '20px' }} /> : <BrainCircuit size={20} />}
                        Chạy phân tích AI
                    </button>
                </div>
            </div>

            {predictionData && (
                <>
                    {/* KPI Cards */}
                    <div className="stats-grid">
                        <div className="card stat-card">
                            <div className="stat-label">Tổng nhân viên</div>
                            <div className="stat-value">{predictionData.department.total_employees}</div>
                            <div className="stat-icon" style={{ color: 'var(--accent-primary)' }}><Users /></div>
                        </div>
                        <div className="card stat-card" style={{ borderLeft: '4px solid #ef4444' }}>
                            <div className="stat-label">Nguy cơ CAO</div>
                            <div className="stat-value" style={{ color: '#ef4444' }}>{predictionData.summary.highRiskCount}</div>
                            <div className="stat-icon" style={{ color: '#ef4444' }}><AlertTriangle /></div>
                        </div>
                        <div className="card stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
                            <div className="stat-label">Nguy cơ TRUNG BÌNH</div>
                            <div className="stat-value" style={{ color: '#f59e0b' }}>{predictionData.summary.mediumRiskCount}</div>
                            <div className="stat-icon" style={{ color: '#f59e0b' }}><TrendingUp /></div>
                        </div>
                        <div className="card stat-card" style={{ borderLeft: '4px solid #22c55e' }}>
                            <div className="stat-label">Nguy cơ THẤP</div>
                            <div className="stat-value" style={{ color: '#22c55e' }}>{predictionData.summary.lowRiskCount}</div>
                            <div className="stat-icon" style={{ color: '#22c55e' }}><CheckCircle /></div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <RiskCharts summary={predictionData.summary} />

                    {/* Employee Table Section */}
                    <RiskTable
                        employees={predictionData.employeeRisks}
                        onNavigate={onNavigate}
                        setAhpContext={setAhpContext}
                    />
                </>
            )}

            {!predictionData && !loading && (
                <div className="card" style={{ padding: '80px', textAlign: 'center', opacity: 0.7 }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <BrainCircuit size={40} color="var(--accent-primary)" />
                    </div>
                    <h3>Sẵn sàng phân tích</h3>
                    <p>Chọn một phòng ban ở góc trên bên phải để bắt đầu dự đoán.</p>
                </div>
            )}
        </div>
    );
}
