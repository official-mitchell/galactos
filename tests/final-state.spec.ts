/* 2026-11-03: MAX-996 smoke screenshot. One section, one viewport, one mode.
   Update the committed baseline only with `npm run shot:update`.
   Full matrix: `npm run shot -- --section all`. */
import { expect, test } from '@playwright/test'

test('hero final-state light 390 stays within 1% of the baseline', async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== '390x844-light',
    'Smoke is 390×844 light. Other projects exist for the harness config. Use npm run shot for the matrix.',
  )

  const problems: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      problems.push(`[${msg.type()}] ${msg.text()}`)
    }
  })
  page.on('pageerror', (err) => {
    problems.push(`[pageerror] ${err.message}`)
  })

  await page.route('**/*plausible.io/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }),
  )
  await page.goto('/?motion=final&mode=light&shot=1')
  await page.waitForFunction(() => document.documentElement.dataset.galactosReady === 'true')
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([...document.images].map((img) => (img.decode ? img.decode().catch(() => undefined) : Promise.resolve())))
    if (window.ScrollTrigger?.refresh) window.ScrollTrigger.refresh()
    await window.__galactos?.ready
    window.__galactos?.setMode('light')
    window.__galactos?.seek('section-hero', 1)
  })

  expect(problems, problems.join('\n')).toEqual([])
  await expect(page).toHaveScreenshot('section-hero-final-light.png', {
    maxDiffPixelRatio: 0.01,
  })
})
