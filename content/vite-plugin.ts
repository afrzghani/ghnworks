import type { Plugin, ResolvedConfig } from 'vite'
import { loadEnv } from 'vite'
import { readFile, writeFile, mkdir, readdir, unlink } from 'node:fs/promises'
import { resolve, dirname, relative, sep } from 'node:path'
import { loadPortfolio } from './load.ts'
import type { Portfolio } from './schema.ts'
import { pageMetadata, seoTags, siteOrigin, escapeHtml } from './seo.ts'

const virtualId = 'virtual:portfolio'
const resolvedId = '\0' + virtualId
const runtimeConfigId = 'virtual:portfolio-runtime-config'
const runtimeConfigResolvedId = '\0' + runtimeConfigId
const marker = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/
export function portfolioPlugin(): Plugin {
  let config: ResolvedConfig
  let env: Record<string, string | undefined>
  let data: Portfolio
  let origin = ''
  let noindex = true
  const payload = () => ({ ...data, metadata: pageMetadata(data), origin, noindex })
  const tags = (path: string) => `<!-- seo:start -->${seoTags(pageMetadata(data)[path], path, origin, noindex)}<!-- seo:end -->`
  return {
    name: 'ghnworks-content',
    async configResolved(resolved) {
      config = resolved
      env = { ...loadEnv(config.mode, config.root, ''), ...process.env }
      for (const key of Object.keys(env)) {
        if (/^(VITE_|SANITY_STUDIO_).*(TOKEN|SECRET|PASSWORD)/i.test(key) && env[key]) throw new Error(`Secret-like environment variable ${key} must not be exposed to browsers.`)
      }
      data = await loadPortfolio(env, config.command === 'serve')
      if (data.source === 'sanity' && data.preview && !['127.0.0.1', 'localhost', '::1', undefined, false].includes(config.server.host)) {
        throw new Error('CMS draft preview must bind to a loopback address.')
      }
      origin = siteOrigin(env.SITE_URL)
      noindex = config.command === 'serve' || env.VERCEL_ENV === 'preview' || env.SITE_NOINDEX === 'true' || !origin
    },
    resolveId(id) {
      if (id === virtualId) return resolvedId
      if (id === runtimeConfigId) return runtimeConfigResolvedId
    },
    load(id) {
      if (id === resolvedId) return `export default ${JSON.stringify(payload())}`
      if (id === runtimeConfigResolvedId) return `export default ${JSON.stringify({ source: env.CONTENT_SOURCE || 'local', projectId: env.SANITY_PROJECT_ID, dataset: env.SANITY_DATASET })}`
    },
    transformIndexHtml(html) { return html.replace(/<title>[\s\S]*?<\/title>/, '').replace(/<meta name="description"[^>]*\/>/, '').replace('</head>', `${tags('/')}\n</head>`) },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (data.source !== 'sanity' || !req.headers.accept?.includes('text/html')) return next()
        try {
          data = await loadPortfolio(env, true)
          const module = server.moduleGraph.getModuleById(resolvedId)
          if (module) server.moduleGraph.invalidateModule(module)
          next()
        } catch {
          res.statusCode = 503
          res.end('CMS preview could not load. Check Sanity configuration; no stale content has been substituted.')
        }
      })
    },
    async writeBundle() {
      const out = resolve(config.root, config.build.outDir)
      if (out !== resolve(config.root, 'dist')) throw new Error('Static page output must be the workspace dist directory')
      const html = await readFile(resolve(out, 'index.html'), 'utf8')
      const routes = pageMetadata(data)
      for (const path of Object.keys(routes).filter(path => path !== '/')) {
        const filename = resolve(out, path.slice(1) + '.html')
        await mkdir(dirname(filename), { recursive: true })
        await writeFile(filename, html.replace(marker, tags(path)))
      }
      const urls = Object.entries(routes).filter(([, meta]) => meta.indexable).map(([path]) => `<url><loc>${escapeHtml(origin + path)}</loc></url>`).join('')
      await writeFile(resolve(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${noindex ? '' : urls}</urlset>`)
      await writeFile(resolve(out, 'robots.txt'), noindex ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`)
      const referenced = new Set<string>()
      for (const item of [...data.projects, ...data.experiments]) {
        for (const media of ['cover' in item ? item.cover : item.preview, ...item.gallery]) if (media.src.startsWith('/')) referenced.add(media.src)
      }
      // Prune only copied build assets: unpublished originals stay in public/.
      async function prune(directory: string) {
        const entries = await readdir(directory, { withFileTypes: true }).catch(() => [])
        for (const entry of entries) {
          const file = resolve(directory, entry.name)
          if (!file.startsWith(out + sep)) throw new Error('Unsafe output path')
          if (entry.isDirectory()) await prune(file)
          else if (!referenced.has('/' + relative(out, file).split(sep).join('/'))) await unlink(file)
        }
      }
      await prune(resolve(out, 'images'))
      await writeFile(resolve(out, 'content-build.json'), JSON.stringify({ source: data.source, perspective: 'published', visualCount: data.projects.length, codeCount: data.experiments.length, noindex }))
    },
  }
}
