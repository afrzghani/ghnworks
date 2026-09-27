// Original typography composed in HTML, captured as a social sharing PNG.
import { chromium } from '@playwright/test'
const browser = await chromium.launch({ channel: 'msedge', headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
  await page.setContent(`<html><style>*{box-sizing:border-box}body{margin:0;background:#0d0f12;color:#f4f5f7;font-family:Arial,sans-serif;padding:64px}header{display:flex;justify-content:space-between;font-size:22px;color:#a9b0bc}h1{font-size:118px;letter-spacing:-8px;font-weight:500;margin:115px 0 22px}p{font-size:30px;color:#8cb4ff;margin:0}footer{border-top:1px solid #343a46;margin-top:64px;padding-top:22px;font-size:18px;color:#a9b0bc}</style><header><span>PORTFOLIO / GHANI</span><span>DESIGN + CODE</span></header><h1>GHNWORKS<span style="color:#8cb4ff">↗</span></h1><p>A visual mind. A technical curiosity.</p><footer>VISUAL &nbsp; / &nbsp; CODE &nbsp; / &nbsp; PROFILE</footer></html>`)
  await page.screenshot({ path: 'public/og-default.png' })
} finally { await browser.close() }
