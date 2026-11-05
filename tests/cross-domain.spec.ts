/* 2026-11-05: MAX-1021 §6.2. Row order matches across plates. Knowledge has no Evidence. */
import { expect, test } from '@playwright/test'

test('cross-domain plates share a schema and knowledge stays uncited', async ({ page }) => {
  await page.goto('/?motion=final')
  await page.waitForFunction(() => document.documentElement.dataset.galactosReady === 'true')
  const section = page.locator('#section-proof')
  await expect(section).toHaveAttribute('data-plates', 'complete')
  const plates = section.locator('[data-plate]')
  await expect(plates).toHaveCount(3)
  const orders = await plates.evaluateAll((nodes) =>
    nodes.map((node) => [...node.querySelectorAll('[data-row]')].map((row) => row.getAttribute('data-row'))),
  )
  expect(orders).toEqual([
    ['Reported', 'Actual', 'Verified'],
    ['Reported', 'Actual', 'Verified'],
    ['Reported', 'Actual', 'Verified'],
  ])
  await expect(section.locator('[data-plate="support"] [data-evidence="E9"]')).toBeVisible()
  await expect(section.locator('[data-plate="revenue"] [data-evidence="E7"]')).toBeVisible()
  await expect(section.locator('[data-plate="knowledge"] [data-evidence]')).toHaveCount(0)
})
