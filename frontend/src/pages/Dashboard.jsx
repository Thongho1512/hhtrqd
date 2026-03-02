import React, { useState, useEffect, useRef } from 'react';
import { Users, TrendingDown, DollarSign, Calendar, Clock, BarChart3 } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, BarElement, ArcElement,
    Title, Tooltip, Legend, PointElement, LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { getDashboardSummary } from '../api/api';

ChartJS.register(
    CategoryScale, LinearScale, BarElement, ArcElement,
    Title, Tooltip, Legend, PointElement, LineElement
);

const CHART_OPTS = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 } },
        },
    },
    scales: {
        x: {
            ticks: { color: '#64748b', font: { size: 11 } },
            grid: { color: 'rgba(99,102,241,0.07)' },
        },
        y: {
            ticks: { color: '#64748b', font: { size: 11 } },
            grid: { color: 'rgba(99,102,241,0.07)' },
        },
    },
};

const DOUGHNUT_OPTS = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'right',
            labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 }, padding: 16 },
        },
    },
};

function StatCard({ icon: Icon, label, value, sub, color }) {
    return (
        <div className="stat-card">
            <div className="stat-card-header">
                <span className="stat-card-label">{label}</span>
                <div className="stat-card-icon" style={{ background: `${color}22` }}>
                    <Icon size={20} color={color} />
                </div>
            </div>
            <div className="stat-card-value">{value}</div>
            {sub && <div className="stat-card-sub">{sub}</div>}
        </div>
    );
}

function SkeletonCard() {
    return (
        <div className="stat-card">
            <div className="skeleton" style={{ height: 12, width: '60%', marginBottom: 16 }} />
            <div className="skeleton" style={{ height: 32, width: '40%', marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 10, width: '80%' }} />
        </div>
    );
}

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getDashboardSummary()
            .then(res => setData(res.data))
            .catch(err => setError(err.response?.data?.detail || err.message))
            .finally(() => setLoading(false));
    }, []);

    if (error) {
        return (
            <div>
                <div className="page-header">
                    <h2>Dashboard</h2>
                </div>
                <div className="alert alert-error">
                    <span>⚠</span>
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h2>Bảng điều khiển Phân tích Nhân sự</h2>
                <p>Thông tin chuyên sâu từ tập dữ liệu IBM HR Attrition — đọc trực tiếp từ CSV.</p>
            </div>

            {/* ── Stat Cards ──────────────────────────────────────────── */}
            <div className="stat-cards-grid">
                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
                ) : <>
                    <StatCard
                        icon={Users}
                        label="Tổng nhân viên"
                        value={data.totalEmployees.toLocaleString()}
                        sub="Lực lượng lao động"
                        color="#6366f1"
                    />
                    <StatCard
                        icon={TrendingDown}
                        label="Tỷ lệ nghỉ việc"
                        value={`${data.attritionRate}%`}
                        sub={`${data.attritionCount} người đã rời đi`}
                        color="#ef4444"
                    />
                    <StatCard
                        icon={DollarSign}
                        label="Thu nhập Trung bình"
                        value={`${Math.round(data.avgMonthlyIncome).toLocaleString()} USD`}
                        sub="Mức lương trung bình"
                        color="#10b981"
                    />
                    <StatCard
                        icon={Calendar}
                        label="Thâm niên trung bình"
                        value={data.avgYearsAtCompany}
                        sub="Số năm làm việc"
                        color="#06b6d4"
                    />
                    <StatCard
                        icon={Clock}
                        label="Nghỉ việc khi làm thêm"
                        value={`${data.overtimeAttritionRate}%`}
                        sub={`so với ${data.nonOvertimeAttritionRate}% không làm thêm`}
                        color="#f59e0b"
                    />
                </>}
            </div>

            {/* ── Charts ─────────────────────────────────────────────── */}
            {!loading && data && (
                <div className="charts-grid">
                    {/* Attrition by Department */}
                    <div className="card">
                        <div className="card-title">Tỷ lệ nghỉ việc theo Phòng ban</div>
                        <div style={{ height: 260 }}>
                            <Bar
                                data={{
                                    labels: data.departmentStats.map(d => d.department),
                                    datasets: [
                                        {
                                            label: 'Tỷ lệ nghỉ việc (%)',
                                            data: data.departmentStats.map(d => d.attritionRate),
                                            backgroundColor: ['rgba(99,102,241,0.7)', 'rgba(139,92,246,0.7)', 'rgba(6,182,212,0.7)'],
                                            borderRadius: 6,
                                        },
                                        {
                                            label: 'Tổng số',
                                            data: data.departmentStats.map(d => d.total),
                                            backgroundColor: 'rgba(255,255,255,0.06)',
                                            borderRadius: 6,
                                        },
                                    ],
                                }}
                                options={CHART_OPTS}
                            />
                        </div>
                    </div>

                    {/* Overtime vs Non-Overtime */}
                    <div className="card">
                        <div className="card-title">Làm thêm giờ vs Nghỉ việc</div>
                        <div style={{ height: 260 }}>
                            <Doughnut
                                data={{
                                    labels: ['Làm thêm (Nghỉ)', 'Làm thêm (Ở lại)', 'Không làm thêm (Nghỉ)', 'Không làm thêm (Ở lại)'],
                                    datasets: [{
                                        data: [
                                            data.overtimeAttritionRate,
                                            100 - data.overtimeAttritionRate,
                                            data.nonOvertimeAttritionRate,
                                            100 - data.nonOvertimeAttritionRate,
                                        ],
                                        backgroundColor: ['#ef4444', '#10b981', '#f59e0b', '#6366f1'],
                                        borderColor: '#141829',
                                        borderWidth: 3,
                                    }],
                                }}
                                options={DOUGHNUT_OPTS}
                            />
                        </div>
                    </div>

                    {/* Age Distribution */}
                    <div className="card">
                        <div className="card-title">Phân bổ Độ tuổi</div>
                        <div style={{ height: 240 }}>
                            <Bar
                                data={{
                                    labels: Object.keys(data.ageDistribution),
                                    datasets: [{
                                        label: 'Số người',
                                        data: Object.values(data.ageDistribution),
                                        backgroundColor: 'rgba(99,102,241,0.6)',
                                        borderRadius: 4,
                                    }],
                                }}
                                options={CHART_OPTS}
                            />
                        </div>
                    </div>

                    {/* Income Distribution */}
                    <div className="card">
                        <div className="card-title">Phân bổ Thu nhập</div>
                        <div style={{ height: 240 }}>
                            <Bar
                                data={{
                                    labels: Object.keys(data.incomeDistribution),
                                    datasets: [{
                                        label: 'Nhân viên',
                                        data: Object.values(data.incomeDistribution),
                                        backgroundColor: 'rgba(6,182,212,0.6)',
                                        borderRadius: 4,
                                    }],
                                }}
                                options={CHART_OPTS}
                            />
                        </div>
                    </div>

                    {/* Job Role Breakdown (full width) */}
                    <div className="card full-width">
                        <div className="card-title">Tỷ lệ nghỉ việc theo Chức danh công việc</div>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Chức danh</th>
                                        <th>Tổng số</th>
                                        <th>Nghỉ việc</th>
                                        <th className="rate-bar-cell">Tỷ lệ nghỉ việc</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.jobRoleStats.map(r => (
                                        <tr key={r.jobRole}>
                                            <td>{r.jobRole}</td>
                                            <td>{r.total}</td>
                                            <td>
                                                <span className={`chip ${r.attritionRate > 20 ? 'chip-danger' : r.attritionRate > 10 ? 'chip-warning' : 'chip-success'}`}>
                                                    {r.attrited}
                                                </span>
                                            </td>
                                            <td className="rate-bar-cell">
                                                <div className="rate-bar">
                                                    <div className="rate-bar-track">
                                                        <div
                                                            className="rate-bar-fill"
                                                            style={{ width: `${Math.min(r.attritionRate, 60) / 60 * 100}%` }}
                                                        />
                                                    </div>
                                                    <span style={{ fontSize: '0.8rem', minWidth: 44, color: 'var(--text-primary)' }}>
                                                        {r.attritionRate}%
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
