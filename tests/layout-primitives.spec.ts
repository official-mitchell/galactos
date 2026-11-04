/* 2026-11-03: MAX-999. Style guide fixture sections match src/content/sections.ts. */
import { expect, test } from '@playwright/test'
import { sections } from '../src/content/sections'

test('layout sections match sections.ts and are unique', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== '390x844-light', 'One project is enough for the id check.')

  await page.goto('/#styleguide')
  await page.waitForFunction(() => document.documentElement.dataset.galactosReady === 'true')
  await page.locator('[data-layout-section]').first().waitFor()

  const ids = await page.locator('[data-layout-section]').evaluateAll((nodes) => nodes.map((node) => node.id))
  const expected = sections.map((entry) => entry.id)
  expect(new Set(ids).size).toBe(ids.length)
  expect(ids).toEqual(expected)

  const acts = await page.locator('[data-layout-section]').evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute('data-act')),
  )
  expect(acts).toEqual(sections.map((entry) => entry.act))
})
