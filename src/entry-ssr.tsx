/* 2026-11-06: MAX-1029 renders /, /privacy, and /terms.
   2026-11-04: MAX-1005. Render the landing page to HTML so the text exists when JavaScript is off. */
import { renderToString } from 'react-dom/server'
import { StrictMode } from 'react'
import App from './App'

export function render(pathname = '/'): string {
  return renderToString(
    <StrictMode>
      <App initialPath={pathname} />
    </StrictMode>,
  )
}
