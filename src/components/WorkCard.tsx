import { Link } from 'react-router'
import type { Media } from '../types/content'
import styles from './WorkCard.module.css'

export function WorkCard({ title, category, media, to, number, compact = false, demo = false, draft = false, summary, year }: {
  title: string; category: string; media: Media; to: string; number: string; compact?: boolean; demo?: boolean; draft?: boolean; summary?: string; year?: number;
}) {
  const Heading = summary ? 'h2' : 'h3'
  return <Link to={to} className={`${styles.card} ${compact ? styles.compact : ''}`}>
    <div className={styles.media}><img src={media.src} alt={media.alt} width={media.width} height={media.height} loading="lazy" style={{ objectFit: media.fit }} />{(demo || draft) && <span className={styles.badge}>{draft ? 'Draft / Copy under review' : 'Demo / Artwork pending'}</span>}</div>
    <div className={styles.caption}><span className={styles.number}>{number}</span><div><Heading>{title}</Heading><p>{category}{year ? ` / ${year}` : ''}</p>{summary && <p>{summary}</p>}</div><span className={styles.arrow} aria-hidden="true">↗</span></div>
  </Link>
}
