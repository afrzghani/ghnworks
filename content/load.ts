import { projectRecords } from '../src/data/projects.ts'
import { experimentRecords } from '../src/data/experiments.ts'
import { site, indexCopy } from '../src/data/site.ts'
import { profile } from '../src/data/profile.ts'
import { validatePortfolio } from './schema.ts'
import { loadSanity } from './sanity.ts'

export function contentSettings(env: Record<string, string | undefined>, development: boolean) {
  const source = env.CONTENT_SOURCE || 'local'
  const perspective = env.CONTENT_PERSPECTIVE || 'published'
  if (!['local', 'sanity'].includes(source)) throw new Error('CONTENT_SOURCE must be local or sanity')
  if (!['published', 'drafts'].includes(perspective)) throw new Error('CONTENT_PERSPECTIVE must be published or drafts')
  if (perspective === 'drafts' && (!development || env.VERCEL)) throw new Error('Draft snapshots are allowed only on the local development server, never in a deployed build.')
  if (env.VERCEL_ENV === 'production' && !env.SITE_URL) throw new Error('Production deployment requires SITE_URL for canonical URLs and sitemap.')
  return { source, drafts: perspective === 'drafts' }
}

export async function loadPortfolio(env: Record<string, string | undefined>, development: boolean) {
  const { source, drafts } = contentSettings(env, development)
  if (source === 'sanity') return loadSanity(env, drafts)
  const reviewDrafts = development && env.VITE_REVIEW_DRAFTS === 'true'
  const demoMode = development && env.VITE_DEMO_MODE === 'true'
  const demos = demoMode ? await import('../src/data/demo.ts') : null
  return validatePortfolio({
    source, preview: development, demoMode, site, profile, indexCopy,
    projects: [...projectRecords.filter(item => item.status === 'published' || reviewDrafts && item.status === 'draft'), ...(demos?.demoProjects || [])],
    experiments: [...experimentRecords.filter(item => item.status === 'published' || reviewDrafts && item.status === 'draft'), ...(demos?.demoExperiments || []).map(item => ({ ...item, featured: true }))],
  })
}
