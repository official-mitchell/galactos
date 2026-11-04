/* 2026-11-03: MAX-1000. Every Node kind renders. pending is outline only. */
import { expect, test } from '@playwright/test'

const kinds = ['intent', 'success', 'expected', 'evidence', 'anomaly', 'missing', 'pending'] as const

test('style guide renders every node kind and state', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== '390x844-light', 'One project is enough for the kit check.')

  await page.goto('/#styleguide')
  await page.waitForFunction(() => document.documentElement.dataset.galactosReady === 'true')
  await page.locator('[data-node-kind="intent"]').first().waitFor()

  for (const kind of kinds) {
    const states = kind === 'pending' ? ['outline'] : ['outline', 'resolved']
    for (const state of states) {
      await expect(page.locator(`[data-node-kind="${kind}"][data-node-state="${state}"]`).first()).toBeVisible()
    }
  }

  await expect(page.locator('[data-node-kind="pending"][data-node-state="resolved"]')).toHaveCount(0)

  await page.goto('/?mode=dark#styleguide')
  await page.waitForFunction(() => document.documentElement.classList.contains('dark'))
  for (const kind of kinds) {
    await expect(page.locator(`[data-node-kind="${kind}"]`).first()).toBeVisible()
  }
})
