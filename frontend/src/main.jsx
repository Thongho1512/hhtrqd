import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

console.log('main.jsx: mounting React app...')

const rootEl = document.getElementById('root')
console.log('root element:', rootEl)

createRoot(rootEl).render(
    <StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </StrictMode>,
)
