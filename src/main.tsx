/* 2026-11-03: app entry. Styles live in src/styles (MAX-993).
   2026-11-03: MAX-996 installs the dev-only capture bridge before first render.
   2026-11-03: MAX-1003 logs theme source (stored|system) in dev only.
   2026-11-04: MAX-1004 imports the GSAP plugin register once. */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './motion/register'
import './styles/index.css'

async function boot() {
  if (import.meta.env.DEV) {
    const source = window.__galactosThemeSource
    if (source === 'stored' || source === 'system') console.log(source)
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
