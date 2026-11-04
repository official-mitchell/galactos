/* 2026-11-03: MAX-1003 theme persistence and first-paint dark base.
   Runs with the CI project (390×844 light). Dark first paint overrides colorScheme. */
import { expect, test } from '@playwright/test'

const DARK_BASE = 'rgb(10, 21, 32)'
const LIGHT_BASE = 'rgb(248, 246, 243)'

test.beforeEach(({}, testInfo) => {
  test.skip(
    testInfo.project.name !== '390x844-light',
    'Theme checks run on the CI project. Other projects exist for the harness config.',
  )
})

test('header theme toggle persists across reload', async ({ page }) => {
  await page.route('**/*plausible.io/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }),
  )
  const sources: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'log' && (msg.text() === 'stored' || msg.text() === 'system')) {
      sources.push(msg.text())
    }
  })

  await page.goto('/?shot=1')
  await page.getByRole('button', { name: 'Switch to dark mode' }).click()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await expect.poll(async () => page.evaluate(() => localStorage.getItem('galactos-theme'))).toBe('dark')

  await page.reload()
  await expect(page.locator('html')).toHaveClass(/dark/)
  expect(await page.evaluate(() => localStorage.getItem('galactos-theme'))).toBe('dark')
  expect(sources).toContain('stored')
})

test.describe('system dark first paint', () => {
  test.use({ colorScheme: 'dark' })

  test('first paint uses the dark base background', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('galactos-theme')
      const paints: string[] = []
      const tick = () => {
        if (document.body) {
          const bg = getComputedStyle(document.body).backgroundColor
          if (paints[paints.length - 1] !== bg) paints.push(bg)
        }
        requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
      ;(window as unknown as { __bgPaints: string[] }).__bgPaints = paints
    })
    await page.route('**/*plausible.io/**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }),
    )

    const logs: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'log') logs.push(msg.text())
    })

    await page.goto('/?shot=1', { waitUntil: 'domcontentloaded' })
    expect(await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(true)

    await expect.poll(async () => page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(DARK_BASE)
    const paints = await page.evaluate(() => (window as unknown as { __bgPaints: string[] }).__bgPaints)
    expect(paints).not.toContain(LIGHT_BASE)
    expect(paints).toContain(DARK_BASE)
    expect(logs).toContain('system')
  })
})
