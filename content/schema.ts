import { z } from 'zod'

const text = z.string().trim().min(1)
const optionalText = text.nullish().transform(value => value ?? undefined)
const webUrl = z.url().refine(value => new URL(value).protocol === 'https:', 'Use an HTTPS URL')
const assetUrl = text.refine(value => /^\/(images|documents)\/[a-zA-Z0-9_./-]+$/.test(value) && !value.includes('..') || /^https:\/\/cdn\.sanity\.io\/(images|files)\//.test(value), 'Use a local asset or Sanity CDN URL')
export const mediaSchema = z.object({
  src: assetUrl, alt: text, width: z.number().int().positive(), height: z.number().int().positive(),
  caption: optionalText, fit: z.enum(['cover', 'contain']).default('contain'),
})
const common = {
  slug: text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), title: text, category: text, summary: text,
  status: z.enum(['demo', 'draft', 'published']), featured: z.boolean().default(false),
  order: z.number().int().default(0), tools: z.array(text).nullish().transform(value => value ?? []),
  gallery: z.array(mediaSchema).default([]),
}
export const projectSchema = z.object({
  ...common, cover: mediaSchema, role: optionalText, year: z.number().int().nullish().transform(value => value ?? undefined),
  collaborators: z.array(text).nullish().transform(value => value ?? []),
  sections: z.array(z.object({ heading: text, body: z.array(text).min(1) })).nullish().transform(value => value ?? []),
  liveUrl: webUrl.nullish().transform(value => value ?? undefined), sourceUrl: webUrl.nullish().transform(value => value ?? undefined),
})
export const experimentSchema = z.object({
  ...common, preview: mediaSchema, idea: optionalText, approach: optionalText, finding: optionalText,
  demoUrl: webUrl.nullish().transform(value => value ?? undefined), sourceUrl: webUrl.nullish().transform(value => value ?? undefined),
})
export const siteSchema = z.object({
  brand: z.literal('GHNWORKS'), displayName: text, shortBio: text, email: z.email().nullable(),
  socialLinks: z.array(z.object({ label: text, url: webUrl })), resumePath: assetUrl.nullable(), availability: text.nullable(),
  contactTitle: text, contactIntro: text, elsewhere: text,
})
export const profileSchema = z.object({
  photo: mediaSchema.nullish().transform(value => value ?? undefined),
  introduction: text, body: text, areas: z.array(z.object({ title: text, items: z.array(text) })),
  approach: z.array(z.object({ title: text, body: text })),
  education: z.object({ title: text, institution: text, description: text }).nullable(),
})
export const indexSchema = z.object({
  eyebrow: text, headline: text, introTitle: text, intro: text, areas: z.array(text), closing: text,
})
export const portfolioSchema = z.object({
  source: z.enum(['local', 'sanity']), preview: z.boolean(), demoMode: z.boolean(),
  site: siteSchema, profile: profileSchema, indexCopy: indexSchema,
  projects: z.array(projectSchema), experiments: z.array(experimentSchema),
})
export type Portfolio = z.infer<typeof portfolioSchema>

export function validatePortfolio(input: unknown): Portfolio {
  const data = portfolioSchema.parse(input)
  for (const list of [data.projects, data.experiments]) {
    if (new Set(list.map(item => item.slug)).size !== list.length) throw new Error('Duplicate content slug')
    list.sort((a, b) => a.order - b.order)
  }
  if (!data.preview && [...data.projects, ...data.experiments].some(item => item.status !== 'published')) {
    throw new Error('Unpublished content cannot enter a production snapshot')
  }
  return data
}
