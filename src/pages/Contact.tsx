import { Link } from 'react-router'
import { site } from '../data/content'
import { EmailContact } from '../components/EmailContact'
import styles from './Pages.module.css'

export function Contact() {
  return <div className={`container ${styles.page}`}><p className="eyebrow muted">05 / Contact</p><h1 style={{ whiteSpace: 'pre-line' }}>{site.contactTitle}</h1><p className={styles.lead}>{site.contactIntro}</p>
    <section className={styles.editorial} style={{ marginTop: 64 }}><div><p className="eyebrow muted">01 / Get in touch</p><h2>Start a conversation.</h2></div><div>{site.email ? <EmailContact email={site.email} /> : <><h3>Contact details pending</h3><p>A verified email address has not been provided yet. Contact options will appear here once they are available.</p></>}{site.availability && <p>{site.availability}</p>}</div></section>
    {site.socialLinks.length > 0 && <section className={styles.editorial}><h2>Elsewhere</h2><div><p>{site.elsewhere}</p><div className={styles.links}>{site.socialLinks.map(link => <a className="text-link" key={link.url} href={link.url}>{link.label} ↗</a>)}</div></div></section>}
    <section className={styles.editorial}><h2>In the meantime.</h2><div><p>Explore the visual work, browse the code projects, or get to know the person behind GHNWORKS.</p><div className={styles.links}><Link className="text-link" to="/visual">Visual ↗</Link><Link className="text-link" to="/code">Code ↗</Link><Link className="text-link" to="/profile">Profile ↗</Link></div></div></section>
  </div>
}
