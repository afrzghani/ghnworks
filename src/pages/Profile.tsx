import { Link } from 'react-router'
import { profile } from '../data/content'
import { site } from '../data/content'
import styles from './Pages.module.css'

export function Profile() {
  return <div className={`container ${styles.page}`}><p className="eyebrow muted">04 / Profile</p><h1>Behind GHNWORKS</h1>
    <div className={styles.profileIntro}><div className={styles.profilePhoto}>{profile.photo ? <img src={profile.photo.src} alt={profile.photo.alt} width={profile.photo.width} height={profile.photo.height} /> : <><span className={styles.photoMark} aria-hidden="true">Gh.</span><span className={styles.photoLabel}>Profile photo placeholder</span></>}</div><div><h2>A visual mind.<br />A technical curiosity.</h2><p>{profile.introduction}</p><p>{profile.body}</p><div className={styles.links}><Link className="text-link" to="/visual">Explore Visual Work ↗</Link>{site.resumePath && <a className="text-link" href={site.resumePath} download>Download CV ↓</a>}</div></div></div>
    <section className={styles.editorial}><div><p className="eyebrow muted">01 / Interests</p><h2>Areas of focus</h2></div><div><p>Areas I explore through design, study, and making.</p>{profile.areas.map(group => <div className={styles.group} key={group.title}><h3>{group.title}</h3><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul></div>)}</div></section>
    <section className={styles.editorial}><div><p className="eyebrow muted">02 / Process</p><h2>How I approach things</h2></div><div>{profile.approach.map((step, i) => <div className={styles.group} key={step.title}><h3><span className="muted">0{i + 1} / </span>{step.title}</h3><p>{step.body}</p></div>)}</div></section>
    {profile.education && <section className={styles.editorial}><div><p className="eyebrow muted">03 / Education</p><h3>{profile.education.title}</h3><p>{profile.education.institution}</p><p>{profile.education.description}</p></div></section>}
    <Link className={styles.next} to="/contact"><h2>Have something in mind?</h2><span>Let’s Talk ↗</span></Link>
  </div>
}
