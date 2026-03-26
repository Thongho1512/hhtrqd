import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
} from 'chart.js';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
);

export default function RiskCharts({ summary }) {
    const doughnutData = {
        labels: ['Nguy cơ CAO', 'Trung bình', 'Thấp'],
        datasets: [{
            data: [summary.highRiskCount, summary.mediumRiskCount, summary.lowRiskCount],
            backgroundColor: ['#ef4444', '#f59e0b', '#22c55e'],
            borderColor: 'var(--bg-card)',
            borderWidth: 2,
            hoverOffset: 15
        }]
    };

    const barLabels = Object.keys(summary.featureImportance);
    const barValues = Object.values(summary.featureImportance).map(v => v * 100);

    const barData = {
        labels: barLabels,
        datasets: [{
            label: 'Mức độ ảnh hưởng (%)',
            data: barValues,
            backgroundColor: 'rgba(99, 102, 241, 0.5)',
            borderColor: '#6366f1',
            borderWidth: 1,
            borderRadius: 8,
        }]
    };

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { color: '#64748b', font: { size: 12 } } }
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
            <div className="card" style={{ height: '350px' }}>
                <div className="card-title">Phân bổ mức độ rủi ro</div>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Doughnut data={doughnutData} options={commonOptions} />
                </div>
            </div>
            <div className="card" style={{ height: '350px' }}>
                <div className="card-title">Yếu tố rủi ro chính (Feature Importance)</div>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Bar
                        data={barData}
                        options={{
                            ...commonOptions,
                            indexAxis: 'y',
                            scales: {
                                x: { grid: { color: 'var(--border-color)' }, ticks: { color: '#64748b' } },
                                y: { grid: { display: false }, ticks: { color: '#64748b' } }
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
