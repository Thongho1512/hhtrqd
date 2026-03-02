import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, BrainCircuit, TrendingUp, Users, FlaskConical, Activity
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import TrainModel from './pages/TrainModel';
import Prediction from './pages/Prediction';
import './index.css';

const PAGES = {
    dashboard: { label: 'Bảng điều khiển', icon: LayoutDashboard, component: Dashboard },
    train: { label: 'Huấn luyện mô hình', icon: FlaskConical, component: TrainModel },
    predict: { label: 'Dự đoán nghỉ việc', icon: BrainCircuit, component: Prediction },
};

export default function App() {
    const [activePage, setActivePage] = useState('dashboard');
    const Page = PAGES[activePage].component;

    return (
        <div className="app-layout">
            {/* ── Sidebar ─────────────────────────────────── */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <h1>HR Attrition AI</h1>
                    <p>Nền tảng Phân tích Nhân sự</p>
                </div>

                <nav className="sidebar-nav">
                    <span className="nav-label-section">Phân tích</span>
                    {Object.entries(PAGES).map(([key, { label, icon: Icon }]) => (
                        <button
                            key={key}
                            className={`nav-item${activePage === key ? ' active' : ''}`}
                            onClick={() => setActivePage(key)}
                            id={`nav-${key}`}
                        >
                            <Icon className="nav-icon" size={18} />
                            {label}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <p>Tập dữ liệu IBM HR Attrition</p>
                    <p style={{ marginTop: '4px' }}>v1.0 · Không dùng Database</p>
                </div>
            </aside>

            {/* ── Main ──────────────────────────────────────── */}
            <main className="main-content">
                <Page />
            </main>
        </div>
    );
}
