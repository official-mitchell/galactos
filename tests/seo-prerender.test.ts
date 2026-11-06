/* 2026-11-06: MAX-1029. Checks built HTML for the canonical sentence and section copy.
   Changelog: 2026-11-06 added the built-HTML assertions for /, /privacy, and /terms. */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { CANONICAL_DEFINITION } from '../src/content/copy.ts'

const home = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8')
const privacy = readFileSync(new URL('../dist/privacy/index.html', import.meta.url), 'utf8')
const terms = readFileSync(new URL('../dist/terms/index.html', import.meta.url), 'utf8')

function attr(html: string, pattern: RegExp): string {
  const match = html.match(pattern)
  assert.ok(match, pattern.source)
  return match[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
}

test('canonical definition is identical in meta, Open Graph, JSON-LD, and the visible page', () => {
  assert.equal(attr(home, /<meta name="description" content="([^"]*)"/), CANONICAL_DEFINITION)
  assert.equal(attr(home, /<meta property="og:description" content="([^"]*)"/), CANONICAL_DEFINITION)
  const json = home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
  assert.ok(json)
  assert.equal(JSON.parse(json[1]).description, CANONICAL_DEFINITION)
  assert.equal(JSON.parse(json[1])['@type'], 'Organization')
  const visible = home.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
  assert.ok(visible.includes(CANONICAL_DEFINITION))
})

test('view-source of / contains the H1 and each section headline', () => {
  const phrases = [
    'Your AI workflow can say',
    'Every component can report success while the workflow still fails.',
    'Component success is not evidence of end-to-end completion.',
    '“Done” has two meanings.',
    'This problem appears anywhere AI crosses systems.',
    'When this becomes a Galactos problem.',
    'The AI Workflow Reliability Diagnostic.',
    'What you leave with.',
    'Follow the business outcome, not the green checks.',
    'One business outcome',
    "Have a workflow you don't completely trust?",
  ]
  const visible = home
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
  assert.match(home, /<h1[\s\S]*?Your AI workflow can say/)
  for (const phrase of phrases) assert.ok(visible.includes(phrase), phrase)
})

test('privacy and terms are prerendered documents', () => {
  assert.match(privacy, /<h1[^>]*>Privacy<\/h1>/)
  assert.match(terms, /<h1[^>]*>Terms<\/h1>/)
  assert.match(privacy, /rel="canonical" href="https:\/\/galactos\.io\/privacy"/)
  assert.match(terms, /rel="canonical" href="https:\/\/galactos\.io\/terms"/)
})

test('share and crawl files ship with the build', () => {
  const robots = readFileSync(new URL('../dist/robots.txt', import.meta.url), 'utf8')
  const sitemap = readFileSync(new URL('../dist/sitemap.xml', import.meta.url), 'utf8')
  const missing = readFileSync(new URL('../dist/404.html', import.meta.url), 'utf8')
  assert.match(robots, /Sitemap: https:\/\/galactos\.io\/sitemap\.xml/)
  assert.match(sitemap, /https:\/\/galactos\.io\/privacy/)
  assert.match(missing, /Page not found/)
  assert.match(home, /og:image" content="https:\/\/galactos\.io\/og\.png"/)
  assert.match(home, /rel="icon" href="\/favicon\.ico"/)
})
