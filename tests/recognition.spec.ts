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
  await expect(section.locator('[data-evidence="E10"]')).toBeVisible()
})

test('recognition sticky column stays above the footer', async ({ page }) => {
  await page.goto('/?motion=final')
  await page.waitForFunction(() => document.documentElement.dataset.galactosReady === 'true')
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1280, height: 720 },
  ]) {
    await page.setViewportSize(viewport)
    await page.locator('footer').scrollIntoViewIfNeeded()
    const overlap = await page.evaluate(() => {
      const sticky = document.querySelector('#section-diagnostic .layout-split__sticky')
      const footer = document.querySelector('footer')
      if (!sticky || !footer) return 1
      return sticky.getBoundingClientRect().bottom - footer.getBoundingClientRect().top
    })
    expect(overlap).toBeLessThanOrEqual(1)
  }
})
