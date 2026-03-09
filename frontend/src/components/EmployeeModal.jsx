import React, { useState, useEffect } from 'react';
import { X, Users, Heart, Star, Info, Send, Clock, Trash2 } from 'lucide-react';
import { getEmployeeDetail, getEmployeeNotes, createNote, updateAttentionLevel } from '../api/api';

export default function EmployeeModal({ employeeId, onClose }) {
    const [detail, setDetail] = useState(null);
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [attention, setAttention] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingNotes, setLoadingNotes] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!employeeId) return;
        setDetail(null);
        setNotes([]);
        setLoading(true);
        setError('');

        Promise.all([
            getEmployeeDetail(employeeId),
            getEmployeeNotes(employeeId)
        ]).then(([detailRes, notesRes]) => {
            setDetail(detailRes.data);
            setAttention(detailRes.data.attention_level || 1);
            setNotes(notesRes.data);
        }).catch(err => {
            console.error(err);
            setError('Không thể tải hồ sơ hoặc ghi chú.');
        }).finally(() => setLoading(false));
    }, [employeeId]);

    const handleAddNote = async () => {
        if (!newNote.trim()) return;
        setLoadingNotes(true);
        try {
            const res = await createNote({ employee_id: employeeId, content: newNote });
            setNotes([res.data, ...notes]);
            setNewNote('');
        } catch (err) {
            alert('Lỗi khi lưu ghi chú.');
        } finally {
            setLoadingNotes(false);
        }
    };

    const handleAttentionChange = async (level) => {
        try {
            await updateAttentionLevel({ employee_id: employeeId, attention_level: level });
            setAttention(level);
        } catch (err) {
            alert('Lỗi cập nhật mức độ quan tâm.');
        }
    };

    if (!employeeId) return null;

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(12px)', zIndex: 9999, display: 'flex',
            alignItems: 'center', justifyContent: 'center', padding: '20px'
        }} onClick={onClose}>
            <div className="card" style={{
                width: '100%', maxWidth: '850px', maxHeight: '90vh',
                overflowY: 'auto', position: 'relative', border: '1px solid var(--border-glow)',
                boxShadow: '0 0 80px rgba(0,0,0,0.6)', padding: '32px'
            }} onClick={e => e.stopPropagation()}>

                <button onClick={onClose} style={{
                    position: 'absolute', top: '24px', right: '24px',
                    background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-secondary)',
                    padding: '8px', borderRadius: '50%', cursor: 'pointer', zIndex: 10
                }}>
                    <X size={24} />
                </button>

                {loading ? (
                    <div style={{ padding: '80px', textAlign: 'center' }}>
                        <div className="spinner" style={{ width: '40px', height: '40px' }} />
                        <p style={{ marginTop: '24px', color: 'var(--text-secondary)' }}>Đang truy xuất hồ sơ nhân sự...</p>
                    </div>
                ) : error ? (
                    <div className="alert alert-error" style={{ margin: '40px 0' }}>{error}</div>
                ) : detail && (
                    <div className="fade-in">
                        {/* Header */}
                        <div style={{ display: 'flex', gap: '32px', marginBottom: '40px', borderBottom: '1px solid var(--border-color)', paddingBottom: '32px' }}>
                            <div style={{
                                width: '100px', height: '100px', borderRadius: '24px',
                                background: 'var(--gradient-hero)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', fontSize: '3rem'
                            }}>
                                {detail.gender === 'Female' ? '👩' : '👨'}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>Hồ sơ Nhân viên #{detail.employee_id}</h3>
                                        <div style={{ display: 'flex', gap: '20px', color: 'var(--text-secondary)' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={16} /> {detail.age} tuổi • {detail.gender}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Heart size={16} /> {detail.marital_status}</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span className="chip chip-primary" style={{ fontSize: '0.9rem', padding: '6px 16px' }}>{detail.job_role}</span>
                                        <div style={{ marginTop: '8px', color: 'var(--accent-primary)', fontWeight: 700 }}>Level {detail.job_level}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px' }}>
                            {/* Work & Finance */}
                            <section>
                                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--accent-primary)', marginBottom: '20px', letterSpacing: '0.15em', fontWeight: 800 }}>Tổ chức & Tài chính</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    <DetailRow label="Phòng ban" value={detail.department} />
                                    <DetailRow label="Thu nhập tháng" value={`$${detail.monthly_income.toLocaleString()}`} highlight="var(--accent-success)" />
                                    <DetailRow label="Làm thêm (OT)" value={detail.over_time} highlight={detail.over_time === 'Yes' ? '#ef4444' : ''} />
                                    <DetailRow label="Chiến lược (AHP)" value={detail.strategy_group?.replace('PA_', '') || 'Chưa xét'} highlight="var(--accent-primary)" />
                                    <DetailRow label="Phương án ưu tiên" value={detail.strategy_option_id || '---'} />
                                </div>
                            </section>

                            {/* Experience & Tenure */}
                            <section>
                                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--accent-tertiary)', marginBottom: '20px', letterSpacing: '0.15em', fontWeight: 800 }}>Thâm niên & Đào tạo</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    <DetailRow label="Tổng số năm làm" value={`${detail.total_working_years} năm`} />
                                    <DetailRow label="Số năm tại cty" value={`${detail.years_at_company} năm`} />
                                    <DetailRow label="Số năm vị trí cũ" value={`${detail.years_in_current_role} năm`} />
                                    <DetailRow label="Lần đề bạt cuối" value={`${detail.years_since_last_promotion} năm trước`} />
                                    <DetailRow label="AHP Score" value={detail.ahp_score?.toFixed(2) || '0.00'} />
                                    <DetailRow label="Vị trí Rank" value={detail.ahp_rank || 'N/A'} />
                                </div>
                            </section>

                            {/* Engagement */}
                            <section>
                                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--accent-warning)', marginBottom: '20px', letterSpacing: '0.15em', fontWeight: 800 }}>Gắn kết & Hài lòng</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    <RatingRow label="Hài lòng CV" value={detail.job_satisfaction} color="var(--accent-warning)" />
                                    <RatingRow label="Môi trường" value={detail.environment_satisfaction} color="var(--accent-tertiary)" />
                                    <RatingRow label="Cân bằng LS" value={detail.work_life_balance} color="var(--accent-primary)" />
                                    <DetailRow label="Hiệu suất" value={`Cấp ${detail.performance_rating}`} highlight="#22c55e" />
                                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed var(--border-color)' }}>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Mức độ quan tâm (Manager)</div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {[1, 2, 3, 4, 5].map(lvl => (
                                                <button
                                                    key={lvl}
                                                    onClick={() => handleAttentionChange(lvl)}
                                                    style={{
                                                        flex: 1, height: '32px', borderRadius: '6px', border: 'none',
                                                        cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800,
                                                        background: attention === lvl ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                                                        color: attention === lvl ? '#fff' : 'var(--text-muted)'
                                                    }}
                                                >
                                                    {lvl}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Notes Section [BƯỚC 6] */}
                        <div style={{ marginTop: '48px', borderTop: '2px solid var(--border-color)', paddingTop: '32px' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Send size={20} color="var(--accent-primary)" /> Ghi chú & Nhật ký công việc
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '300px', overflowY: 'auto', paddingRight: '12px' }}>
                                    {notes.length === 0 ? (
                                        <div style={{ padding: '40px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', color: 'var(--text-muted)' }}>
                                            Chưa có ghi chú nào.
                                        </div>
                                    ) : (
                                        notes.map(note => (
                                            <div key={note.id} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--accent-tertiary)' }}>{note.author}</span>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Clock size={12} /> {new Date(note.created_at).toLocaleString()}
                                                    </span>
                                                </div>
                                                <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{note.content}</p>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="card" style={{ height: 'fit-content', padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px' }}>Thêm ghi chú mới</div>
                                    <textarea
                                        className="form-control"
                                        style={{ width: '100%', height: '100px', resize: 'none', fontSize: '0.85rem', marginBottom: '16px' }}
                                        placeholder="Nhập nội dung quan sát..."
                                        value={newNote}
                                        onChange={e => setNewNote(e.target.value)}
                                    />
                                    <button
                                        className="btn btn-primary"
                                        style={{ width: '100%' }}
                                        onClick={handleAddNote}
                                        disabled={loadingNotes || !newNote.trim()}
                                    >
                                        <Send size={16} /> Gửi ghi chú
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function DetailRow({ label, value, highlight }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>{label}:</span>
            <span style={{ fontWeight: 600, color: highlight || 'var(--text-primary)' }}>{value}</span>
        </div>
    );
}

function RatingRow({ label, value, color }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>{label}:</span>
            <div style={{ display: 'flex', gap: '3px' }}>
                {[...Array(4)].map((_, i) => (
                    <Star key={i} size={14} fill={i < value ? color : 'none'} color={color} />
                ))}
            </div>
        </div>
    );
}
