/* 2026-11-05: Hero at 390px stays in one column, with a readable headline and a vertical diagram rail. */
import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 390, height: 844 } })

test('hero copy and diagram stay readable at 390', async ({ page }) => {
  await page.goto('/?motion=final')
  await page.waitForFunction(() => document.documentElement.dataset.galactosReady === 'true')
  const hero = page.locator('#section-hero')
  const overflow = await hero.evaluate((el) => el.scrollWidth - el.clientWidth)
  expect(overflow).toBeLessThanOrEqual(1)

  const headline = hero.locator('h1')
  const size = await headline.evaluate((el) => parseFloat(getComputedStyle(el).fontSize))
  expect(size).toBeGreaterThanOrEqual(28)
  expect(size).toBeLessThanOrEqual(34)
  await expect(headline).toBeVisible()

  const cards = hero.locator('.hero-card')
  await expect(cards).toHaveCount(5)
  const columns = await hero.locator('.hero-diagram-grid').evaluate((el) => getComputedStyle(el).flexDirection)
  expect(columns).toBe('column')
  for (const card of await cards.all()) {
    const clipped = await card.evaluate((el) => el.scrollWidth - el.clientWidth)
    expect(clipped).toBeLessThanOrEqual(1)
  }
  await expect(hero.locator('.hero-card-highlight')).toHaveText(/Subscription still active/)
  await expect(hero.locator('.hero-steps')).toBeHidden()
})
