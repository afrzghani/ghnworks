import { Link, useParams } from 'react-router'
import { projects, experiments } from '../data/collections'
import { MediaGallery } from '../components/MediaGallery'
import { NotFound } from './NotFound'
import { DemoNotice } from './Collections'
import styles from './Pages.module.css'

function Metadata({ values }: { values: [string, string | number | undefined][] }) {
  return <dl className={styles.metadata}>{values.filter(([, value]) => value !== undefined && value !== '').map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
}
function NextItem({ title, to, label }: { title: string; to: string; label: string }) {
  return <Link className={styles.next} to={to}><div><span className="eyebrow">{label}</span><h2>{title}</h2></div><span aria-hidden="true">↗</span></Link>
}
export function ProjectDetail() {
  const { slug } = useParams()
  const index = projects.findIndex(item => item.slug === slug)
  const project = projects[index]
  if (!project) return <NotFound />
  const next = projects.length > 1 ? projects[(index + 1) % projects.length] : null
  return <article className={`container ${styles.page}`}><Link className="text-link" to="/visual">← All Visual Work</Link><h1>{project.title}</h1><p className={styles.lead}>{project.summary}</p>{project.status === 'demo' && <DemoNotice />}
    {project.status === 'draft' && <aside className={styles.notice}><strong>Draft / Copy under review</strong>The artwork was supplied by the owner. The category and proposed narrative are provisional; role, process, and outcomes have not been verified. Local review only.</aside>}
    <Metadata values={[[ 'Category', project.category ], ['Role', project.role], ['Year', project.year], ['Tools', project.tools?.join(', ')], ['Collaborators', project.collaborators?.join(', ')]]} />
    <MediaGallery key={project.slug} cover={project.cover} gallery={project.gallery} demo={project.status === 'demo'} />
    <section className={styles.editorial}><h2>Overview</h2><div><p>{project.summary}</p>{project.status === 'demo' && <p>This preview demonstrates the page layout only. There is no verified client, role, project process, or outcome to report yet.</p>}</div></section>
    {project.sections?.filter(section => section.body.some(paragraph => paragraph.trim())).map(section => <section className={styles.editorial} key={section.heading}><h2>{section.heading}</h2><div>{section.body.filter(Boolean).map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div></section>)}
    <div className={styles.links}>{project.liveUrl && <a className="text-link" href={project.liveUrl}>View Live Project ↗</a>}{project.sourceUrl && <a className="text-link" href={project.sourceUrl}>View Source ↗</a>}</div>
    {next && <NextItem title={next.title} to={`/visual/${next.slug}`} label="Next visual project" />}
  </article>
}
export function LabDetail() {
  const { slug } = useParams()
  const index = experiments.findIndex(item => item.slug === slug)
  const experiment = experiments[index]
  if (!experiment) return <NotFound />
  const next = experiments.length > 1 ? experiments[(index + 1) % experiments.length] : null
  return <article className={`container ${styles.page}`}><Link className="text-link" to="/code">← All Code Projects</Link><h1>{experiment.title}</h1><p className={styles.lead}>{experiment.summary}</p>{experiment.status === 'demo' && <DemoNotice />}
    <Metadata values={[[ 'Category', experiment.category ], ['Preview', 'Static project image'], ['Tools', experiment.tools?.join(', ')]]} />
    <MediaGallery key={experiment.slug} cover={experiment.preview} gallery={experiment.gallery} demo={experiment.status === 'demo'} />
    <section className={styles.editorial}><h2>The idea</h2><div><p>{experiment.idea || experiment.summary}</p>{experiment.status === 'demo' && <p>This is a static placeholder, not an interactive demo or a completed experiment. The actual approach and findings are still pending.</p>}</div></section>
    {experiment.approach && <section className={styles.editorial}><h2>Implementation</h2><p>{experiment.approach}</p></section>}
    {experiment.finding && <section className={styles.editorial}><h2>What I learned</h2><p>{experiment.finding}</p></section>}
    <div className={styles.links}>{experiment.demoUrl && <a className="text-link" href={experiment.demoUrl}>Open Live Demo ↗</a>}{experiment.sourceUrl && <a className="text-link" href={experiment.sourceUrl}>View Source ↗</a>}</div>
    {next && <NextItem title={next.title} to={`/code/${next.slug}`} label="Next code project" />}
  </article>
}
