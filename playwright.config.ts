/* 2026-11-03: MAX-996 screenshot projects. webServer is the Vite dev server.
   CI runs one project (390×844 light). The 11×4×2 matrix is `npm run shot -- --section all`. */
import { defineConfig, devices } from '@playwright/test'

const port = Number(process.env.GALACTOS_PORT || 8443)

const viewports = [
  { width: 1440, height: 900 },
  { width: 1280, height: 720 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
] as const

const schemes = ['light', 'dark'] as const

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: 'line',
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: 'off',
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
    },
  },
  webServer: {
    command: `npm run dev -- --port ${port} --strictPort --host 127.0.0.1`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: viewports.flatMap((viewport) =>
    schemes.map((colorScheme) => ({
      name: `${viewport.width}x${viewport.height}-${colorScheme}`,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: viewport.width, height: viewport.height },
        colorScheme,
        deviceScaleFactor: 1,
      },
    })),
  ),
})
