/* 2026-11-04: MAX-1005. With JavaScript disabled, prerendered section text stays visible. */
import { expect, test } from '@playwright/test'

test.use({ javaScriptEnabled: false })

test('text stays visible when JavaScript is off', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveClass(/no-js/)
  const hidden = await page.evaluate(() => {
    const main = document.querySelector('main')
    if (!main) return ['missing main']
    const faded = main.querySelectorAll<HTMLElement>('[style*="opacity: 0"], [style*="opacity:0"]')
    const offenders: string[] = []
    faded.forEach((el) => {
      if (getComputedStyle(el).opacity === '0') offenders.push((el.textContent || '').trim().slice(0, 40))
    })
    return offenders
  })
  expect(hidden).toEqual([])
  const shell = await page.evaluate(() => {
    const root = document.getElementById('root')
    const body = getComputedStyle(document.body)
    const rootStyle = root ? getComputedStyle(root) : null
    return {
      bodyHidden: body.visibility === 'hidden' || Number(body.opacity) === 0 || body.display === 'none',
      rootHidden: rootStyle
        ? rootStyle.visibility === 'hidden' || Number(rootStyle.opacity) === 0 || rootStyle.display === 'none'
        : true,
    }
  })
  expect(shell).toEqual({ bodyHidden: false, rootHidden: false })
  await expect(page.locator('main')).toContainText('Galactos investigates consequential')
})
