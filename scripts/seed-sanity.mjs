import { createClient } from '@sanity/client'
import { loadEnv } from 'vite'
import { readFile } from 'node:fs/promises'
import { resolve, sep } from 'node:path'
import { projectRecords } from '../src/data/projects.ts'
import { experimentRecords } from '../src/data/experiments.ts'
import { site, indexCopy } from '../src/data/site.ts'
import { profile } from '../src/data/profile.ts'
import { sanityConfig } from '../content/sanity.ts'

const args = process.argv.slice(2)
if (args.some(arg => arg !== '--write')) throw new Error('Usage: npm run cms:seed [-- --write]')
const write = args.includes('--write')
const env = { ...loadEnv('development', process.cwd(), ''), ...process.env }
const documents = [
  { id: 'siteSettings', type: 'siteSettings', data: site },
  { id: 'profile', type: 'profile', data: profile },
  { id: 'home', type: 'home', data: indexCopy },
  ...projectRecords.filter(item => item.status !== 'demo').map(item => ({ id: `visual-${item.slug}`, type: 'visualProject', data: item })),
  ...experimentRecords.filter(item => item.status !== 'demo').map(item => ({ id: `code-${item.slug}`, type: 'codeProject', data: item })),
]
console.log(`Seed ${write ? 'WRITE' : 'DRY RUN'}: ${documents.length} draft documents; no demos, no publishing, no overwrites.`)
for (const item of documents) console.log(`  drafts.${item.id} (${item.type})`)
if (!write) {
  console.log('Nothing uploaded. After configuring an Editor token locally, run npm run cms:seed -- --write to upload.')
  process.exit(0)
}
if (!env.SANITY_WRITE_TOKEN) throw new Error('SANITY_WRITE_TOKEN is required for --write. Use a temporary Editor token.')
const client = createClient({ ...sanityConfig(env), token: env.SANITY_WRITE_TOKEN, perspective: 'raw' })
const publicRoot = resolve('public')
async function upload(path, kind) {
  if (!path.startsWith('/images/') && !path.startsWith('/documents/')) throw new Error('Seed accepts only project assets inside public/')
  const file = resolve(publicRoot, path.slice(1))
  if (!file.startsWith(publicRoot + sep)) throw new Error('Unsafe seed asset path')
  const asset = await client.assets.upload(kind, await readFile(file), { filename: path.split('/').at(-1) })
  return { _type: 'reference', _ref: asset._id }
}
async function media(image) {
  return { _type: 'portfolioImage', asset: await upload(image.src, 'image'), alt: image.alt, caption: image.caption, fit: image.fit || 'contain' }
}
function keys(value) {
  if (Array.isArray(value)) return value.map((item, i) => typeof item === 'object' && item ? { ...keys(item), _key: `item-${i}` } : item)
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined).map(([key, v]) => [key, keys(v)]))
  return value
}
for (const item of documents) {
  const [published, draft] = await client.getDocuments([item.id, `drafts.${item.id}`])
  if (published || draft) { console.log(`Skipped existing ${item.id}`); continue }
  const data = { ...item.data }
  if (item.type === 'siteSettings') {
    data.socialLinks = data.socialLinks.map(link => ({ ...link, _type: 'socialLink' }))
    if (data.resumePath) data.resume = { _type: 'file', asset: await upload(data.resumePath, 'file') }
    delete data.resumePath
  }
  if (item.type === 'profile') {
    data.areas = data.areas.map(area => ({ ...area, _type: 'area' }))
    data.approach = data.approach.map(step => ({ ...step, _type: 'step' }))
  }
  if (item.type === 'visualProject' || item.type === 'codeProject') {
    data.slug = { _type: 'slug', current: data.slug }
    data.cover = await media(data.cover || data.preview)
    data.gallery = await Promise.all((data.gallery || []).map(media))
    if (data.sections) data.sections = data.sections.map(section => ({ ...section, _type: 'section' }))
    data.featured ??= false
    data.order ??= 0
    delete data.preview
    delete data.status
  }
  await client.createIfNotExists({ ...keys(data), _id: `drafts.${item.id}`, _type: item.type, contentReviewed: false })
  console.log(`Created draft ${item.id}`)
}
