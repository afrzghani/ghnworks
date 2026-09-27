// Local production preview mirroring clean static URLs and a real HTTP 404.
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
const root = resolve('dist')
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.pdf': 'application/pdf', '.txt': 'text/plain', '.xml': 'application/xml' }
createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://127.0.0.1')
    const path = decodeURIComponent(url.pathname)
    for (const [old, next] of [['/projects', '/visual'], ['/lab', '/code']]) {
      if (path === old || path.startsWith(old + '/')) { res.writeHead(308, { Location: next + path.slice(old.length) + url.search }); res.end(); return }
    }
    const target = resolve(root, '.' + path)
    if (target !== root && !target.startsWith(root + sep)) { res.writeHead(400); res.end(); return }
    const choices = path === '/' ? [resolve(root, 'index.html')] : [target, target + '.html']
    let file
    for (const candidate of choices) if ((await stat(candidate).catch(() => null))?.isFile()) { file = candidate; break }
    res.statusCode = file ? 200 : 404
    file ||= resolve(root, '404.html')
    res.setHeader('Content-Type', mime[extname(file)] || 'application/octet-stream')
    res.setHeader('Cache-Control', 'no-store')
    res.end(await readFile(file))
  } catch { res.writeHead(500); res.end('Build missing or request invalid. Run npm run build first.') }
}).listen(4173, '127.0.0.1', () => console.log('Production preview: http://127.0.0.1:4173'))
