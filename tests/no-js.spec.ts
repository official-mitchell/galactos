/* 2026-11-04: MAX-1005. With JavaScript disabled, the document stays no-js and
   the static shell is not painted at opacity 0. Section copy is client-rendered,
   so it is absent until JS runs. */
import { expect, test } from '@playwright/test'

test.use({ javaScriptEnabled: false })

test('text stays visible when JavaScript is off', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveClass(/no-js/)
  const hidden = await page.evaluate(() => {
    const offenders: string[] = []
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    let node = walker.nextNode()
    while (node) {
      const text = node.textContent?.trim()
      const parent = node.parentElement
      if (text && parent) {
        const style = getComputedStyle(parent)
        if (style.visibility === 'hidden' || Number(style.opacity) === 0 || style.display === 'none') {
          offenders.push(text.slice(0, 40))
        }
      }
      node = walker.nextNode()
    }
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
})
