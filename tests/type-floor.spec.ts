/* 2026-11-03: MAX-998 type floor. Visible text computed font-size stays at least 12px. */
import { expect, test } from '@playwright/test'

test('visible text is at least 12px', async ({ page }) => {
  const problems: string[] = []
  page.on('pageerror', (err) => {
    problems.push(`[pageerror] ${err.message}`)
  })

  await page.route('**/*plausible.io/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }),
  )
  await page.goto('/?motion=final')
  await page.waitForFunction(() => document.documentElement.dataset.galactosReady === 'true')
  await page.evaluate(async () => {
    await document.fonts.ready
  })

  const small = await page.evaluate(() => {
    const hits: string[] = []
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    let node = walker.nextNode()
    while (node) {
      const text = node.textContent?.replace(/\s+/g, ' ').trim() ?? ''
      const el = node.parentElement
      if (text && el) {
        const style = getComputedStyle(el)
        const hidden =
          style.display === 'none' ||
          style.visibility === 'hidden' ||
          Number(style.opacity) === 0
        const box = el.getClientRects()
        const onScreen = [...box].some((rect) => rect.width > 0 && rect.height > 0)
        const size = Number.parseFloat(style.fontSize)
        if (!hidden && onScreen && size < 12) {
          const id = el.id ? `#${el.id}` : el.tagName.toLowerCase()
          hits.push(`${size}px ${id}: ${text.slice(0, 80)}`)
        }
      }
      node = walker.nextNode()
    }
    return hits
  })

  expect(problems, problems.join('\n')).toEqual([])
  expect(small, small.join('\n')).toEqual([])
})
