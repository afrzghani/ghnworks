import { spawn } from 'node:child_process'
import { loadEnv } from 'vite'
import { resolve } from 'node:path'
const env = { ...loadEnv('development', process.cwd(), ''), ...process.env }
for (const key of Object.keys(env)) {
  if (/^SANITY_STUDIO_.*(TOKEN|SECRET|PASSWORD)/i.test(key) && env[key]) throw new Error(`Remove public secret variable ${key}; Studio uses account login.`)
}
if (!env.SANITY_PROJECT_ID || !env.SANITY_DATASET) {
  console.error('Studio belum terhubung. Isi SANITY_PROJECT_ID dan SANITY_DATASET di .env.local. Petunjuk: CMS-SETUP.md')
  process.exit(1)
}
const command = process.argv[2] || 'dev'
if (!['dev', 'build', 'deploy'].includes(command)) throw new Error('Supported Studio commands: dev, build, deploy')
const child = spawn(process.execPath, [resolve('node_modules/@sanity/cli/bin/run.js'), command, ...(command === 'dev' ? ['--host', '127.0.0.1', '--port', '3333'] : [])], {
  cwd: resolve('studio'), stdio: 'inherit',
  env: { ...env, SANITY_STUDIO_PROJECT_ID: env.SANITY_PROJECT_ID, SANITY_STUDIO_DATASET: env.SANITY_DATASET },
})
child.on('exit', code => process.exit(code ?? 1))
