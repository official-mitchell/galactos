/* 2026-11-04: MAX-1015 footnote row. Renders only Appendix A rows whose status is OK.
   Changelog: 2026-11-04 added the Evidence footnote. */

import { evidenceById, wordCount } from '../content/evidence'
import { trackEvidenceClick } from '../analytics/track'

export type EvidenceProps = {
  id: string
  kind: string
  label: string
  href: string
}

export function Evidence({ id, kind, label, href }: EvidenceProps) {
  const record = evidenceById[id]
  if (!record || record.status !== 'OK') return null
  if (kind !== record.kind || label !== record.label || href !== record.href) return null
  if (wordCount(label) > 25) return null
  if (!href.startsWith('https://')) return null

  return (
    <aside className="evidence-footnote" data-evidence={id}>
      <hr className="evidence-footnote__rule" />
      <p className="evidence-footnote__row">
        <span className="text-diagram-system">{kind}</span>
        <span className="text-meta">{label}</span>
        <a
          className="evidence-footnote__link"
          href={href}
          rel="noopener noreferrer"
          target="_blank"
          onClick={() => trackEvidenceClick(id)}
        >
          Source
        </a>
      </p>
    </aside>
  )
}
