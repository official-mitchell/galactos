/* 2026-11-03: root Vite config for the ported app. Figma Make plugins removed (MAX-993).
   2026-11-04: MAX-1005 prerenders the landing page into #root for no-js. */
import { defineConfig, createServer, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

function prerender(): Plugin {
  return {
    name: 'galactos-prerender',
    async transformIndexHtml(html, ctx) {
      if (process.env.GALACTOS_PRERENDER === '1') return html
      const load = async (server: { ssrLoadModule: (id: string) => Promise<{ render: () => string }> }) => {
        const mod = await server.ssrLoadModule('/src/entry-ssr.tsx')
        return html.replace('<div id="root"></div>', `<div id="root">${mod.render()}</div>`)
      }
      if (ctx.server) return load(ctx.server)
      process.env.GALACTOS_PRERENDER = '1'
      const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
      try {
        return await load(server)
      } finally {
        await server.close()
        delete process.env.GALACTOS_PRERENDER
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), prerender()],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8443,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 8443,
  },
})
