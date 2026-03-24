import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback, useEffect } from 'react'
import SectionHeading from '../SectionHeading/SectionHeading'
import styles from './GallerySection.module.css'

const images = [
  {
    src: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&h=800&fit=crop',
    fullSrc: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=1200&h=1600&fit=crop',
    alt: 'Falleg brúðar hárgreiðsla að aftan',
  },
  {
    src: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=800&fit=crop',
    fullSrc: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1200&h=1600&fit=crop',
    alt: 'Hárgreiðsla frá hlið',
  },
  {
    src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=800&fit=crop',
    fullSrc: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&h=1600&fit=crop',
    alt: 'Glæsileg förðun í nærmynd',
  },
  {
    src: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&h=800&fit=crop',
    fullSrc: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=1200&h=1600&fit=crop',
    alt: 'Faglegur hársnyrtir að störfum',
  },
]

export default function GallerySection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const close = useCallback(() => setLightboxIndex(null), [])
  const prev = useCallback(
    () => setLightboxIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null)),
    [],
  )
  const next = useCallback(
    () => setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : null)),
    [],
  )

  useEffect(() => {
    if (lightboxIndex === null) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [lightboxIndex, close, prev, next])

  return (
    <section id="myndir" className={styles.section}>
      <SectionHeading title="MYNDIR AF VERKUM OKKAR" />
      <motion.div
        className={styles.grid}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {images.map((img, index) => (
          <div
            key={img.src}
            className={styles.imageWrapper}
            onClick={() => setLightboxIndex(index)}
          >
            <img
              className={styles.image}
              src={img.src}
              alt={img.alt}
              width={600}
              height={800}
              loading="lazy"
            />
          </div>
        ))}
      </motion.div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
          >
            <button className={styles.closeBtn} onClick={close} aria-label="Loka">
              &times;
            </button>
            <button
              className={`${styles.navBtn} ${styles.navPrev}`}
              onClick={(e) => { e.stopPropagation(); prev() }}
              aria-label="Fyrri mynd"
            >
              &#8249;
            </button>
            <img
              className={styles.lightboxImage}
              src={images[lightboxIndex].fullSrc}
              alt={images[lightboxIndex].alt}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className={`${styles.navBtn} ${styles.navNext}`}
              onClick={(e) => { e.stopPropagation(); next() }}
              aria-label="Næsta mynd"
            >
              &#8250;
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
