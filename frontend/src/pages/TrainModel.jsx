import React, { useState, useEffect } from 'react';
import { FlaskConical, CheckCircle, AlertCircle, RefreshCw, Info } from 'lucide-react';
import { trainModel, getModelStatus } from '../api/api';

function MetricCard({ label, value, suffix = '%' }) {
    return (
        <div className="metric-card">
            <div className="metric-card-label">{label}</div>
            <div className="metric-card-value">
                {(value * 100).toFixed(1)}{suffix}
            </div>
        </div>
    );
}

function ConfusionMatrix({ cm }) {
    if (!cm) return null;
    return (
        <div className="card" style={{ marginTop: 24 }}>
            <div className="card-title">Ma trận nhầm lẫn (Confusion Matrix)</div>
            <div className="confusion-grid">
                <div className="confusion-cell tp">
                    <div className="confusion-cell-val">{cm.truePositive}</div>
                    <div className="confusion-cell-label">Dương tính thật (TP)</div>
                </div>
                <div className="confusion-cell fp">
                    <div className="confusion-cell-val">{cm.falsePositive}</div>
                    <div className="confusion-cell-label">Dương tính giả (FP)</div>
                </div>
                <div className="confusion-cell fn">
                    <div className="confusion-cell-val">{cm.falseNegative}</div>
                    <div className="confusion-cell-label">Âm tính giả (FN)</div>
                </div>
                <div className="confusion-cell tn">
                    <div className="confusion-cell-val">{cm.trueNegative}</div>
                    <div className="confusion-cell-label">Âm tính thật (TN)</div>
                </div>
            </div>
        </div>
    );
}

export default function TrainModel() {
    const [training, setTraining] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [status, setStatus] = useState(null);

    useEffect(() => {
        getModelStatus()
            .then(r => setStatus(r.data))
            .catch(() => { });
    }, []);

    const handleTrain = async () => {
        setTraining(true);
        setError('');
        setResult(null);
        try {
            const res = await trainModel();
            setResult(res.data);
            getModelStatus().then(r => setStatus(r.data)).catch(() => { });
        } catch (err) {
            setError(err.response?.data?.detail || err.message || 'Huấn luyện thất bại');
        } finally {
            setTraining(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <h2>Huấn luyện Mô hình</h2>
                <p>Huấn luyện bộ phân loại Random Forest trên tập dữ liệu IBM HR Attrition.</p>
            </div>

            {/* ── Model Status Banner ─────────────────────────────── */}
            {status && (
                <div className="alert alert-info" style={{ marginBottom: 24 }}>
                    <Info size={16} />
                    <span>
                        {status.modelLoaded
                            ? `✓ Mô hình đã sẵn sàng (Phiên bản: ${status.modelVersion}).`
                            : '⚠ Mô hình chưa được huấn luyện. Vui lòng huấn luyện để bắt đầu dự đoán.'}
                    </span>
                </div>
            )}

            {/* ── Hero ───────────────────────────────────────────── */}
            <div className="train-hero">
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                        <div style={{
                            width: 72, height: 72,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 40px rgba(99,102,241,0.4)',
                        }}>
                            <FlaskConical size={32} color="#fff" />
                        </div>
                    </div>

                    <h3>Huấn luyện Mô hình Dự đoán Nghỉ việc</h3>
                    <p>
                        Hệ thống sẽ đọc dữ liệu trực tiếp từ CSV, xây dựng quy trình xử lý
                        với StandardScaler + OneHotEncoder và huấn luyện mô hình Random Forest
                        với cơ chế cân bằng dữ liệu. Đánh giá trên 20% dữ liệu kiểm thử.
                    </p>

                    {training ? (
                        <div className="training-progress">
                            <div className="spinner" />
                            <p>Đang huấn luyện mô hình… Mất khoảng 20–60 giây</p>
                            <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                                Đang tải dữ liệu → Tiền xử lý → Huấn luyện Random Forest → Đánh giá
                            </p>
                        </div>
                    ) : (
                        <button
                            id="btn-train-model"
                            className="btn btn-primary btn-lg"
                            onClick={handleTrain}
                            disabled={training}
                        >
                            <FlaskConical size={18} />
                            {result ? 'Huấn luyện lại mô hình' : 'Bắt đầu huấn luyện'}
                        </button>
                    )}
                </div>
            </div>

            {/* ── Error ──────────────────────────────────────────── */}
            {error && (
                <div className="alert alert-error" style={{ marginBottom: 24 }}>
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}

            {/* ── Results ────────────────────────────────────────── */}
            {result && (
                <div style={{ animation: 'resultAppear 0.4s ease' }}>
                    <div className="alert alert-success" style={{ marginBottom: 24 }}>
                        <CheckCircle size={16} />
                        <span>
                            Huấn luyện hoàn tất trong {result.trainingTime} giây! Phiên bản: {result.modelVersion}
                        </span>
                    </div>

                    <div className="metric-cards">
                        <MetricCard label="Độ chính xác (Accuracy)" value={result.accuracy} />
                        <MetricCard label="Điểm ROC-AUC" value={result.auc} />
                        <MetricCard label="Điểm F1-Score" value={result.f1Score} />
                    </div>

                    <ConfusionMatrix cm={result.confusionMatrix} />

                    {/* Pipeline Details */}
                    <div className="card" style={{ marginTop: 24 }}>
                        <div className="card-title">Cấu hình Quy trình xử lý</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 4 }}>
                            {[
                                { label: 'Thuật toán', val: 'Random Forest Classifier' },
                                { label: 'Số lượng cây', val: '200 trees' },
                                { label: 'Cân bằng lớp', val: 'Balanced (tự động)' },
                                { label: 'Phân tách dữ liệu', val: '20% holdout' },
                                { label: 'Mã hóa', val: 'OneHotEncoder (phân loại)' },
                                { label: 'Chuẩn hóa', val: 'StandardScaler (số)' },
                            ].map(({ label, val }) => (
                                <div key={label} style={{ display: 'flex', gap: 12 }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', minWidth: 150 }}>{label}</span>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>{val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
