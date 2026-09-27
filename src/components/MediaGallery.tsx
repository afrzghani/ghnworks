import { useState } from 'react'
import type { Media } from '../types/content'
import styles from './MediaGallery.module.css'

export function MediaGallery({ cover, gallery = [], demo = false }: { cover: Media; gallery?: Media[]; demo?: boolean }) {
  const images = [cover, ...gallery]
  const [selected, setSelected] = useState(0)
  const media = images[selected] || cover
  const multiple = images.length > 1

  return <section className={styles.gallery} aria-label="Project image gallery">
    <figure className={styles.figure}>
      <div className={styles.frame}><img src={media.src} alt={media.alt} width={media.width} height={media.height} /></div>
      {(media.caption || demo) && <figcaption>{media.caption}{demo && <span>Demo / Artwork pending. Placeholder composition for layout review.</span>}</figcaption>}
    </figure>
    {multiple && <>
      <div className={styles.controls}>
        <button type="button" aria-label="Previous image" onClick={() => setSelected((selected - 1 + images.length) % images.length)}>← Previous</button>
        <span role="status" aria-live="polite">{selected + 1} / {images.length}</span>
        <button type="button" aria-label="Next image" onClick={() => setSelected((selected + 1) % images.length)}>Next →</button>
      </div>
      <div className={styles.thumbnails} aria-label="Choose an image">
        {images.map((image, index) => <button type="button" key={`${image.src}-${index}`} aria-label={`View image ${index + 1}: ${image.alt}`} aria-pressed={selected === index} onClick={() => setSelected(index)}>
          <img src={image.src} alt="" width={image.width} height={image.height} loading="lazy" />
        </button>)}
      </div>
    </>}
  </section>
}
