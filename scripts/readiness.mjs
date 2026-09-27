import { loadEnv } from 'vite'
import { access } from 'node:fs/promises'
const env = { ...loadEnv('development', process.cwd(), ''), ...process.env }
console.log(`Content source: ${env.CONTENT_SOURCE || 'local'}`)
console.log(`Sanity project/dataset: ${env.SANITY_PROJECT_ID && env.SANITY_DATASET ? 'configured (connection not tested)' : 'not configured; CMS-SETUP.md step 2'}`)
console.log(`Local draft preview token: ${env.SANITY_READ_TOKEN ? 'configured (value hidden)' : 'not configured'}`)
console.log(`Production origin: ${env.SITE_URL ? 'configured (ownership/connectivity not tested)' : 'not set; DEPLOYMENT.md'}`)
console.log(`Search indexing opt-out: ${env.SITE_NOINDEX === 'true' || !env.SITE_URL ? 'yes' : 'no (Vercel previews still noindex)'}`)
console.log(`Built website: ${await access('dist/index.html').then(() => 'present').catch(() => 'missing; run npm run build')}`)
console.log('This reports local configuration only. No account creation, upload, or deployment is performed.')
