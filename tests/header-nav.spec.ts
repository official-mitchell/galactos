/* 2026-11-04: MAX-1013. Anchor crawl plus a keyboard path through the header and mobile menu. */
import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const events: { name: string; props?: { target?: string } }[] = []
    ;(window as unknown as { __navEvents: typeof events }).__navEvents = events
    window.plausible = ((name: string, opts?: { props?: { target?: string } }) => {
      events.push({ name, props: opts?.props })
    }) as typeof window.plausible
  })
  await page.goto('/?shot=1')
})

test('every hash href and scroll target resolves to an id', async ({ page }) => {
  const ids = await page.locator('a[href^="#"], [data-scroll-target]').evaluateAll((nodes) => {
    const found = new Set<string>()
    for (const node of nodes) {
      const href = node.getAttribute('href')
      if (href && href.startsWith('#') && href.length > 1) found.add(href.slice(1))
      const target = node.getAttribute('data-scroll-target')
      if (target) found.add(target)
    }
    return [...found]
  })
  expect(ids.length).toBeGreaterThan(0)
  for (const id of ids) {
    await expect(page.locator(`[id="${id}"]`), `#${id}`).toHaveCount(1)
  }
})

test('desktop keyboard path reaches the workflow CTA and records nav_click', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== '1440x900-light', 'Desktop header path')
  await page.evaluate(() => {
    const clicks: { name: string; target: string }[] = []
    ;(window as unknown as { __navClicks: typeof clicks }).__navClicks = clicks
    window.addEventListener('galactos:analytics', (event) => {
      const detail = (event as CustomEvent<{ name: string; target: string }>).detail
      clicks.push(detail)
    })
  })
  const diagnostic = page.locator('header nav').getByRole('link', { name: 'Diagnostic', exact: true })
  await diagnostic.focus()
  await expect(diagnostic).toBeFocused()
  await page.keyboard.press('Enter')
  await expect.poll(async () =>
    page.evaluate(() => (window as unknown as { __navClicks: { name: string; target: string }[] }).__navClicks),
  ).toEqual([{ name: 'nav_click', target: 'section-intervention' }])
  await expect(page.locator('#section-intervention')).toBeInViewport()

  const header = page.locator('header')
  const mode = header.getByRole('button', { name: 'Switch to dark mode' })
  const cta = header.getByRole('link', { name: 'Audit Your Workflow' })
  const modeBox = await mode.boundingBox()
  const ctaBox = await cta.boundingBox()
  expect(modeBox && ctaBox && modeBox.x < ctaBox.x).toBe(true)
  await expect(header.getByRole('button', { name: /motion/i })).toHaveCount(0)
})

test('mobile menu traps focus, Escape closes, and the CTA stays visible', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== '390x844-light', 'Mobile menu path')
  const header = page.locator('header')
  const cta = header.getByRole('link', { name: 'Audit Your Workflow' })
  await expect(cta).toBeVisible()
  const box = await cta.boundingBox()
  expect(box && box.height).toBeGreaterThanOrEqual(44)

  await header.getByRole('button', { name: 'Open menu' }).focus()
  await page.keyboard.press('Enter')
  const menu = page.locator('#site-menu')
  await expect(menu).toBeVisible()
  await expect(menu.getByRole('link', { name: 'Diagnostic' })).toBeFocused()

  const linkBox = await menu.getByRole('link', { name: 'Diagnostic' }).boundingBox()
  expect(linkBox && linkBox.height).toBeGreaterThanOrEqual(44)
  await expect(cta).toBeVisible()

  await page.keyboard.press('Tab')
  await expect(menu.getByRole('link', { name: 'Method' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(menu.getByRole('link', { name: 'About' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(header.getByRole('link', { name: 'Skip to content' })).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(menu.getByRole('link', { name: 'About' })).toBeFocused()

  await page.keyboard.press('Escape')
  await expect(menu).toHaveCount(0)
  await expect(cta).toBeVisible()
  await expect(header.getByRole('button', { name: 'Open menu' })).toBeFocused()

  await header.getByRole('link', { name: 'Skip to content' }).focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('#content')).toBeInViewport()
})

test('header border appears after scroll', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== '1440x900-light', 'Scroll border')
  const header = page.locator('header')
  const before = await header.evaluate((el) => getComputedStyle(el).borderBottomColor)
  await page.evaluate(() => window.scrollTo(0, 200))
  await expect.poll(async () => header.evaluate((el) => getComputedStyle(el).borderBottomColor)).not.toBe(before)
})
