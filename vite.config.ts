/* 2026-11-06: MAX-1029 writes /privacy and /terms HTML and injects SEO head tags.
   2026-11-03: root Vite config for the ported app. Figma Make plugins removed (MAX-993).
   2026-11-04: MAX-1005 prerenders the landing page into #root for no-js. */
import { defineConfig, createServer, type Plugin, type ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

type SsrModule = {
  render: (pathname?: string) => string
  headTags: (pathname: string) => string
}

function applyDocument(html: string, mod: SsrModule, pathname: string): string {
  const empty = html.replace(/<div id="root">[\s\S]*?<!-- galactos-root-end -->/, '<div id="root"></div>\n    <!-- galactos-root-end -->')
  const withRoot = empty.replace(
    '<div id="root"></div>\n    <!-- galactos-root-end -->',
    `<div id="root">${mod.render(pathname)}</div>\n    <!-- galactos-root-end -->`,
  )
  return withRoot.replace(/<!-- galactos-head -->[\s\S]*?<!-- galactos-head-end -->/, `<!-- galactos-head -->\n    ${mod.headTags(pathname)}\n    <!-- galactos-head-end -->`)
}

async function withSsr<T>(ctxServer: ViteDevServer | undefined, run: (server: ViteDevServer) => Promise<T>): Promise<T> {
  if (ctxServer) return run(ctxServer)
  process.env.GALACTOS_PRERENDER = '1'
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
  try {
    return await run(server)
  } finally {
    await server.close()
    delete process.env.GALACTOS_PRERENDER
  }
}

function prerender(): Plugin {
  return {
    name: 'galactos-prerender',
    async transformIndexHtml(html, ctx) {
      if (process.env.GALACTOS_PRERENDER === '1') return html
      return withSsr(ctx.server, async (server) => {
        const mod = await server.ssrLoadModule('/src/content/seo.ts') as { headTags: (pathname: string) => string }
        const app = await server.ssrLoadModule('/src/entry-ssr.tsx') as { render: (pathname?: string) => string }
        const requestPath = ctx.path.replace(/\/$/, '') || '/'
        const pathname = requestPath === '/privacy' || requestPath === '/terms' ? requestPath : '/'
        return applyDocument(html, { render: app.render, headTags: mod.headTags }, pathname)
      })
    },
    async closeBundle() {
      if (process.env.GALACTOS_PRERENDER === '1') return
      const distIndex = path.join(rootDir, 'dist/index.html')
      if (!fs.existsSync(distIndex)) return
      const shell = fs.readFileSync(distIndex, 'utf8')
      await withSsr(undefined, async (server) => {
        const mod = await server.ssrLoadModule('/src/content/seo.ts') as { headTags: (pathname: string) => string }
        const app = await server.ssrLoadModule('/src/entry-ssr.tsx') as { render: (pathname?: string) => string }
        for (const pathname of ['/privacy', '/terms']) {
          const html = applyDocument(shell, { render: app.render, headTags: mod.headTags }, pathname)
          const dir = path.join(rootDir, 'dist', pathname.slice(1))
          fs.mkdirSync(dir, { recursive: true })
          fs.writeFileSync(path.join(dir, 'index.html'), html)
        }
      })
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
