import { Link } from 'react-router'
import { WorkCard } from '../components/WorkCard'
import { demoMode, experiments, projects } from '../data/collections'
import { indexCopy, site } from '../data/content'
import styles from './Index.module.css'

function Headline({ text }: { text: string }) {
  const lines = text.split('\n')
  return <>{lines.map((line, i) => <span key={i} style={{ color: i === lines.length - 1 ? undefined : 'inherit' }}>{i > 0 && <br />}{line}</span>)}</>
}
function SectionLabel({ number, children }: { number: string; children: string }) {
  return <p className={`eyebrow ${styles.label}`}><span>{number}</span> / {children}</p>
}
export function Index() {
  const featuredProjects = projects.filter(item => item.featured).slice(0, 5)
  const featuredCode = experiments.filter(item => item.featured).slice(0, 3)
  return <div className="container">
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroTop}><p className="eyebrow">{indexCopy.eyebrow}</p><span className={styles.edition}>Independent explorations<br />in design & technology</span></div>
      <h1 id="hero-title"><Headline text={indexCopy.headline} /></h1>
      <div className={styles.heroBottom}><div><p>{site.shortBio}</p><div className={styles.actions}><Link className="button" to="/visual">Explore Visual Work <span aria-hidden="true">↗</span></Link><Link className="text-link" to="/code">Explore Code <span aria-hidden="true">↗</span></Link></div></div><span className={styles.heroNote}>A practice in progress.<span aria-hidden="true">↓</span></span></div>
    </section>
    <section className={styles.section} aria-labelledby="works-title">
      <SectionLabel number="01">Visual / Design & identity</SectionLabel>
      <div className={styles.sectionHeading}><h2 id="works-title">Selected Visual Work</h2><Link className="text-link" to="/visual">View All Visual Work <span aria-hidden="true">↗</span></Link></div>
      {(demoMode || projects.some(item => item.status === 'draft')) && <p className={styles.demoNote}>Local portfolio preview. Draft case studies and demo placeholders are individually labeled.</p>}
      {featuredProjects.length ? <div className={styles.projectGrid}>{featuredProjects.map((item, i) => <WorkCard key={item.slug} title={item.title} demo={item.status === 'demo'} draft={item.status === 'draft'} category={item.category} media={item.cover} to={`/visual/${item.slug}`} number={`0${i + 1}`} />)}</div> : <p className={styles.empty}>Visual projects are being prepared. Reviewed work will appear here.</p>}
    </section>
    <section className={styles.section} aria-labelledby="code-title">
      <SectionLabel number="02">Code / Build & experiment</SectionLabel>
      <div className={styles.sectionHeading}><h2 id="code-title">Selected Code Projects</h2><Link className="text-link" to="/code">Explore Code <span aria-hidden="true">↗</span></Link></div>
      <p className={styles.demoNote}>Websites, applications, and coding experiments. From interface implementation to creative technology.{demoMode && ' Static demo concepts below; implementation pending.'}</p>
      {featuredCode.length ? <div className={styles.labGrid}>{featuredCode.map((item, i) => <WorkCard key={item.slug} title={item.title} demo={item.status === 'demo'} draft={item.status === 'draft'} category={item.category} media={item.preview} to={`/code/${item.slug}`} number={`0${i + 1}`} compact />)}</div> : <p className={styles.empty}>Code projects are being prepared. Working demos and source links will appear when available.</p>}
    </section>
    <section className={`${styles.section} ${styles.intro}`} aria-labelledby="intro-title">
      <div><SectionLabel number="03">A little about me</SectionLabel><h2 id="intro-title"><Headline text={indexCopy.introTitle} /></h2></div>
      <div className={styles.introBody}><p>{indexCopy.intro}</p><ul>{indexCopy.areas.map((area, i) => <li key={area}><span>0{i + 1}</span>{area}</li>)}</ul><Link className="text-link" to="/profile">More About Me <span aria-hidden="true">↗</span></Link></div>
    </section>
    <section className={styles.contact} aria-labelledby="contact-title"><SectionLabel number="04">Start a conversation</SectionLabel><div><h2 id="contact-title"><span style={{ whiteSpace: 'pre-line', color: 'inherit' }}>{indexCopy.closing.replace(/\?$/, '')}</span>{indexCopy.closing.endsWith('?') && <span>?</span>}</h2><Link to="/contact" className={styles.contactLink}>Let’s Talk <span aria-hidden="true">↗</span></Link></div><p>Design, digital projects, or a creative collaboration.</p></section>
  </div>
}
