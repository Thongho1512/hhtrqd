import React, { useState, useEffect } from 'react';
import {
    Calculator, CheckCircle2, AlertCircle,
    Save, Info, Users, CheckSquare, Square, ChevronDown, ChevronUp
} from 'lucide-react';
import { computeAHP } from '../api/api';
import { AHP_DEFAULT_MATRICES, AHP_ALTERNATIVES } from '../data/ahpDefaults';

// ─── 6 Tiêu chí AHP ──────────────────────────────────────────────────────── //
const CRITERIA_KEYS  = ['chi_phi', 'thoi_gian', 'do_phuc_tap', 'tac_dong', 'ben_vung', 'do_phu_hop'];
const CRITERIA_LABEL = {
    chi_phi: 'Chi phí (Cost)',
    thoi_gian: 'Thời gian (Time)',
    do_phuc_tap: 'Độ phức tạp (Complexity)',
    tac_dong: 'Tác động (Impact)',
    ben_vung: 'Bền vững (Sustainability)',
    do_phu_hop: 'Độ phù hợp (Fit)',
};
const CRITERIA_SHORT = {
    chi_phi: 'Cost', thoi_gian: 'Time', do_phuc_tap: 'Complex',
    tac_dong: 'Impact', ben_vung: 'Sustain', do_phu_hop: 'Fit',
};

const N_ALT = AHP_ALTERNATIVES.length; // 5

// ─── Helpers ─────────────────────────────────────────────────────────────── //
const fmtVal = (v) => {
    if (v === 1) return '1';
    if (v < 1) return `1/${Math.round(1 / v)}`;
    return Number.isInteger(v) ? String(v) : v.toFixed(2);
};
const parseVal = (s) => {
    if (!s) return 0;
    s = s.trim();
    if (s.includes('/')) {
        const [n, d] = s.split('/').map(parseFloat);
        if (d && !isNaN(n) && !isNaN(d)) return n / d;
    }
    const v = parseFloat(s);
    return isNaN(v) ? 0 : v;
};

// ─── MatrixCell ───────────────────────────────────────────────────────────── //
const MatrixCell = ({ value, onChange }) => {
    const [local, setLocal] = useState(fmtVal(value));
    useEffect(() => { setLocal(fmtVal(value)); }, [value]);
    const commit = () => {
        const v = parseVal(local);
        if (v > 0) onChange(v); else setLocal(fmtVal(value));
    };
    return (
        <input type="text"
            style={{
                height: '36px', width: '100%', textAlign: 'center',
                background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)',
                borderRadius: '6px', color: 'var(--text-primary)',
                fontSize: '0.85rem', fontWeight: 600, outline: 'none', padding: '0 4px'
            }}
            value={local}
            onChange={e => setLocal(e.target.value)}
            onBlur={commit}
            onKeyDown={e => e.key === 'Enter' && commit()}
            onFocus={e => e.target.select()}
        />
    );
};

// ─── MatrixEditor ─────────────────────────────────────────────────────────── //
const MatrixEditor = ({ matrix, setMatrix, labels }) => {
    const n = matrix.length;
    const handle = (i, j, v) => {
        if (i === j) return;
        setMatrix(prev => {
            const m = prev.map(r => [...r]);
            m[i][j] = v; m[j][i] = 1 / v;
            return m;
        });
    };
    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'separate', borderSpacing: '5px' }}>
                <thead>
                    <tr>
                        <th style={{ minWidth: '110px' }}></th>
                        {labels.map((l, j) => (
                            <th key={j} style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', minWidth: '60px' }}>{l}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {matrix.map((row, i) => (
                        <tr key={i}>
                            <td style={{ fontSize: '0.75rem', fontWeight: 700, paddingRight: '8px', whiteSpace: 'nowrap' }}>{labels[i]}</td>
                            {row.map((val, j) => (
                                <td key={j}>
                                    {i === j ? (
                                        <div style={{
                                            height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: 'rgba(99,102,241,0.1)', borderRadius: '6px',
                                            color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.85rem'
                                        }}>1</div>
                                    ) : (
                                        <MatrixCell value={val} onChange={v => handle(i, j, v)} />
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// ─── CRBadge ─────────────────────────────────────────────────────────────── //
const CRBadge = ({ cr }) => (
    <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '5px 12px', borderRadius: '20px', fontSize: '0.78rem', marginTop: '10px',
        background: cr < 0.1 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
        border: `1px solid ${cr < 0.1 ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`
    }}>
        {cr < 0.1 ? <CheckCircle2 size={13} color="#22c55e" /> : <AlertCircle size={13} color="#ef4444" />}
        CR = <strong>{(cr * 100).toFixed(2)}%</strong>
        {cr < 0.1 ? ' ✓' : ' — Cần điều chỉnh'}
    </span>
);

// ─── WeightBar ───────────────────────────────────────────────────────────── //
const WeightBar = ({ label, weight, rank }) => (
    <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.83rem', marginBottom: '4px' }}>
            <span>{label}</span>
            <span style={{ display: 'flex', gap: '10px' }}>
                {rank && <span style={{ color: 'var(--text-muted)' }}>Hạng {rank}</span>}
                <strong style={{ color: 'var(--accent-primary)' }}>{(weight * 100).toFixed(2)}%</strong>
            </span>
        </div>
        <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${weight * 100}%`, background: 'var(--gradient-hero)', transition: 'width 0.5s ease' }} />
        </div>
    </div>
);

// ─── Badge ────────────────────────────────────────────────────────────────── //
const StepBadge = ({ n, green = false }) => (
    <div style={{
        display: 'inline-block', padding: '3px 12px', borderRadius: '5px', marginBottom: '8px',
        fontSize: '0.7rem', fontWeight: 700, color: 'white',
        background: green ? 'rgba(16,185,129,0.7)' : 'var(--gradient-hero)'
    }}>
        {green ? `✓ KẾT QUẢ ${n}` : `BƯỚC ${n}`}
    </div>
);

const initMatrix = () =>
    Array.from({ length: N_ALT }, (_, i) =>
        Array.from({ length: N_ALT }, (_, j) => {
            const flat = AHP_DEFAULT_MATRICES;
            return flat.chi_phi ? flat.chi_phi[i][j] : 1; // placeholder
        })
    );

const cloneMatrix = (m) => m.map(r => [...r]);
const loadDefault = (key) => AHP_DEFAULT_MATRICES[key].map(r => [...r]);

// ─── Main Component ──────────────────────────────────────────────────────── //
export default function AHPAnalysis() {
    const ALT_LABELS = AHP_ALTERNATIVES.map(a => a.name.split(' ')[0] + (a.name.split(' ')[1] ? ' ' + a.name.split(' ')[1] : ''));
    const ALT_LABELS_SHORT = AHP_ALTERNATIVES.map(a => a.name.split(' ')[0]);

    // UI Steps: 2 = Criteria, 3 = Alternatives
    const [activeStep, setActiveStep] = useState(2);

    // Step 2: criteria matrix 6×6
    const [criteriaMatrix, setCriteriaMatrix] = useState(
        Array.from({ length: 6 }, (_, i) => Array.from({ length: 6 }, (_, j) => 1))
    );

    // Results for Step 2 (Criteria Weights & CR)
    const [criteriaResults, setCriteriaResults] = useState(null);

    // Step 3: alternative matrices per criterion — 5×5 each
    const [altMatrices, setAltMatrices] = useState(() => {
        const init = {};
        CRITERIA_KEYS.forEach(k => { init[k] = loadDefault(k); });
        return init;
    });

    // Final Results (Step 3)
    const [results, setResults] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [openCrit, setOpenCrit] = useState(null);

    // Calculate Step 2 (Criteria)
    const handleStep2 = async () => {
        setLoading(true); setError('');
        try {
            // Call backend with just criteria_matrix.
            const res = await computeAHP('PA_GIU_CHAN', criteriaMatrix, null);
            setCriteriaResults(res.data.criteria);
            
            if (res.data.criteria.cr >= 0.1) {
                setError('Chỉ số nhất quán CR của tiêu chí ≥ 0.1. Vui lòng điều chỉnh lại ma trận Bước 2.');
            } else {
                setActiveStep(3);
                // Scroll to Step 3
                setTimeout(() => {
                    document.getElementById('step-3-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Lỗi tính toán trọng số tiêu chí.');
        } finally {
            setLoading(false);
        }
    };

    // Calculate Step 3 (Final Ranking)
    const handleStep3 = async () => {
        setLoading(true); setError('');
        try {
            const res = await computeAHP('PA_GIU_CHAN', criteriaMatrix, altMatrices);
            setResults(res.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Lỗi tính toán xếp hạng phương án.');
        } finally {
            setLoading(false);
        }
    };

    const resetToStep2 = () => {
        setActiveStep(2);
        setResults(null);
    };

    return (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Header */}
            <div className="page-header">
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Phân tích thứ bậc AHP</h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Xác định nhóm chiến lược nhân sự tối ưu thông qua ma trận so sánh cặp Saaty
                </p>
            </div>

            {error && (
                <div style={{ padding: '14px 18px', background: 'rgba(239,68,68,0.1)', border: '1px solid var(--accent-danger)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--accent-danger)' }}>
                    <AlertCircle size={18} /><span>{error}</span>
                </div>
            )}

            {/* ════ BƯỚC 2: Criteria matrix ════ */}
            <div className="card" style={{ opacity: activeStep === 2 ? 1 : 0.7, pointerEvents: activeStep === 2 ? 'auto' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <StepBadge n={2} />
                        <div style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>Ma trận so sánh cặp tiêu chí</div>
                    </div>
                    {activeStep === 3 && (
                        <button className="btn btn-secondary btn-sm" onClick={resetToStep2}>
                            Sửa ma trận tiêu chí
                        </button>
                    )}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    So sánh tầm quan trọng tương đối giữa 6 tiêu chí. Nhập số (1–9) hoặc phân số (1/3, 1/5…).
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 250px', gap: '24px', alignItems: 'start' }}>
                    <MatrixEditor
                        matrix={criteriaMatrix}
                        setMatrix={setCriteriaMatrix}
                        labels={Object.values(CRITERIA_SHORT)}
                    />
                    <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', padding: '14px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                            <Info size={13} style={{ verticalAlign: 'middle', marginRight: '5px' }} />Thang đo Saaty
                        </div>
                        {[['1','Quan trọng như nhau'],['3','Hơn một chút'],['5','Hơn rõ rệt'],['7','Hơn rất mạnh'],['9','Tuyệt đối hơn']].map(([v, l]) => (
                            <div key={v} style={{ display: 'flex', gap: '10px', marginBottom: '6px', fontSize: '0.8rem' }}>
                                <strong style={{ color: 'var(--accent-primary)', minWidth: '12px' }}>{v}</strong>
                                <span style={{ color: 'var(--text-secondary)' }}>{l}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {activeStep === 2 && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                        <button
                            className="btn btn-primary"
                            onClick={handleStep2}
                            disabled={loading}
                            style={{ minWidth: '240px', justifyContent: 'center' }}
                        >
                            {loading ? 'Đang tính...' : 'Tính trọng số tiêu chí → Bước tiếp theo'}
                        </button>
                    </div>
                )}
            </div>

            {/* Criteria weight results after Step 2 completes */}
            {criteriaResults && (
                <div className="card fade-in" style={{ background: 'rgba(16,185,129,0.03)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <StepBadge n={2} green />
                    <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>Kết quả trọng số tiêu chí</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
                        <div>
                            {CRITERIA_KEYS.map((key, i) => {
                                const w = criteriaResults.weights[i];
                                const sorted = [...criteriaResults.weights].sort((a, b) => b - a);
                                return <WeightBar key={key} label={CRITERIA_LABEL[key]} weight={w} rank={sorted.indexOf(w) + 1} />;
                            })}
                            <CRBadge cr={criteriaResults.cr} />
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', fontSize: '0.73rem', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'left', padding: '4px 6px', color: 'var(--text-muted)' }}>Tiêu chí</th>
                                        {CRITERIA_KEYS.map(k => (
                                            <th key={k} style={{ textAlign: 'center', padding: '4px', color: 'var(--text-muted)' }}>{CRITERIA_SHORT[k]}</th>
                                        ))}
                                        <th style={{ textAlign: 'center', padding: '4px 6px', color: 'var(--accent-primary)', fontWeight: 700 }}>w</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {CRITERIA_KEYS.map((key, i) => (
                                        <tr key={key} style={{ borderTop: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '5px 6px', fontWeight: 600, whiteSpace: 'nowrap' }}>{CRITERIA_SHORT[key]}</td>
                                            {criteriaResults.normalized_matrix[i].map((v, j) => (
                                                <td key={j} style={{ textAlign: 'center', padding: '5px 4px', color: 'var(--text-secondary)' }}>{v.toFixed(3)}</td>
                                            ))}
                                            <td style={{ textAlign: 'center', padding: '5px 6px', fontWeight: 800, color: 'var(--accent-primary)' }}>
                                                {criteriaResults.weights[i].toFixed(4)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ════ BƯỚC 3: Alternative matrices (Only show if Step 2 is DONE and CR valid) ════ */}
            {activeStep === 3 && (
                <div id="step-3-section" className="card fade-in">
                    <StepBadge n={3} />
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
                        Ma trận so sánh các nhóm chiến lược theo từng tiêu chí
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                        5 phương án (nhóm chiến lược) được so sánh với nhau theo mỗi tiêu chí.
                    </div>

                    {/* Alternatives legend */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                        {AHP_ALTERNATIVES.map((a, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', fontSize: '0.78rem' }}>
                                <span>{a.icon}</span>
                                <strong>{a.name}</strong>
                            </div>
                        ))}
                    </div>

                    {/* Accordion per criterion */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {CRITERIA_KEYS.map(key => {
                            const isOpen = openCrit === key;
                            const mat = altMatrices[key];
                            return (
                                <div key={key} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', overflow: 'hidden' }}>
                                    <button
                                        onClick={() => setOpenCrit(isOpen ? null : key)}
                                        style={{
                                            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '13px 18px',
                                            background: isOpen ? 'rgba(99,102,241,0.1)' : 'transparent',
                                            border: 'none', cursor: 'pointer', color: 'var(--text-primary)'
                                        }}
                                    >
                                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{CRITERIA_LABEL[key]}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                                Ma trận {N_ALT}×{N_ALT}
                                            </span>
                                            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </div>
                                    </button>
                                    {isOpen && (
                                        <div style={{ padding: '14px 18px', borderTop: '1px solid var(--border-color)' }}>
                                            <MatrixEditor
                                                matrix={mat}
                                                labels={ALT_LABELS}
                                                setMatrix={(newM) => setAltMatrices(prev => ({ ...prev, [key]: newM }))}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                        <button
                            className="btn btn-primary"
                            onClick={handleStep3}
                            disabled={loading}
                            style={{ minWidth: '280px', justifyContent: 'center' }}
                        >
                            <Calculator size={20} />
                            {loading ? 'Đang tính toán...' : 'Tính toán xếp hạng cuối cùng (B3)'}
                        </button>
                    </div>
                </div>
            )}

            {/* ════ FINAL RESULTS ════ */}
            {results && activeStep === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="fade-in">

                    {/* Step 3 results: alternative weights */}
                    <div className="card">
                        <StepBadge n={3} green />
                        <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>Trọng số phương án theo từng tiêu chí</div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                                        <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>Nhóm chiến lược</th>
                                        {CRITERIA_KEYS.map(k => (
                                            <th key={k} style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', whiteSpace: 'nowrap', fontSize: '0.72rem' }}>{CRITERIA_SHORT[k]}</th>
                                        ))}
                                        <th style={{ textAlign: 'center', padding: '10px 12px', color: 'var(--accent-primary)', fontWeight: 700, borderBottom: '1px solid var(--border-color)' }}>Điểm tổng</th>
                                        <th style={{ textAlign: 'center', padding: '10px 12px', color: 'var(--accent-primary)', fontWeight: 700, borderBottom: '1px solid var(--border-color)' }}>Hạng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {AHP_ALTERNATIVES.map((alt, i) => {
                                        const row = results.alternatives.summary_table.find(r => r.pa_index === i);
                                        return (
                                            <tr key={i} style={{
                                                background: row?.rank === 1 ? 'rgba(99,102,241,0.08)' : 'transparent',
                                                borderTop: '1px solid rgba(255,255,255,0.04)'
                                            }}>
                                                <td style={{ padding: '10px 12px', fontWeight: row?.rank === 1 ? 700 : 400 }}>
                                                    {alt.icon} {alt.name}
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{alt.detail}</div>
                                                </td>
                                                {CRITERIA_KEYS.map((key, ci) => (
                                                    <td key={key} style={{ textAlign: 'center', padding: '10px 8px', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                                                        {results.alternatives.pa_weights_matrix[i][ci].toFixed(4)}
                                                    </td>
                                                ))}
                                                <td style={{ textAlign: 'center', padding: '10px 12px', fontWeight: 800, color: row?.rank === 1 ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                                                    {(row?.total_score * 100).toFixed(2)}%
                                                </td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <div style={{
                                                        width: '28px', height: '28px', borderRadius: '50%', margin: '0 auto',
                                                        background: row?.rank === 1 ? 'var(--gradient-hero)' : 'rgba(255,255,255,0.06)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontWeight: 800, fontSize: '0.85rem', color: row?.rank === 1 ? 'white' : 'var(--text-secondary)'
                                                    }}>
                                                        {row?.rank}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div style={{ marginTop: '14px' }}>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>Kiểm tra nhất quán (CR) từng ma trận phương án:</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {CRITERIA_KEYS.map(key => {
                                    const cr = results.alternatives.results_per_criterion[key]?.cr;
                                    if (cr === undefined) return null;
                                    return <CRBadge key={key} cr={cr} />;
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Final ranking display */}
                    <div className="card fade-in">
                        <div style={{
                            display: 'inline-block', background: 'var(--gradient-hero)', color: 'white',
                            padding: '3px 12px', borderRadius: '5px', fontSize: '0.7rem', fontWeight: 700, marginBottom: '12px'
                        }}>🏆 KẾT QUẢ CUỐI CÙNG</div>
                        <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>Xếp hạng nhóm chiến lược</div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {[...results.alternatives.summary_table]
                                .sort((a, b) => a.rank - b.rank)
                                .map((item, idx) => {
                                    const alt = AHP_ALTERNATIVES[item.pa_index];
                                    return (
                                        <div key={idx} style={{
                                            display: 'flex', alignItems: 'center', gap: '14px',
                                            padding: '14px 18px', borderRadius: '12px',
                                            background: idx === 0 ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                                            border: idx === 0 ? '1px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.05)'
                                        }}>
                                            <div style={{
                                                width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                                                background: idx === 0 ? 'var(--gradient-hero)' : 'var(--bg-secondary)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 800, fontSize: '0.95rem', color: idx === 0 ? 'white' : 'var(--text-secondary)'
                                            }}>{item.rank}</div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{alt.icon} {alt.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{alt.detail}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: idx === 0 ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                                                    {(item.total_score * 100).toFixed(2)}%
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
