import React, { useState, useEffect } from 'react';
import {
    Users, Plus, Upload, Search, Filter, MoreHorizontal,
    Trash2, Edit, ChevronLeft, ChevronRight, FileSpreadsheet, Download
} from 'lucide-react';
import { listEmployees, deleteEmployee, importEmployees } from '../api/api';
import EmployeeEditModal from '../components/EmployeeEditModal';
import { t } from '../utils/translations';

export default function HRManagement() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isImporting, setIsImporting] = useState(false);

    const rowsPerPage = 10;

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const res = await listEmployees();
            setEmployees(res.data);
        } catch (err) {
            console.error('Error fetching employees:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) return;
        try {
            await deleteEmployee(id);
            setEmployees(employees.filter(emp => emp.employee_id !== id));
        } catch (err) {
            alert('Lỗi khi xóa nhân viên.');
        }
    };

    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsImporting(true);
        try {
            const res = await importEmployees(file);
            alert(`Thành công: ${res.data.message}`);
            fetchEmployees();
        } catch (err) {
            alert(`Lỗi khi import: ${err.response?.data?.detail || err.message}`);
        } finally {
            setIsImporting(false);
            e.target.value = ''; // Reset input
        }
    };

    const filteredEmployees = employees.filter(emp =>
        emp.employee_id.toString().includes(searchQuery) ||
        emp.job_role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
    const paginatedEmployees = filteredEmployees.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    return (
        <div className="fade-in" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Quản lý Nhân sự</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                        Xem, thêm mới và quản lý hồ sơ nhân viên trong hệ thống
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <label className="btn btn-secondary" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Upload size={18} />
                        {isImporting ? 'Đang Import...' : 'Nhập dữ liệu từ Excel/CSV'}
                        <input type="file" hidden accept=".csv, .xlsx, .xls" onChange={handleImport} disabled={isImporting} />
                    </label>
                    <button
                        className="btn btn-primary"
                        onClick={() => { setSelectedEmployee(null); setIsEditModalOpen(true); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Plus size={18} /> Thêm nhân viên
                    </button>
                </div>
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '16px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Tìm kiếm theo ID, chức vụ hoặc phòng ban..."
                            style={{ paddingLeft: '40px', width: '100%' }}
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                        />
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)' }}>
                            <tr>
                                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem' }}>ID</th>
                                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem' }}>THÔNG TIN CƠ BẢN</th>
                                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem' }}>PHÒNG BAN / CHỨC VỤ</th>
                                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem' }}>THU NHẬP</th>
                                <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.85rem' }}>OT</th>
                                <th style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>THAO TÁC</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '48px', textAlign: 'center' }}>
                                        <div className="spinner" style={{ margin: '0 auto' }}></div>
                                        <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Đang tải danh sách nhân viên...</p>
                                    </td>
                                </tr>
                            ) : paginatedEmployees.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        Không tìm thấy nhân viên nào.
                                    </td>
                                </tr>
                            ) : (
                                paginatedEmployees.map(emp => (
                                    <tr key={emp.employee_id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }} className="hover-row">
                                        <td style={{ padding: '16px', fontWeight: 700 }}>#{emp.employee_id}</td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ fontWeight: 600 }}>{emp.age} tuổi • {t(emp.gender)}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t(emp.marital_status)}</div>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{t(emp.department)}</div>
                                            <div style={{ fontSize: '0.8rem' }}>{t(emp.job_role)} (Lvl {emp.job_level})</div>
                                        </td>
                                        <td style={{ padding: '16px', fontWeight: 600, color: 'var(--accent-success)' }}>
                                            ${emp.monthly_income.toLocaleString()}
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{
                                                padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800,
                                                background: emp.over_time === 'Yes' ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-secondary)',
                                                color: emp.over_time === 'Yes' ? '#ef4444' : 'var(--text-muted)'
                                            }}>
                                                {t(emp.over_time)}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button
                                                    className="btn-icon"
                                                    style={{ color: 'var(--accent-primary)' }}
                                                    onClick={() => { setSelectedEmployee(emp); setIsEditModalOpen(true); }}
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    className="btn-icon"
                                                    style={{ color: '#ef4444' }}
                                                    onClick={() => handleDelete(emp.employee_id)}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Hiển thị {(page - 1) * rowsPerPage + 1} - {Math.min(page * rowsPerPage, filteredEmployees.length)} trong tổng số {filteredEmployees.length} nhân viên
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            className="btn btn-secondary btn-sm"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        {[...Array(Math.min(5, totalPages))].map((_, i) => (
                            <button
                                key={i}
                                className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            className="btn btn-secondary btn-sm"
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {isEditModalOpen && (
                <EmployeeEditModal
                    employee={selectedEmployee}
                    onClose={() => setIsEditModalOpen(false)}
                    onSaved={() => { setIsEditModalOpen(false); fetchEmployees(); }}
                />
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .hover-row:hover { background: var(--bg-secondary); }
                .btn-icon { background: none; border: none; cursor: pointer; padding: 4px; border-radius: 4px; display: flex; align-items: center; justify-content: center; opacity: 0.7; transition: opacity 0.2s, background 0.2s; }
                .btn-icon:hover { opacity: 1; background: var(--bg-card-hover); }
                .btn-sm { padding: 4px 10px; font-size: 0.8rem; }
            `}} />
        </div>
    );
}
