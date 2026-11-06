/* 2026-11-06: MAX-1029. Head tags reuse CANONICAL_DEFINITION from copy.ts.
   Site origin matches VITE_SITE_URL. Organization JSON-LD uses only name, url, description, and the shipped logo. */
import { CANONICAL_DEFINITION } from './copy'

export { CANONICAL_DEFINITION }

export const SITE_ORIGIN = (import.meta.env.VITE_SITE_URL || 'https://galactos.io').replace(/\/$/, '')

export const PAGE_TITLE = 'Galactos — AI Workflow Reliability'

const PAGE_TITLES: Record<string, string> = {
  '/': PAGE_TITLE,
  '/privacy': 'Privacy — Galactos',
  '/terms': 'Terms — Galactos',
}

export function pageTitle(pathname: string): string {
  return PAGE_TITLES[pathname] || PAGE_TITLE
}

export function canonicalUrl(pathname: string): string {
  if (pathname === '/') return `${SITE_ORIGIN}/`
  return `${SITE_ORIGIN}${pathname}`
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
}

export function headTags(pathname: string): string {
  const title = pageTitle(pathname)
  const canonical = canonicalUrl(pathname)
  const description = escapeAttr(CANONICAL_DEFINITION)
  const image = `${SITE_ORIGIN}/og.png`
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Galactos',
    url: `${SITE_ORIGIN}/`,
    description: CANONICAL_DEFINITION,
    logo: `${SITE_ORIGIN}/icon-512.png`,
  })
  return [
    `<title>${escapeAttr(title)}</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeAttr(title)}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(title)}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<link rel="icon" href="/favicon.ico" sizes="32x32" />`,
    `<link rel="icon" href="/icon-512.png" type="image/png" sizes="512x512" />`,
    `<script type="application/ld+json">${jsonLd}</script>`,
  ].join('\n    ')
}
