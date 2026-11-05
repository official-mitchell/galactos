/* 2026-11-04: MAX-1014 §4.4. Placeholder seam anchors share an x within 2px.
   Band edges are a 1px border-strong with no gradient. Live motion review stays human. */
import { expect, test } from '@playwright/test'

const widths = ['1440x900-light', '768x1024-light', '390x844-light'] as const

const pairs = ['hero-s2', 's3-s4'] as const

async function ready(page: import('@playwright/test').Page) {
  await page.waitForFunction(() => document.documentElement.dataset.galactosReady === 'true')
}

test('seam start and end share an x', async ({ page }, testInfo) => {
  test.skip(!widths.includes(testInfo.project.name as (typeof widths)[number]), '1440, 768, and 390 only.')
  await page.goto('/')
  await ready(page)

  const deltas = await page.evaluate((ids) => {
    return ids.map((id) => {
      const start = document.querySelector(`[data-seam-start="${id}"]`)
      const end = document.querySelector(`[data-seam-end="${id}"]`)
      if (!start || !end) return { id, delta: 999 }
      const delta = Math.abs(start.getBoundingClientRect().x - end.getBoundingClientRect().x)
      return { id, delta }
    })
  }, [...pairs])

  for (const row of deltas) {
    expect(row.delta, row.id).toBeLessThanOrEqual(2)
  }
})

test('hero drop is dashed and S3 closes with an arrow', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== '1440x900-light', 'One viewport checks the line paint.')
  await page.goto('/?motion=final')
  await ready(page)
  await page.waitForFunction(() => document.querySelector('[data-seam-line="hero-s2"]')?.getAttribute('data-seam-drawn') === 'true')
  await page.waitForFunction(() => document.querySelector('[data-seam-line="s3-s4"]')?.getAttribute('data-seam-drawn') === 'true')

  const paint = await page.evaluate(() => {
    const dashed = document.querySelector<SVGLineElement>('[data-seam-line="hero-s2"] line')
    const arrow = document.querySelector<SVGLineElement>('[data-seam-line="s3-s4"] line')
    return {
      dash: dashed ? getComputedStyle(dashed).strokeDasharray : '',
      marker: arrow?.getAttribute('marker-end') ?? '',
    }
  })
  expect(paint.dash).not.toBe('none')
  expect(paint.dash).not.toBe('')
  expect(paint.marker).toContain('seam-arrow')
})

test('S7 and S11 band edges are 1px border-strong', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== '1440x900-light', 'Band edge is the same at every width.')
  await page.goto('/')
  await ready(page)

  const edges = await page.evaluate(() => {
    const probe = document.createElement('div')
    probe.style.borderTop = '1px solid var(--border-strong)'
    document.body.appendChild(probe)
    const expected = getComputedStyle(probe).borderTopColor
    probe.remove()
    return ['section-intervention', 'section-cta'].map((id) => {
      const section = document.getElementById(id)
      if (!section) return { id, ok: false }
      const style = getComputedStyle(section)
      return {
        id,
        ok: style.borderTopWidth === '1px'
          && style.borderTopStyle === 'solid'
          && style.borderTopColor === expected
          && style.backgroundImage === 'none',
      }
    })
  })

  for (const edge of edges) expect(edge.ok, edge.id).toBe(true)
})
