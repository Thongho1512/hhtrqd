import React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('React ErrorBoundary caught:', error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    position: 'fixed', inset: 0, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    background: '#0a0d1a', color: '#f1f5f9', fontFamily: 'monospace',
                    padding: '32px', flexDirection: 'column', gap: '16px',
                }}>
                    <div style={{ fontSize: '3rem' }}>⚠️</div>
                    <h2 style={{ color: '#ef4444', fontSize: '1.25rem' }}>
                        React Runtime Error
                    </h2>
                    <pre style={{
                        background: '#1a2035', padding: '20px', borderRadius: '8px',
                        color: '#f87171', fontSize: '0.8rem', maxWidth: '700px',
                        whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                        border: '1px solid rgba(239,68,68,0.3)',
                    }}>
                        {this.state.error?.toString()}
                        {'\n\n'}
                        {this.state.errorInfo?.componentStack}
                    </pre>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        style={{
                            padding: '10px 24px', background: '#6366f1', color: '#fff',
                            border: 'none', borderRadius: '8px', cursor: 'pointer',
                            fontSize: '0.875rem',
                        }}
                    >
                        Try Again
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
