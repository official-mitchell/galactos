/* 2026-11-04: MAX-1017. Hero events, fold, and final-versus-reduced end state. */
import { expect, test } from '@playwright/test'

test('hero records a view and a CTA click, and the headline stays in the first screen', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== '1280x720-light' && testInfo.project.name !== '390x844-light', 'Fold check is 1280 and the CI viewport')
  const events: { name: string; id?: string }[] = []
  await page.exposeBinding('__pushHero', (_source, detail: { name: string; id?: string }) => {
    events.push(detail)
  })
  await page.addInitScript(() => {
    window.addEventListener('galactos:analytics', (event) => {
      const detail = (event as CustomEvent<{ name: string; id?: string }>).detail
      void (window as unknown as { __pushHero: (detail: { name: string; id?: string }) => void }).__pushHero(detail)
    })
  })
  await page.goto('/?motion=final&shot=1')
  await page.waitForFunction(() => document.documentElement.dataset.galactosReady === 'true')
  await expect.poll(() => events.some((event) => event.name === 'hero_view')).toBe(true)
  const h1 = page.locator('#section-hero h1')
  const cta = page.locator('#section-hero').getByRole('link', { name: 'Walk me through the workflow' })
  await expect(h1).toBeInViewport()
  await expect(cta).toBeInViewport()
  await expect(page.locator('#section-hero').getByText(/evidence/i)).toHaveCount(0)
  if (testInfo.project.name === '390x844-light') {
    const size = await h1.evaluate((node) => parseFloat(getComputedStyle(node).fontSize))
    expect(size).toBe(40)
  }
  await cta.click()
  await expect.poll(() => events.some((event) => event.name === 'hero_cta_click' && event.id === 'workflow')).toBe(true)
})

test('reduced-motion hero matches the final end state', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== '390x844-light', 'One viewport stands in for the equality check')
  async function shot(motion: string) {
    await page.goto(`/?motion=${motion}&mode=light&shot=1`)
    await page.waitForFunction(() => document.documentElement.dataset.galactosReady === 'true')
    await page.evaluate(async () => {
      await document.fonts.ready
      await window.__galactos?.ready
      window.__galactos?.seek('section-hero', 1)
    })
    return page.locator('#section-hero').screenshot()
  }
  const finalShot = await shot('final')
  const reducedShot = await shot('reduced')
  expect(reducedShot.equals(finalShot)).toBe(true)
})
