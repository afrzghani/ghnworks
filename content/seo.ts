import type { Portfolio } from './schema.ts'

export type PageMeta = { title: string; description: string; image: string; indexable: boolean }
export function pageMetadata(data: Portfolio): Record<string, PageMeta> {
  const page = (title: string, description: string): PageMeta => ({ title: `${title} — GHNWORKS`, description, image: '/og-default.png', indexable: true })
  const routes: Record<string, PageMeta> = {
    '/': page('Index', data.site.shortBio),
    '/visual': page('Visual', 'Graphic design, visual identities, posters, illustration, and UI/UX by Ghani.'),
    '/code': page('Code', 'Websites, applications, and coding experiments by Ghani.'),
    '/profile': page('Profile', data.profile.introduction),
    '/contact': page('Contact', data.site.contactIntro),
  }
  for (const [base, entries] of [['visual', data.projects], ['code', data.experiments]] as const) {
    for (const item of entries) routes[`/${base}/${item.slug}`] = { ...page(item.title, item.summary), image: 'cover' in item ? item.cover.src : item.preview.src, indexable: item.status === 'published' }
  }
  routes['/404'] = { ...page('Not Found', 'This page could not be found. Explore visual work, code projects, or contact Ghani.'), indexable: false }
  return routes
}

export function siteOrigin(value?: string) {
  if (!value) return ''
  const url = new URL(value)
  if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash || url.username || url.password) throw new Error('SITE_URL must be an HTTPS origin, e.g. https://your-site.vercel.app')
  return url.origin
}
export const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!)
export function seoTags(meta: PageMeta, path: string, origin: string, noindex: boolean) {
  const e = escapeHtml
  const image = meta.image.startsWith('https:') ? meta.image : origin ? `${origin}${meta.image}` : ''
  return `<title>${e(meta.title)}</title>
    <meta name="description" content="${e(meta.description)}" />
    <meta name="robots" content="${noindex || !meta.indexable ? 'noindex, nofollow' : 'index, follow'}" />
    <meta property="og:type" content="website" /><meta property="og:site_name" content="GHNWORKS" />
    <meta property="og:title" content="${e(meta.title)}" /><meta property="og:description" content="${e(meta.description)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${e(meta.title)}" /><meta name="twitter:description" content="${e(meta.description)}" />
    ${image ? `<meta property="og:image" content="${e(image)}" /><meta name="twitter:image" content="${e(image)}" />` : ''}
    ${origin && meta.indexable ? `<link rel="canonical" href="${e(origin + path)}" /><meta property="og:url" content="${e(origin + path)}" />` : ''}`
}
