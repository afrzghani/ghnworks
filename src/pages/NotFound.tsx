import { Link } from 'react-router'
import styles from './Pages.module.css'

export function NotFound() {
  return <section className={`container ${styles.page}`}><p className="eyebrow muted">404 / Not found</p><h1>A little off-grid.</h1><p className={styles.lead}>This page doesn’t exist, or the work is not available yet.</p><div className={styles.links}><Link className="button" to="/">Back to Index <span aria-hidden="true">↗</span></Link><Link className="text-link" to="/visual">Browse Visual Work ↗</Link></div></section>
}
