import { createClient } from '@sanity/client'
import { validatePortfolio } from './schema.ts'

const media = `{ "src": asset->url, alt, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, caption, "fit": coalesce(fit, "contain") }`
const shared = `title, "slug": slug.current, category, summary, "featured": coalesce(featured, false), "order": coalesce(order, 0), tools, "gallery": coalesce(gallery[]${media}, []), "status": select(_originalId in path("drafts.**") => "draft", "published"), contentReviewed`
export const query = `{
  "projects": *[_type == "visualProject"]{${shared}, "cover": cover${media}, role, year, collaborators, sections[]{heading, body}, liveUrl, sourceUrl},
  "experiments": *[_type == "codeProject"]{${shared}, "preview": cover${media}, idea, approach, finding, demoUrl, sourceUrl},
  "site": *[_id == "siteSettings"][0]{brand, displayName, shortBio, email, "socialLinks": coalesce(socialLinks[]{label, url}, []), "resumePath": resume.asset->url, availability, contactTitle, contactIntro, elsewhere, contentReviewed},
  "profile": *[_id == "profile"][0]{"photo": photo{ "src": asset->url, alt, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, "fit": "cover" }, introduction, body, "areas": coalesce(areas[]{title, items}, []), "approach": coalesce(approach[]{title, body}, []), education{title, institution, description}, contentReviewed},
  "indexCopy": *[_id == "home"][0]{eyebrow, headline, introTitle, intro, "areas": coalesce(areas, []), closing, contentReviewed}
}`

export function sanityConfig(env: Record<string, string | undefined>, needsToken = false) {
  const projectId = env.SANITY_PROJECT_ID
  const dataset = env.SANITY_DATASET
  if (!projectId || !/^[a-z0-9]+$/.test(projectId) || !dataset || !/^[a-z0-9_-]+$/.test(dataset)) {
    throw new Error('Set SANITY_PROJECT_ID and SANITY_DATASET in .env.local (see CMS-SETUP.md).')
  }
  if (needsToken && !env.SANITY_READ_TOKEN) throw new Error('Local draft preview requires SANITY_READ_TOKEN. Never prefix tokens with VITE_ or SANITY_STUDIO_.')
  return { projectId, dataset, apiVersion: '2025-02-19', useCdn: false, token: env.SANITY_READ_TOKEN, timeout: 20000, maxRetries: 2 }
}

export function normalizeSanity(raw: Record<string, unknown>, preview: boolean) {
  for (const key of ['site', 'profile', 'indexCopy']) {
    if (!raw[key]) throw new Error(`Sanity ${key} is missing. Seed and review the singleton documents before switching to CMS content.`)
  }
  const docs = [raw.site, raw.profile, raw.indexCopy, ...(raw.projects as unknown[] || []), ...(raw.experiments as unknown[] || [])]
  if (!preview && docs.some(doc => (doc as { contentReviewed?: boolean }).contentReviewed !== true)) {
    throw new Error('Published CMS content must have Content reviewed enabled. Review the document in Studio.')
  }
  return validatePortfolio({ ...raw, source: 'sanity', preview, demoMode: false })
}

export async function loadSanity(env: Record<string, string | undefined>, preview: boolean) {
  const client = createClient({ ...sanityConfig(env, preview), perspective: preview ? 'drafts' : 'published' })
  const raw = await client.fetch<Record<string, unknown>>(query)
  return normalizeSanity(raw, preview)
}
