/* 2026-11-04: MAX-1012. Spine stays clear of Container children and the editorial column.
   ?motion=final draws the whole trace. Reduced motion holds the full line and act nodes. */
import { expect, test } from '@playwright/test'

const widths = ['1440x900-light', '1280x720-light', '768x1024-light', '390x844-light'] as const

async function ready(page: import('@playwright/test').Page) {
  await page.waitForFunction(() => document.documentElement.dataset.galactosReady === 'true')
}

test('spine does not intersect container children', async ({ page }, testInfo) => {
  test.skip(!widths.includes(testInfo.project.name as (typeof widths)[number]), 'Four light viewports only.')
  await page.goto('/')
  await ready(page)
  await page.locator('[data-spine]').waitFor({ state: 'attached' })

  const overlaps = await page.evaluate(() => {
    const spine = document.querySelector('[data-spine]')
    if (!spine) return ['missing spine']
    const box = spine.getBoundingClientRect()
    const children = [...document.querySelectorAll('.layout-container > *, .container-editorial > *')]
    const hits: string[] = []
    for (const child of children) {
      const rect = child.getBoundingClientRect()
      const width = Math.min(box.right, rect.right) - Math.max(box.left, rect.left)
      const height = Math.min(box.bottom, rect.bottom) - Math.max(box.top, rect.top)
      if (width > 0.5 && height > 0.5) hits.push(child.tagName)
    }
    return hits
  })
  expect(overlaps).toEqual([])
})

test('motion=final draws the spine', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== '1440x900-light', 'One wide viewport shows the trace.')
  await page.goto('/?motion=final')
  await ready(page)
  await page.waitForFunction(() => document.querySelector('[data-spine]')?.getAttribute('data-spine-drawn') === 'true')

  const drawn = await page.evaluate(() => {
    const root = document.querySelector('[data-spine]')
    const segments = [...document.querySelectorAll<HTMLElement>('[data-spine-segment]')]
    return {
      progress: root?.getAttribute('data-spine-progress'),
      segments: segments.map((segment) => getComputedStyle(segment).clipPath),
      terminal: document.querySelector('[data-spine-role="terminal"]')?.getAttribute('data-spine-terminal'),
    }
  })
  expect(drawn.progress).toBe('1.000')
  expect(drawn.segments.length).toBe(3)
  for (const clip of drawn.segments) {
    expect(clip).not.toContain('100%')
  }
  expect(drawn.terminal).toBe('filled')
})

test('reduced motion holds the full line and act nodes', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== '1440x900-light', 'One wide viewport shows the trace.')
  await page.goto('/?motion=reduced')
  await ready(page)
  await page.waitForFunction(() => document.querySelector('[data-spine]')?.getAttribute('data-spine-drawn') === 'true')

  const state = await page.evaluate(() => {
    const roles = [...document.querySelectorAll('[data-spine-node]')].map((node) => node.getAttribute('data-spine-role'))
    const fills = [...document.querySelectorAll<HTMLElement>('[data-spine-fill]')].map((fill) => getComputedStyle(fill).opacity)
    return {
      motion: document.documentElement.dataset.motion,
      roles,
      fills,
      orange: getComputedStyle(document.querySelector('[data-spine-segment="divergence"]')!).backgroundImage,
    }
  })
  expect(state.motion).toBe('reduced')
  expect(state.roles.filter((role) => role === 'intent')).toHaveLength(1)
  expect(state.roles.filter((role) => role === 'act').length).toBeGreaterThanOrEqual(4)
  expect(state.roles.filter((role) => role === 'terminal')).toHaveLength(1)
  expect(state.fills.every((opacity) => Number(opacity) === 1)).toBe(true)
  expect(state.orange).toContain('gradient')
})
