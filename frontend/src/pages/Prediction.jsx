import React, { useState } from 'react';
import { BrainCircuit, AlertCircle, Send, RotateCcw } from 'lucide-react';
import { predictAttrition } from '../api/api';

/* ─── Default form values ──────────────────────────────────────────────── */
const DEFAULTS = {
    Age: 35, BusinessTravel: 'Travel_Rarely',
    DailyRate: 802, Department: 'Research & Development',
    DistanceFromHome: 5, Education: 3,
    EducationField: 'Life Sciences', EnvironmentSatisfaction: 3,
    Gender: 'Male', HourlyRate: 65,
    JobInvolvement: 3, JobLevel: 2,
    JobRole: 'Sales Executive', JobSatisfaction: 3,
    MaritalStatus: 'Single', MonthlyIncome: 5000,
    MonthlyRate: 15000, NumCompaniesWorked: 2,
    OverTime: 'Yes', PercentSalaryHike: 13,
    PerformanceRating: 3, RelationshipSatisfaction: 3,
    StockOptionLevel: 1, TotalWorkingYears: 8,
    TrainingTimesLastYear: 3, WorkLifeBalance: 3,
    YearsAtCompany: 5, YearsInCurrentRole: 3,
    YearsSinceLastPromotion: 1, YearsWithCurrManager: 4,
};

/* ─── Select options ─────────────────────────────────────────────────────── */
const OPTIONS = {
    BusinessTravel: {
        'Non-Travel': 'Không đi công tác',
        'Travel_Rarely': 'Hiếm khi đi công tác',
        'Travel_Frequently': 'Thường xuyên đi công tác'
    },
    Department: {
        'Human Resources': 'Nhân sự',
        'Research & Development': 'Nghiên cứu & Phát triển',
        'Sales': 'Kinh doanh'
    },
    EducationField: {
        'Human Resources': 'Nhân sự',
        'Life Sciences': 'Khoa học Đời sống',
        'Marketing': 'Tiếp thị',
        'Medical': 'Y tế',
        'Other': 'Khác',
        'Technical Degree': 'Bằng Kỹ thuật'
    },
    Gender: {
        'Female': 'Nữ',
        'Male': 'Nam'
    },
    JobRole: {
        'Healthcare Representative': 'Đại diện Chăm sóc Sức khỏe',
        'Human Resources': 'Nhân viên Nhân sự',
        'Laboratory Technician': 'Kỹ thuật viên Phòng thí nghiệm',
        'Manager': 'Quản lý',
        'Manufacturing Director': 'Giám đốc Sản xuất',
        'Research Director': 'Giám đốc Nghiên cứu',
        'Research Scientist': 'Nhà khoa học Nghiên cứu',
        'Sales Executive': 'Chuyên viên Kinh doanh',
        'Sales Representative': 'Đại diện Kinh doanh',
    },
    MaritalStatus: {
        'Divorced': 'Ly hôn',
        'Married': 'Đã kết hôn',
        'Single': 'Độc thân'
    },
    OverTime: {
        'No': 'Không',
        'Yes': 'Có'
    },
};

/* ─── Field metadata ─────────────────────────────────────────────────────── */
const FIELDS = [
    // Section: Personal
    { key: 'Age', label: 'Tuổi', type: 'number', min: 18, max: 65 },
    { key: 'Gender', label: 'Giới tính', type: 'select' },
    { key: 'MaritalStatus', label: 'Tình trạng hôn nhân', type: 'select' },

    // Section: Employment
    { key: 'Department', label: 'Phòng ban', type: 'select' },
    { key: 'JobRole', label: 'Chức danh', type: 'select' },
    { key: 'JobLevel', label: 'Cấp bậc (1–5)', type: 'number', min: 1, max: 5 },
    { key: 'BusinessTravel', label: 'Đi công tác', type: 'select' },
    { key: 'OverTime', label: 'Làm thêm giờ', type: 'select' },
    { key: 'EducationField', label: 'Chuyên ngành học', type: 'select' },

    // Section: Compensation
    { key: 'MonthlyIncome', label: 'Thu nhập hàng tháng ($)', type: 'number', min: 1000, max: 20000 },
    { key: 'DailyRate', label: 'Mức lương ngày', type: 'number', min: 100, max: 1500 },
    { key: 'HourlyRate', label: 'Mức lương giờ', type: 'number', min: 30, max: 100 },
    { key: 'MonthlyRate', label: 'Mức lương tháng', type: 'number', min: 2000, max: 27000 },
    { key: 'PercentSalaryHike', label: '% Tăng lương', type: 'number', min: 11, max: 25 },
    { key: 'StockOptionLevel', label: 'Quyền mua cổ phiếu (0–3)', type: 'number', min: 0, max: 3 },

    // Section: Satisfaction
    { key: 'JobSatisfaction', label: 'Hài lòng công việc (1–4)', type: 'number', min: 1, max: 4 },
    { key: 'EnvironmentSatisfaction', label: 'Hài lòng môi trường (1–4)', type: 'number', min: 1, max: 4 },
    { key: 'WorkLifeBalance', label: 'Cân bằng đời sống (1–4)', type: 'number', min: 1, max: 4 },
    { key: 'RelationshipSatisfaction', label: 'Hài lòng mối quan hệ (1–4)', type: 'number', min: 1, max: 4 },
    { key: 'JobInvolvement', label: 'Mức độ gắn kết (1–4)', type: 'number', min: 1, max: 4 },

    // Section: Experience
    { key: 'TotalWorkingYears', label: 'Tổng số năm làm việc', type: 'number', min: 0, max: 40 },
    { key: 'YearsAtCompany', label: 'Số năm tại công ty', type: 'number', min: 0, max: 40 },
    { key: 'YearsInCurrentRole', label: 'Số năm chức vụ hiện tại', type: 'number', min: 0, max: 18 },
    { key: 'YearsSinceLastPromotion', label: 'Số năm kể từ lần thăng tiến cuối', type: 'number', min: 0, max: 15 },
    { key: 'YearsWithCurrManager', label: 'Số năm làm với quản lý hiện tại', type: 'number', min: 0, max: 17 },
    { key: 'NumCompaniesWorked', label: 'Số công ty đã làm việc', type: 'number', min: 0, max: 9 },
    { key: 'DistanceFromHome', label: 'Khoảng cách từ nhà (mi)', type: 'number', min: 1, max: 30 },
    { key: 'Education', label: 'Trình độ học vấn (1–5)', type: 'number', min: 1, max: 5 },
    { key: 'TrainingTimesLastYear', label: 'Số lần đào tạo năm ngoái', type: 'number', min: 0, max: 6 },
    { key: 'PerformanceRating', label: 'Đánh giá năng lực (3–4)', type: 'number', min: 3, max: 4 },
];

/* ─── PredictionResultPanel ──────────────────────────────────────────────── */
function PredictionResultPanel({ result }) {
    const riskLower = result.riskLevel.toLowerCase();
    const pct = Math.round(result.probability * 100);

    const messages = {
        high: {
            verdict: '⚠ Nguy cơ Nghỉ việc CAO',
            desc: 'Nhân viên này có xác suất nghỉ việc lớn. Cần xem xét các chiến lược giữ chân: xem xét mức lương, lộ trình sự nghiệp hoặc cải thiện cân bằng đời sống.',
        },
        medium: {
            verdict: '⚡ Nguy cơ Nghỉ việc TRUNG BÌNH',
            desc: 'Có một số yếu tố dẫn đến rủi ro nghỉ việc. Việc chủ động trao đổi và tham gia các hoạt động gắn kết có thể giúp giữ chân nhân viên này.',
        },
        low: {
            verdict: '✓ Nguy cơ Nghỉ việc THẤP',
            desc: 'Nhân viên này có khả năng cao sẽ ở lại. Mức độ gắn kết có vẻ tốt. Hãy tiếp tục theo dõi độ hài lòng định kỳ.',
        },
    };

    const { verdict, desc } = messages[riskLower];

    return (
        <div className={`prediction-result ${riskLower}`}>
            <div className={`result-badge ${riskLower}`}>RỦI RO {result.riskLevel === 'HIGH' ? 'CAO' : result.riskLevel === 'MEDIUM' ? 'TRUNG BÌNH' : 'THẤP'}</div>
            <div className="result-verdict">{verdict}</div>
            <div className="result-description">{desc}</div>

            {/* Probability bar */}
            <div style={{ maxWidth: 320, margin: '0 auto' }}>
                <div className="probability-bar">
                    <div
                        className={`probability-fill ${riskLower}`}
                        style={{ width: `${pct}%` }}
                    />
                </div>
                <div className="probability-label">
                    <span>0%</span>
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                        Xác suất nghỉ việc: {pct}%
                    </span>
                    <span>100%</span>
                </div>
            </div>
        </div>
    );
}

/* ─── Main Component ───────────────────────────────────────────────────── */
export default function Prediction() {
    const [form, setForm] = useState(DEFAULTS);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const res = await predictAttrition(form);
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.detail || err.message || 'Dự đoán thất bại');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => { setForm(DEFAULTS); setResult(null); setError(''); };

    return (
        <div>
            <div className="page-header">
                <h2>Dự đoán Nghỉ việc</h2>
                <p>Nhập thông tin nhân viên để dự đoán khả năng nghỉ việc tự nguyện.</p>
            </div>

            {error && (
                <div className="alert alert-error" style={{ marginBottom: 24 }}>
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}

            {/* ── Result Panel ──────────────────────────────────── */}
            {result && (
                <div style={{ marginBottom: 28 }}>
                    <PredictionResultPanel result={result} />
                </div>
            )}

            {/* ── Form ──────────────────────────────────────────── */}
            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <div className="card-title" style={{ margin: 0 }}>
                        Thông tin nhân viên
                    </div>
                    <button className="btn btn-secondary" onClick={handleReset} type="button" id="btn-reset-form">
                        <RotateCcw size={14} />
                        Làm mới
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        {FIELDS.map(({ key, label, type, min, max }) => (
                            <div className="form-group" key={key}>
                                <label className="form-label" htmlFor={`field-${key}`}>{label}</label>
                                {type === 'select' ? (
                                    <select
                                        id={`field-${key}`}
                                        className="form-select"
                                        name={key}
                                        value={form[key]}
                                        onChange={handleChange}
                                    >
                                        {Object.entries(OPTIONS[key]).map(([val, label]) => (
                                            <option key={val} value={val}>{label}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        id={`field-${key}`}
                                        className="form-input"
                                        type="number"
                                        name={key}
                                        value={form[key]}
                                        min={min}
                                        max={max}
                                        onChange={handleChange}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: 28, display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                        <button
                            type="submit"
                            id="btn-predict"
                            className="btn btn-primary btn-lg"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                                    Đang phân tích…
                                </>
                            ) : (
                                <>
                                    <BrainCircuit size={18} />
                                    Dự đoán Nghỉ việc
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
