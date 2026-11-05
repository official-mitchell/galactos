/* 2026-11-05: MAX-1020 §6.1. Final motion completes both lanes and the glossary term is focusable. */
import { expect, test } from '@playwright/test'

test('motion final completes both standard lanes and the glossary term is described', async ({ page }) => {
  await page.addInitScript(() => {
    window.addEventListener('galactos:analytics', (event) => {
      const detail = (event as CustomEvent<{ name?: string }>).detail
      if (detail?.name === 's4_view') {
        ;(window as unknown as { __s4?: number }).__s4 = ((window as unknown as { __s4?: number }).__s4 ?? 0) + 1
      }
    })
  })
  await page.goto('/?motion=final')
  await page.waitForFunction(() => document.documentElement.dataset.galactosReady === 'true')
  const section = page.locator('#section-verification')
  await expect(section).toHaveAttribute('data-lanes', 'complete')
  await expect(section).toHaveAttribute('data-terminal', 'filled')
  await expect(section.getByRole('heading', { name: 'Reported' })).toBeVisible()
  await expect(section.getByRole('heading', { name: 'Verified' })).toBeVisible()
  await expect(section.getByText('Self-reported completion')).toBeVisible()
  await expect(section.getByText('Verification begins where local success ends.')).toBeVisible()
  const term = section.getByRole('button', { name: 'authoritative state' })
  await term.focus()
  await expect(term).toBeFocused()
  const noteId = await term.getAttribute('aria-describedby')
  expect(noteId).toBeTruthy()
  await expect(section.locator(`#${noteId}`)).toBeVisible()
  await expect(section.locator('[data-evidence="E1"]')).toBeVisible()
  const viewed = await page.evaluate(
    () => (window as unknown as { __s4?: number }).__s4 ?? 0,
  )
  expect(viewed).toBeGreaterThan(0)
})
