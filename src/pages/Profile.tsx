import { Link } from 'react-router'
import { usePortfolio } from '../data/PortfolioProvider'
import styles from './Pages.module.css'

export function Profile() {
  const { profile: currentProfile, site } = usePortfolio()

  return <div className={`container ${styles.page}`}><p className="eyebrow muted">04 / Profile</p><h1>Behind GHNWORKS</h1>
    <div className={styles.profileIntro}><div className={styles.profilePhoto}>{currentProfile.photo ? <img src={currentProfile.photo.src} alt={currentProfile.photo.alt} width={currentProfile.photo.width} height={currentProfile.photo.height} /> : <><span className={styles.photoMark} aria-hidden="true">Gh.</span><span className={styles.photoLabel}>Profile photo placeholder</span></>}</div><div><h2>A visual mind.<br />A technical curiosity.</h2><p>{currentProfile.introduction}</p><p>{currentProfile.body}</p><div className={styles.links}><Link className="text-link" to="/visual">Explore Visual Work ↗</Link>{site.resumePath && <a className="text-link" href={site.resumePath} download>Download CV ↓</a>}</div></div></div>
    <section className={styles.editorial}><div><p className="eyebrow muted">01 / Interests</p><h2>Areas of focus</h2></div><div><p>Areas I explore through design, study, and making.</p>{currentProfile.areas.map(group => <div className={styles.group} key={group.title}><h3>{group.title}</h3><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul></div>)}</div></section>
    <section className={styles.editorial}><div><p className="eyebrow muted">02 / Process</p><h2>How I approach things</h2></div><div>{currentProfile.approach.map((step, i) => <div className={styles.group} key={step.title}><h3><span className="muted">0{i + 1} / </span>{step.title}</h3><p>{step.body}</p></div>)}</div></section>
    {currentProfile.education && <section className={styles.editorial}><div><p className="eyebrow muted">03 / Education</p><h3>{currentProfile.education.title}</h3><p>{currentProfile.education.institution}</p><p>{currentProfile.education.description}</p></div></section>}
    <Link className={styles.next} to="/contact"><h2>Have something in mind?</h2><span>Let’s Talk ↗</span></Link>
  </div>
}
