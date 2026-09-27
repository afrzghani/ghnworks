import { Link, useSearchParams } from 'react-router'
import { projects, experiments, demoMode } from '../data/collections'
import { WorkCard } from '../components/WorkCard'
import styles from './Pages.module.css'

const categoryKey = (label: string) => label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/g, '')
export function DemoNotice() {
  return <aside className={styles.notice}><strong>Demo content / Artwork pending</strong>These are layout fixtures, not completed portfolio work. Real artwork and project information have not been supplied.</aside>
}
export function Projects() {
  const [params, setParams] = useSearchParams()
  const categories = [...new Set(projects.map(item => item.category))]
  const selected = categories.find(category => categoryKey(category) === params.get('category'))
  const shown = selected ? projects.filter(item => item.category === selected) : projects
  function select(category?: string) {
    const next = new URLSearchParams(params)
    if (category) next.set('category', categoryKey(category)); else next.delete('category')
    setParams(next, { preventScrollReset: true })
  }
  return <div className={`container ${styles.page}`}>
    <p className="eyebrow muted">02 / Visual</p><h1>Visual Projects</h1>
    <p className={styles.lead}>Graphic design, visual identities, posters, illustration, and UI/UX. Exploring how ideas take visual form.</p>
    {projects.some(item => item.status !== 'published') && <aside className={styles.notice}><strong>Local portfolio review</strong>Draft entries use supplied artwork with copy awaiting confirmation. Demo entries are layout placeholders. Each entry is labeled separately.</aside>}
    {projects.length > 0 && <div className={styles.filters} role="group" aria-label="Filter projects by category"><button aria-pressed={!selected} onClick={() => select()}>All</button>{categories.map(category => <button key={category} aria-pressed={selected === category} onClick={() => select(category)}>{category}</button>)}</div>}
    <p className={styles.count} role="status">{shown.length} {shown.length === 1 ? 'project' : 'projects'}{selected ? ` / ${selected}` : ''}</p>
    {shown.length ? <div className={styles.grid}>{shown.map((item, i) => <WorkCard key={item.slug} title={item.title} category={item.category} media={item.cover} to={`/visual/${item.slug}`} number={`0${i + 1}`} demo={item.status === 'demo'} draft={item.status === 'draft'} summary={item.summary} year={item.year} />)}</div> : <div className={styles.empty}><h2>Work is taking shape.</h2><p>{selected ? 'No projects in this category yet.' : 'Reviewed projects will appear here when the artwork and case studies are ready.'}</p>{params.has('category') && <button className={styles.copy} onClick={() => select()}>Reset Filters</button>}<div className={styles.links}><Link className="text-link" to="/code">Explore Code ↗</Link></div></div>}
  </div>
}
export function Lab() {
  return <div className={`container ${styles.page}`}><p className="eyebrow muted">03 / Code</p><h1>Code Projects</h1><p className={styles.lead}>Websites, applications, and coding experiments. A space for implementation, technical exploration, and learning by building.</p>{demoMode && <aside className={styles.notice}><strong>Demo concepts / Implementation pending</strong>These cards preview future code-project layouts. Their images are static placeholders; no working software, source code, or results are claimed.</aside>}
    {experiments.length ? <div className={styles.labGrid}>{experiments.map((item, i) => <WorkCard key={item.slug} title={item.title} category={item.category} media={item.preview} to={`/code/${item.slug}`} number={`0${i + 1}`} demo={item.status === 'demo'} draft={item.status === 'draft'} summary={item.summary} compact />)}</div> : <div className={styles.empty}><h2>Room to build.</h2><p>Reviewed code projects will appear here when they are ready to share.</p><Link className="text-link" to="/visual">Explore Visual Work ↗</Link></div>}
  </div>
}
