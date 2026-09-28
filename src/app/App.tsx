import { useEffect, useMemo, useRef } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router'
import { Header, Footer } from '../components/layout/Layout'
import { Index } from '../pages/Index'
import { NotFound } from '../pages/NotFound'
import { Projects, Lab } from '../pages/Collections'
import { ProjectDetail, LabDetail } from '../pages/Details'
import { Profile } from '../pages/Profile'
import { Contact } from '../pages/Contact'
import { cmsPreview, noindex, origin } from '../data/content'
import { usePortfolio } from '../data/PortfolioProvider'
import { pageMetadata } from '../../content/seo'

function LegacyRoute({ from, to }: { from: string; to: string }) {
  const location = useLocation()
  return <Navigate replace to={`${to}${location.pathname.slice(from.length)}${location.search}${location.hash}`} />
}

export function App() {
  const portfolio = usePortfolio()
  const metadata = useMemo(() => pageMetadata(portfolio), [portfolio])
  const location = useLocation()
  const navigationType = useNavigationType()
  const previousPath = useRef(location.pathname)
  const positions = useRef(new Map<string, number>())
  useEffect(() => {
    const path = location.pathname.replace(/\/$/, '') || '/'
    const meta = metadata[path] || metadata['/404']
    document.title = meta.title
    const setMeta = (selector: string, content: string) => {
      let element = document.querySelector(selector)
      const attribute = selector.match(/^meta\[(name|property)="([^"]+)"\]$/)
      if (!element && attribute) {
        element = document.createElement('meta')
        element.setAttribute(attribute[1], attribute[2])
        document.head.append(element)
      }
      element?.setAttribute('content', content)
    }
    setMeta('meta[name="description"]', meta.description)
    setMeta('meta[name="robots"]', noindex || !meta.indexable ? 'noindex, nofollow' : 'index, follow')
    for (const prefix of ['og', 'twitter']) {
      const attr = prefix === 'og' ? 'property' : 'name'
      setMeta(`meta[${attr}="${prefix}:title"]`, meta.title)
      setMeta(`meta[${attr}="${prefix}:description"]`, meta.description)
      setMeta(`meta[${attr}="${prefix}:image"]`, meta.image.startsWith('https:') ? meta.image : origin + meta.image)
    }
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (origin && meta.indexable) {
      if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical) }
      canonical.href = origin + path
      setMeta('meta[property="og:url"]', origin + path)
    } else { canonical?.remove(); document.querySelector('meta[property="og:url"]')?.remove() }
    const changedPage = previousPath.current !== location.pathname
    if (changedPage) document.getElementById('main-content')?.focus({ preventScroll: true })
    previousPath.current = location.pathname
    const frame = requestAnimationFrame(() => {
      if (navigationType === 'POP') window.scrollTo(0, positions.current.get(location.key) ?? 0)
      else if (changedPage) window.scrollTo(0, 0)
    })
    const savedPositions = positions.current
    const savePosition = () => savedPositions.set(location.key, window.scrollY)
    window.addEventListener('scroll', savePosition, { passive: true })
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', savePosition) }
  }, [location.key, location.pathname, navigationType, metadata])
  return <>{cmsPreview && <aside className="cms-preview" role="status">Local CMS draft preview - unpublished changes. Refresh after saving in Studio.</aside>}<a className="skip-link" href="#main-content">Skip to content</a><Header key={location.pathname} /><main id="main-content" tabIndex={-1}><Routes><Route path="/" element={<Index />} /><Route path="/visual" element={<Projects />} /><Route path="/code" element={<Lab />} /><Route path="/profile" element={<Profile />} /><Route path="/contact" element={<Contact />} /><Route path="/visual/:slug" element={<ProjectDetail />} /><Route path="/code/:slug" element={<LabDetail />} /><Route path="/projects/*" element={<LegacyRoute from="/projects" to="/visual" />} /><Route path="/lab/*" element={<LegacyRoute from="/lab" to="/code" />} /><Route path="*" element={<NotFound />} /></Routes></main><Footer /></>
}
