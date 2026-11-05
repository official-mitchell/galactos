/* 2026-11-05: MAX-1022. Final motion holds the first card open and the meter on the outcome X. */
import { expect, test } from '@playwright/test'

test('recognition final motion matches the settled mock state', async ({ page }) => {
  await page.goto('/?motion=final#section-diagnostic')
  await page.waitForFunction(() => document.documentElement.dataset.galactosReady === 'true')
  const section = page.locator('#section-diagnostic')
  await expect(section.locator('[data-open="true"]')).toHaveCount(1)
  await expect(section.locator('.recognition-card').first()).toHaveAttribute('data-open', 'true')
  await expect(section.locator('[data-meter-step]')).toHaveAttribute('data-meter-step', '4')
  await expect(section.locator('[data-mark="divergence"][data-on="true"]')).toHaveCount(1)
  await expect(section.getByRole('button')).toHaveCount(6)
})
