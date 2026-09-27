import { useState } from 'react'
import styles from '../pages/Pages.module.css'

export function EmailContact({ email }: { email: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  async function copy() {
    try { await navigator.clipboard.writeText(email); setStatus('copied') }
    catch { setStatus('failed') }
  }
  return <><a className={styles.email} href={`mailto:${email}`}>{email}</a><button className={styles.copy} onClick={copy}>{status === 'copied' ? 'Copied' : 'Copy Email'}</button><p className={styles.status} role="status">{status === 'copied' ? 'Email copied to clipboard.' : status === 'failed' ? 'Couldn’t copy. Select the email address above to copy it manually.' : ''}</p></>
}
