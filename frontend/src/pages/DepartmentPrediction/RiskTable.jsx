import React, { useState } from 'react';
import { Eye, FileText, Search, Filter, Activity } from 'lucide-react';
import EmployeeModal from '../../components/EmployeeModal';
import { t } from '../../utils/translations';

export default function RiskTable({ employees, onNavigate, setAhpContext }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLevel, setFilterLevel] = useState('All');
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

    const filtered = employees.filter(emp => {
        const matchesSearch = emp.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.employeeId.toString().includes(searchTerm);
        const matchesLevel = filterLevel === 'All' || emp.riskLevel === filterLevel;
        return matchesSearch && matchesLevel;
    });

    return (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div className="card-title" style={{ margin: 0 }}>Danh sách nhân viên dự báo</div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Tìm tên hoặc ID..."
                            style={{ paddingLeft: '36px', width: '220px', height: '38px' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select className="form-select" style={{ width: '150px', height: '38px' }} value={filterLevel} onChange={e => setFilterLevel(e.target.value)}>
                        <option value="All">Mọi mức độ</option>
                        <option value="HIGH">Rủi ro CAO</option>
                        <option value="MEDIUM">Trung bình</option>
                        <option value="LOW">Thấp</option>
                    </select>
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Mã NV / Họ tên</th>
                            <th>Chức vụ</th>
                            <th style={{ textAlign: 'center' }}>Thâm niên</th>
                            <th style={{ width: '200px' }}>Tỉ lệ nghỉ việc</th>
                            <th style={{ textAlign: 'center' }}>Mức độ</th>
                            <th style={{ textAlign: 'right' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((emp, idx) => (
                            <tr key={emp.employeeId}>
                                <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{idx + 1}</td>
                                <td>
                                    <div style={{ fontWeight: 700 }}>{emp.employeeName}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{emp.employeeId}</div>
                                </td>
                                <td>{t(emp.jobRole)}</td>
                                <td style={{ textAlign: 'center' }}>{emp.tenureYears} năm</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ flex: 1, height: '6px', background: 'var(--bg-primary)', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{
                                                height: '100%',
                                                width: `${emp.probability * 100}%`,
                                                background: emp.probability >= 0.7 ? '#ef4444' : emp.probability >= 0.4 ? '#f59e0b' : '#22c55e'
                                            }} />
                                        </div>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: '40px' }}>{(emp.probability * 100).toFixed(0)}%</span>
                                    </div>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <span className={`chip ${emp.riskLevel === 'HIGH' ? 'chip-danger' : emp.riskLevel === 'MEDIUM' ? 'chip-warning' : 'chip-success'}`}>
                                        {emp.riskLevel}
                                    </span>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        <button
                                            className="btn btn-secondary"
                                            style={{ padding: '6px', borderRadius: '8px' }}
                                            title="Xem hồ sơ"
                                            onClick={() => setSelectedEmployeeId(emp.employeeId)}
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button className="btn btn-secondary" style={{ padding: '6px', borderRadius: '8px' }} title="Ghi chú">
                                            <FileText size={16} />
                                        </button>
                                        {(emp.riskLevel === 'HIGH' || emp.riskLevel === 'MEDIUM') && (
                                            <button
                                                className="btn btn-primary"
                                                style={{ padding: '6px', borderRadius: '8px', background: 'var(--accent-primary)' }}
                                                title="Tiếp tục giải quyết với AHP"
                                                onClick={() => {
                                                    setAhpContext({
                                                        id: emp.employeeId,
                                                        name: emp.employeeName,
                                                        role: emp.jobRole,
                                                        risk: emp.riskLevel,
                                                        prob: emp.probability,
                                                        factors: emp.topRiskFactors || []
                                                    });
                                                    onNavigate('ahp_module');
                                                }}
                                            >
                                                <Activity size={16} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <EmployeeModal
                employeeId={selectedEmployeeId}
                onClose={() => setSelectedEmployeeId(null)}
            />

            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Hiển thị {filtered.length} / {employees.length} nhân viên
                </div>
                <div className="pagination" style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-secondary" disabled>Trước</button>
                    <button className="btn btn-primary" style={{ padding: '0 12px', minWidth: '40px' }}>1</button>
                    <button className="btn btn-secondary">Sau</button>
                </div>
            </div>
        </div>
    );
}
