import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { createEmployee, updateEmployee } from '../api/api';

export default function EmployeeEditModal({ employee, onClose, onSaved }) {
    const isEdit = !!employee;
    const [formData, setFormData] = useState({
        age: 30,
        attrition: 'No',
        business_travel: 'Travel_Rarely',
        daily_rate: 800,
        department: 'Research & Development',
        distance_from_home: 1,
        education: 3,
        education_field: 'Life Sciences',
        environment_satisfaction: 3,
        gender: 'Male',
        hourly_rate: 60,
        job_involvement: 3,
        job_level: 1,
        job_role: 'Research Scientist',
        job_satisfaction: 3,
        marital_status: 'Married',
        monthly_income: 5000,
        monthly_rate: 15000,
        num_companies_worked: 1,
        over_time: 'No',
        percent_salary_hike: 11,
        performance_rating: 3,
        relationship_satisfaction: 3,
        stock_option_level: 0,
        total_working_years: 1,
        training_times_last_year: 3,
        work_life_balance: 3,
        years_at_company: 1,
        years_in_current_role: 1,
        years_since_last_promotion: 0,
        years_with_curr_manager: 0
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (employee) {
            setFormData(employee);
        }
    }, [employee]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEdit) {
                await updateEmployee(employee.employee_id, formData);
            } else {
                await createEmployee(formData);
            }
            onSaved();
        } catch (err) {
            setError(err.response?.data?.detail || 'Lỗi khi lưu thông tin nhân viên.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex',
            alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
            <div className="card" style={{
                width: '100%', maxWidth: '900px', maxHeight: '90vh',
                overflowY: 'auto', padding: '0', position: 'relative'
            }}>
                <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                        {isEdit ? `Chỉnh sửa nhân viên #${employee.employee_id}` : 'Thêm nhân viên mới'}
                    </h3>
                    <button onClick={onClose} className="btn-icon">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
                    {error && (
                        <div className="alert alert-error" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <AlertCircle size={20} /> {error}
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        {/* Section 1: Basic Info */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <h4 style={{ color: 'var(--accent-primary)', marginBottom: '16px', fontWeight: 700 }}>Thông tin cơ bản</h4>
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">Tuổi</label>
                            <input type="number" name="age" className="form-input" value={formData.age} onChange={handleChange} required min="18" max="65" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Giới tính</label>
                            <select name="gender" className="form-select" value={formData.gender} onChange={handleChange}>
                                <option value="Male">Nam</option>
                                <option value="Female">Nữ</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Hôn nhân</label>
                            <select name="marital_status" className="form-select" value={formData.marital_status} onChange={handleChange}>
                                <option value="Single">Độc thân</option>
                                <option value="Married">Đã kết hôn</option>
                                <option value="Divorced">Ly hôn</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Khoảng cách đi làm (km)</label>
                            <input type="number" name="distance_from_home" className="form-input" value={formData.distance_from_home} onChange={handleChange} required />
                        </div>

                        {/* Section 2: Job Info */}
                        <div style={{ gridColumn: '1 / -1', marginTop: '20px' }}>
                            <h4 style={{ color: 'var(--accent-tertiary)', marginBottom: '16px', fontWeight: 700 }}>Công việc & Tổ chức</h4>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Phòng ban</label>
                            <select name="department" className="form-select" value={formData.department} onChange={handleChange}>
                                <option value="Research & Development">Research & Development</option>
                                <option value="Sales">Sales</option>
                                <option value="Human Resources">Human Resources</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Chức vụ</label>
                            <input type="text" name="job_role" className="form-input" value={formData.job_role} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Cấp bậc (1-5)</label>
                            <input type="number" name="job_level" className="form-input" value={formData.job_level} onChange={handleChange} required min="1" max="5" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Mức độ công tác</label>
                            <select name="business_travel" className="form-select" value={formData.business_travel} onChange={handleChange}>
                                <option value="Non-Travel">Không đi</option>
                                <option value="Travel_Rarely">Hiếm khi</option>
                                <option value="Travel_Frequently">Thường xuyên</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Làm thêm (OT)</label>
                            <select name="over_time" className="form-select" value={formData.over_time} onChange={handleChange}>
                                <option value="No">Không</option>
                                <option value="Yes">Có</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Lĩnh vực học vấn</label>
                            <input type="text" name="education_field" className="form-input" value={formData.education_field} onChange={handleChange} required />
                        </div>

                        {/* Section 3: Finance */}
                        <div style={{ gridColumn: '1 / -1', marginTop: '20px' }}>
                            <h4 style={{ color: 'var(--accent-success)', marginBottom: '16px', fontWeight: 700 }}>Tài chính & Thu nhập</h4>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Lương tháng ($)</label>
                            <input type="number" name="monthly_income" className="form-input" value={formData.monthly_income} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Lương ngày ($)</label>
                            <input type="number" name="daily_rate" className="form-input" value={formData.daily_rate} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Lương giờ ($)</label>
                            <input type="number" name="hourly_rate" className="form-input" value={formData.hourly_rate} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">% Tăng lương</label>
                            <input type="number" name="percent_salary_hike" className="form-input" value={formData.percent_salary_hike} onChange={handleChange} required />
                        </div>

                        {/* Section 4: Experience */}
                        <div style={{ gridColumn: '1 / -1', marginTop: '20px' }}>
                            <h4 style={{ color: 'var(--accent-warning)', marginBottom: '16px', fontWeight: 700 }}>Thâm niên & Đánh giá</h4>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Tổng số năm làm</label>
                            <input type="number" name="total_working_years" className="form-input" value={formData.total_working_years} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Số năm tại công ty</label>
                            <input type="number" name="years_at_company" className="form-input" value={formData.years_at_company} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Số năm vị trí hiện tại</label>
                            <input type="number" name="years_in_current_role" className="form-input" value={formData.years_in_current_role} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Hiệu suất (3-4)</label>
                            <input type="number" name="performance_rating" className="form-input" value={formData.performance_rating} onChange={handleChange} required min="3" max="4" />
                        </div>
                    </div>

                    <div style={{ marginTop: '40px', display: 'flex', gap: '16px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                        <button type="button" onClick={onClose} className="btn btn-secondary">Hủy bỏ</button>
                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Save size={18} /> {loading ? 'Đang lưu...' : 'Lưu thông tin'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
