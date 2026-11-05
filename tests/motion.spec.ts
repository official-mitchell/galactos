/* 2026-11-04: MAX-1006 final/reduced settle, one-loop rule. MAX-1007 pause persistence.
   MAX-1008 nothing is revealed only on hover. axe checks the pause control. */
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('final and reduced screenshots of data-anim match', async ({ page }) => {
  async function shot(mode: string) {
    await page.goto(`/?motion=${mode}&fixture=motion`)
    await page.evaluate(() => document.fonts.ready)
    return page.locator('[data-anim="lab"]').screenshot()
  }
  const finalShot = await shot('final')
  const reducedShot = await shot('reduced')
  expect(Buffer.compare(finalShot, reducedShot)).toBe(0)
})

test('two loops in view leave one playing, and pause stops it', async ({ page }) => {
  await page.goto('/?fixture=motion')
  await expect(page.locator('[data-loop="a"]')).toBeVisible()
  await page.waitForTimeout(400)
  const playing = await page.evaluate(() => {
    const motion = (window as unknown as { __galactosMotion: { activeLoopCount: () => number } }).__galactosMotion
    return motion.activeLoopCount()
  })
  expect(playing).toBe(1)
  await page.getByRole('button', { name: 'Open menu' }).click()
  await page.getByRole('button', { name: 'Pause motion' }).click()
  await page.waitForTimeout(200)
  const paused = await page.evaluate(() => {
    const motion = (window as unknown as { __galactosMotion: { activeLoopCount: () => number } }).__galactosMotion
    return motion.activeLoopCount()
  })
  expect(paused).toBe(0)
})

test('pause persists across reload', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Open menu' }).click()
  await page.getByRole('button', { name: 'Pause motion' }).click()
  await expect(page.getByRole('button', { name: 'Resume motion' })).toHaveAttribute('aria-pressed', 'true')
  await page.reload()
  await page.getByRole('button', { name: 'Open menu' }).click()
  await expect(page.getByRole('button', { name: 'Resume motion' })).toHaveAttribute('aria-pressed', 'true')
})

test('pause toggle has an accessible name and no axe violations', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Open menu' }).click()
  const toggle = page.getByRole('button', { name: 'Pause motion' })
  await expect(toggle).toHaveAttribute('aria-pressed', 'false')
  const results = await new AxeBuilder({ page }).include('.motion-toggle').analyze()
  expect(results.violations).toEqual([])
})

test('hover does not gate copy', async ({ page }) => {
  await page.goto('/')
  const gated = await page.locator('[data-reveal-on-hover]').count()
  expect(gated).toBe(0)
  await expect(page.locator('main')).toContainText('Authoritative state: the system or evidence source')
})
