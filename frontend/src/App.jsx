import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, BrainCircuit, TrendingUp, Users, Activity
} from 'lucide-react';
import DepartmentPrediction from './pages/DepartmentPrediction';
import AHPAnalysis from './pages/AHPAnalysis';
import HRManagement from './pages/HRManagement';
import './index.css';

const PAGES = {
    hr_management: { label: 'Quản lý Nhân sự', icon: Users, component: HRManagement },
    predict_dept: { label: 'Dự báo bộ phận', icon: BrainCircuit, component: DepartmentPrediction },
    ahp_module: { label: 'Phân tích AHP', icon: Activity, component: AHPAnalysis },
};

export default function App() {
    const [activePage, setActivePage] = useState('hr_management');

    // Lifted state for persistence
    const [predictionData, setPredictionData] = useState(() => {
        const saved = sessionStorage.getItem('predictionData');
        return saved ? JSON.parse(saved) : null;
    });

    const [selectedDept, setSelectedDept] = useState(() => {
        return sessionStorage.getItem('selectedDept') || '';
    });

    const [ahpContext, setAhpContext] = useState(() => {
        const saved = sessionStorage.getItem('ahpContext');
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        if (predictionData) {
            sessionStorage.setItem('predictionData', JSON.stringify(predictionData));
        } else {
            sessionStorage.removeItem('predictionData');
        }
    }, [predictionData]);

    useEffect(() => {
        sessionStorage.setItem('selectedDept', selectedDept);
    }, [selectedDept]);

    useEffect(() => {
        if (ahpContext) {
            sessionStorage.setItem('ahpContext', JSON.stringify(ahpContext));
        } else {
            sessionStorage.removeItem('ahpContext');
        }
    }, [ahpContext]);

    const Page = PAGES[activePage].component;

    const navigateTo = (pageKey) => setActivePage(pageKey);

    // Prepare props based on page
    const pageProps = {
        onNavigate: navigateTo
    };

    if (activePage === 'predict_dept') {
        pageProps.predictionData = predictionData;
        pageProps.setPredictionData = setPredictionData;
        pageProps.selectedDept = selectedDept;
        pageProps.setSelectedDept = setSelectedDept;
        pageProps.setAhpContext = setAhpContext;
    }

    if (activePage === 'ahp_module') {
        pageProps.ahpContext = ahpContext;
        pageProps.setAhpContext = setAhpContext;
    }

    return (
        <div className="app-layout">
            {/* ── Sidebar ─────────────────────────────────── */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    {/* <img src="/logo.png" alt="Logo" style={{ width: '48px', height: '48px', marginBottom: '12px', borderRadius: '12px' }} /> */}
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
                    <p style={{ marginTop: '4px' }}>v1.0 · PostgreSQL Database Activated</p>
                </div>
            </aside>

            {/* ── Main ──────────────────────────────────────── */}
            <main className="main-content">
                <Page {...pageProps} />
            </main>
        </div>
    );
}
