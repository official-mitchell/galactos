/* 2026-11-03: app entry. Styles live in src/styles (MAX-993).
   2026-11-03: MAX-996 installs the dev-only capture bridge before first render. */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

async function boot() {
  if (import.meta.env.DEV) {
    const { installGalactosHarness } = await import('./harness/devBridge')
    installGalactosHarness()
  }
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

void boot()
