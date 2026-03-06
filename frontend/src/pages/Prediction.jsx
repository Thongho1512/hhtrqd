import React, { useState, useEffect } from 'react';
import { BrainCircuit, AlertCircle, Users, Search, Filter, X, Briefcase, MapPin, GraduationCap, DollarSign, Clock, Zap, Heart, Star, Info } from 'lucide-react';
import { getDepartmentPrediction, getDashboardSummary, getEmployeeDetail } from '../api/api';

/* ─── Risk Chip Component ────────────────────────────────────────────── */
function RiskChip({ level }) {
    const chipClass = level === 'HIGH' ? 'chip-danger' : level === 'MEDIUM' ? 'chip-warning' : 'chip-success';
    const label = level === 'HIGH' ? 'CAO' : level === 'MEDIUM' ? 'TRUNG BÌNH' : 'THẤP';
    return <span className={`chip ${chipClass}`}>{label}</span>;
}

/* ─── Employee Detail Modal ─────────────────────────────────────────── */
function EmployeeModal({ employeeId, onClose }) {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!employeeId) return;
        setLoading(true);
        getEmployeeDetail(employeeId)
            .then(res => setDetail(res.data))
            .catch(err => setError('Không thể tải thông tin chi tiết.'))
            .finally(() => setLoading(false));
    }, [employeeId]);

    if (!employeeId) return null;

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex',
            alignItems: 'center', justifyContent: 'center', padding: '20px'
        }} onClick={onClose}>
            <div className="card" style={{
                width: '100%', maxWidth: '800px', maxHeight: '90vh',
                overflowY: 'auto', position: 'relative', border: '1px solid var(--border-glow)',
                boxShadow: '0 0 50px rgba(0,0,0,0.5)'
            }} onClick={e => e.stopPropagation()}>

                <button onClick={onClose} style={{
                    position: 'absolute', top: '20px', right: '20px',
                    background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-secondary)',
                    padding: '8px', borderRadius: '50%', cursor: 'pointer', zIndex: 10
                }}>
                    <X size={20} />
                </button>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    {loading ? (
                        <div style={{ padding: '60px', textAlign: 'center' }}>
                            <div className="spinner" />
                            <p style={{ marginTop: '20px', color: 'var(--text-secondary)' }}>Đang tải thông tin nhân viên...</p>
                        </div>
                    ) : error ? (
                        <div className="alert alert-error">{error}</div>
                    ) : (
                        <div style={{ padding: '10px' }}>
                            {/* Header Section */}
                            <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', borderBottom: '1px solid var(--border-color)', paddingBottom: '24px' }}>
                                <div style={{
                                    width: '80px', height: '80px', borderRadius: '20px',
                                    background: 'var(--gradient-hero)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800
                                }}>
                                    {detail.gender === 'Female' ? '👩' : '👨'}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '4px' }}>Nhân viên #{detail.employee_id}</h3>
                                    <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={14} /> {detail.age} tuổi, {detail.gender}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Heart size={14} /> {detail.marital_status}</span>
                                    </div>
                                    <div style={{ marginTop: '12px' }}>
                                        <span className="chip chip-primary">{detail.job_role}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
                                {/* Group: Job */}
                                <div>
                                    <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px', letterSpacing: '0.1em' }}>Công việc</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Phòng ban:</span>
                                            <span style={{ fontWeight: 600 }}>{detail.department}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Cấp bậc:</span>
                                            <span style={{ fontWeight: 600 }}>Level {detail.job_level}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Thu nhập:</span>
                                            <span style={{ fontWeight: 700, color: 'var(--accent-success)' }}>${detail.monthly_income.toLocaleString()}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Làm thêm:</span>
                                            <span style={{ fontWeight: 600, color: detail.over_time === 'Yes' ? 'var(--accent-danger)' : 'var(--text-primary)' }}>{detail.over_time}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Group: Experience */}
                                <div>
                                    <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px', letterSpacing: '0.1em' }}>Kinh nghiệm</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Tổng số năm làm:</span>
                                            <span style={{ fontWeight: 600 }}>{detail.total_working_years} năm</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Tại công ty:</span>
                                            <span style={{ fontWeight: 600 }}>{detail.years_at_company} năm</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Vị trí hiện tại:</span>
                                            <span style={{ fontWeight: 600 }}>{detail.years_in_current_role} năm</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Lần đề bạt cuối:</span>
                                            <span style={{ fontWeight: 600 }}>{detail.years_since_last_promotion} năm trước</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Group: Satisfaction */}
                                <div>
                                    <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px', letterSpacing: '0.1em' }}>Đánh giá & Hài lòng</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Hài lòng công việc:</span>
                                            <div style={{ display: 'flex', gap: '2px' }}>
                                                {[...Array(4)].map((_, i) => <Star key={i} size={12} fill={i < detail.job_satisfaction ? 'var(--accent-warning)' : 'none'} color="var(--accent-warning)" />)}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Môi trường:</span>
                                            <div style={{ display: 'flex', gap: '2px' }}>
                                                {[...Array(4)].map((_, i) => <Star key={i} size={12} fill={i < detail.environment_satisfaction ? 'var(--accent-tertiary)' : 'none'} color="var(--accent-tertiary)" />)}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Cân bằng LS:</span>
                                            <div style={{ display: 'flex', gap: '2px' }}>
                                                {[...Array(4)].map((_, i) => <Star key={i} size={12} fill={i < detail.work_life_balance ? 'var(--accent-primary)' : 'none'} color="var(--accent-primary)" />)}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Hiệu suất:</span>
                                            <span style={{ fontWeight: 700, color: detail.performance_rating >= 3 ? 'var(--accent-success)' : 'var(--text-primary)' }}>Cấp {detail.performance_rating}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '32px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '12px' }}>
                                <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                                <p>Khoảng cách từ nhà đến nơi làm là <strong>{detail.distance_from_home} km</strong>. Hình thức di chuyển công tác: <strong>{detail.business_travel}</strong>. Chuyên môn đào tạo: <strong>{detail.education_field}</strong>.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ─── Main Component ───────────────────────────────────────────────────── */
export default function Prediction() {
    const [departments, setDepartments] = useState(['Sales', 'Research & Development', 'Human Resources']);
    const [selectedDept, setSelectedDept] = useState('Sales');
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch departments for the dropdown
    useEffect(() => {
        const fetchDepts = async () => {
            try {
                const res = await getDashboardSummary();
                if (res.data && res.data.departmentStats) {
                    const depts = res.data.departmentStats.map(d => d.department);
                    if (depts.length > 0) {
                        setDepartments(depts);
                        setSelectedDept(depts[0]);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch departments from API", err);
            }
        };
        fetchDepts();
    }, []);

    const handlePredict = async () => {
        if (!selectedDept) return;
        setLoading(true);
        setError('');
        setCurrentPage(1);
        try {
            const res = await getDepartmentPrediction(selectedDept);
            setEmployees(res.data.employeeRisks);
        } catch (err) {
            setError(err.response?.data?.detail || 'Không thể tải danh sách dự đoán. Hãy đảm bảo Model đã được huấn luyện.');
        } finally {
            setLoading(false);
        }
    };

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEmployees = employees.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(employees.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ padding: '12px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', color: 'var(--accent-primary)' }}>
                        <Users size={28} />
                    </div>
                    <div>
                        <h2>Dự đoán theo Phòng ban</h2>
                        <p>Phân tích rủi ro nghỉ việc cho toàn bộ nhân viên trong phòng ban.</p>
                    </div>
                </div>
            </div>

            {/* Selection Section */}
            <div className="card">
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div className="card-title">Cấu hình phân tích</div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', flexWrap: 'wrap' }}>
                        <div className="form-group" style={{ flex: 1, minWidth: '240px' }}>
                            <label className="form-label">Chọn Phòng ban</label>
                            <select
                                className="form-select"
                                value={selectedDept}
                                onChange={(e) => setSelectedDept(e.target.value)}
                                id="select-department"
                                style={{ cursor: 'pointer', position: 'relative', zIndex: 10 }}
                            >
                                <option value="" disabled>-- Chọn phòng ban --</option>
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={handlePredict}
                            disabled={loading || !selectedDept}
                            id="btn-run-prediction"
                        >
                            {loading ? <div className="spinner" style={{ width: '20px', height: '20px' }} /> : <BrainCircuit size={20} />}
                            Phân tích rủi ro
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="alert alert-error">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            {/* Employee List Section */}
            {employees.length > 0 && (
                <div className="card">
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Filter size={18} style={{ color: 'var(--accent-primary)' }} />
                                <div className="card-title" style={{ margin: 0 }}>Nhân viên rủi ro ({selectedDept})</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', display: 'block' }}>
                                    Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, employees.length)} trên tổng số {employees.length} nhân viên
                                </span>
                                <span style={{ fontSize: '0.65rem', color: 'var(--accent-tertiary)', fontWeight: 600 }}>* Nhấn vào dòng để xem chi tiết</span>
                            </div>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Mã NV</th>
                                        <th>Chức danh</th>
                                        <th>Tuổi</th>
                                        <th style={{ textAlign: 'right' }}>Thu nhập</th>
                                        <th style={{ textAlign: 'center' }}>Xác suất</th>
                                        <th style={{ textAlign: 'center' }}>Mức độ rủi ro</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentEmployees.map((emp) => (
                                        <tr
                                            key={emp.employeeId}
                                            onClick={() => setSelectedEmployeeId(emp.employeeId)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <td style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>#{emp.employeeId}</td>
                                            <td>{emp.jobRole}</td>
                                            <td>{emp.age}</td>
                                            <td style={{ textAlign: 'right', fontWeight: 600 }}>
                                                ${emp.monthlyIncome.toLocaleString()}
                                            </td>
                                            <td className="rate-bar-cell">
                                                <div className="rate-bar">
                                                    <div className="rate-bar-track">
                                                        <div
                                                            className="rate-bar-fill"
                                                            style={{
                                                                width: `${emp.probability * 100}%`,
                                                                background: emp.riskLevel === 'HIGH' ? 'var(--gradient-danger)' :
                                                                    emp.riskLevel === 'MEDIUM' ? 'var(--gradient-warning)' : 'var(--gradient-success)'
                                                            }}
                                                        />
                                                    </div>
                                                    <span style={{ minWidth: '45px', fontSize: '0.8rem', fontWeight: 700 }}>
                                                        {(emp.probability * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <RiskChip level={emp.riskLevel} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div style={{
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                gap: '8px', marginTop: '24px', padding: '12px 0',
                                borderTop: '1px solid var(--border-color)'
                            }}>
                                <button
                                    className="btn btn-secondary" style={{ padding: '6px 12px' }}
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Trước
                                </button>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {[...Array(totalPages)].map((_, i) => {
                                        const page = i + 1;
                                        if (totalPages > 7 && Math.abs(page - currentPage) > 2 && page !== 1 && page !== totalPages) {
                                            if (Math.abs(page - currentPage) === 3) return <span key={page} style={{ color: 'var(--text-muted)' }}>...</span>;
                                            return null;
                                        }
                                        return (
                                            <button
                                                key={page} onClick={() => paginate(page)}
                                                className={`nav-item ${currentPage === page ? 'active' : ''}`}
                                                style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, borderRadius: '8px' }}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    className="btn btn-secondary" style={{ padding: '6px 12px' }}
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Sau
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {!loading && employees.length === 0 && !error && (
                <div style={{ padding: '80px 20px', textAlign: 'center', opacity: 0.5 }}>
                    <Search size={64} style={{ marginBottom: '20px', color: 'var(--text-muted)' }} />
                    <p style={{ fontSize: '1.1rem' }}>Vui lòng chọn phòng ban và nhấn "Phân tích rủi ro" để xem kết quả.</p>
                </div>
            )}

            {/* Popup Modal */}
            <EmployeeModal
                employeeId={selectedEmployeeId}
                onClose={() => setSelectedEmployeeId(null)}
            />
        </div>
    );
}
