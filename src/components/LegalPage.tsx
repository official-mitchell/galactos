/* 2026-11-06: MAX-1029. Privacy and Terms routes. Counsel has not supplied policy text, so these pages do not invent legal terms. */
import { SiteHeader } from './shell/SiteHeader'
import { SiteFooter } from './shell/SiteFooter'

export function LegalPage({ kind }: { kind: 'privacy' | 'terms' }) {
  const title = kind === 'privacy' ? 'Privacy' : 'Terms'
  return (
    <div className="page-frame">
      <SiteHeader isDark={false} onToggleMode={() => {}} />
      <main id="content" data-anim="page" className="container-editorial" style={{ padding: '72px 0 96px', maxWidth: 720 }}>
        <h1 className="text-display-lg" style={{ marginBottom: 16 }}>{title}</h1>
        <p className="text-lede">
          {title} text has not been supplied by counsel. This page is the public route for that document.
        </p>
      </main>
      <SiteFooter />
    </div>
  )
}
