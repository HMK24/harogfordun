import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback, useEffect } from 'react'
import SectionHeading from '../SectionHeading/SectionHeading'
import styles from './GallerySection.module.css'

const images = [
  {
    src: '/images/portfolio/hair/10.JPG',
    fullSrc: '/images/portfolio/hair/10.JPG',
    alt: 'Falleg brúðar hárgreiðsla að aftan',
  },
  {
    src: '/images/portfolio/hair/2.JPG',
    fullSrc: '/images/portfolio/hair/2.JPG',
    alt: 'Hárgreiðsla frá hlið',
  },
  {
    src: '/images/portfolio/makeup/1A.avif',
    fullSrc: '/images/portfolio/makeup/1A.avif',
    alt: 'Glæsileg förðun í nærmynd',
  },
  {
    src: '/images/portfolio/makeup/2A.avif',
    fullSrc: '/images/portfolio/makeup/2A.avif',
    alt: 'Faglegur förðun eftir breytingu',
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
