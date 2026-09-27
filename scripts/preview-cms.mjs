import { createServer } from 'vite'
process.env.CONTENT_SOURCE = 'sanity'
process.env.CONTENT_PERSPECTIVE = 'drafts'
const server = await createServer({ server: { host: '127.0.0.1', port: 5174, strictPort: true } })
await server.listen()
server.printUrls()
