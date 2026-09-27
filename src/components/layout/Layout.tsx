import { useRef, useState } from 'react'
import { Link, NavLink } from 'react-router'
import { navigation } from '../../data/site'
import { site } from '../../data/content'
import styles from './Layout.module.css'

export function Header() {
  const [open, setOpen] = useState(false)
  const button = useRef<HTMLButtonElement>(null)
  function dismiss() { setOpen(false); button.current?.focus() }
  return <header className={`container ${styles.header}`} onKeyDown={event => {
    if (event.key === 'Escape' && open) { event.preventDefault(); dismiss() }
  }}>
    <Link to="/" className={styles.wordmark} aria-label="GHNWORKS home">GHNWORKS<span aria-hidden="true">↗</span></Link>
    <button ref={button} className={styles.menu} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'} <span aria-hidden="true">{open ? '−' : '+'}</span></button>
    <nav id="main-navigation" aria-label="Main navigation" className={`${styles.nav} ${open ? styles.open : ''}`}>
      {navigation.map(item => <NavLink key={item.path} to={item.path} end={item.path === '/'} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? styles.active : undefined}><span>{item.number}</span>{item.label}</NavLink>)}
    </nav>
  </header>
}

export function Footer() {
  return <footer className={`container ${styles.footer}`}>
    <Link to="/" className={styles.wordmark}>GHNWORKS<span aria-hidden="true">↗</span></Link>
    <p>Design meets curiosity.</p>
    <div><Link to="/contact">Contact <span aria-hidden="true">↗</span></Link><span className="muted">© {new Date().getFullYear()} {site.brand}</span></div>
  </footer>
}
