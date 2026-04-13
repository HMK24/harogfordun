import { AnimatePresence, motion } from 'framer-motion'
import { useState, useCallback, useEffect, useRef } from 'react'
import SectionHeading from '../SectionHeading/SectionHeading'
import styles from './GallerySection.module.css'

const images = [
  { src: '/images/portfolio/hair/1.avif', alt: 'Hárgreiðsla 1' },
  { src: '/images/portfolio/hair/2.avif', alt: 'Hárgreiðsla 2' },
  { src: '/images/portfolio/hair/3.avif', alt: 'Hárgreiðsla 3' },
  { src: '/images/portfolio/hair/4.avif', alt: 'Hárgreiðsla 4' },
  { src: '/images/portfolio/hair/5.avif', alt: 'Hárgreiðsla 5' },
  { src: '/images/portfolio/hair/6.avif', alt: 'Hárgreiðsla 6' },
  { src: '/images/portfolio/hair/7.avif', alt: 'Hárgreiðsla 7' },
  { src: '/images/portfolio/hair/8.avif', alt: 'Hárgreiðsla 8' },
  { src: '/images/portfolio/hair/9.avif', alt: 'Hárgreiðsla 9' },
  { src: '/images/portfolio/hair/10.avif', alt: 'Hárgreiðsla 10' },
  { src: '/images/portfolio/makeup/1B.avif', alt: 'Förðun 1B' },
  { src: '/images/portfolio/makeup/1A.avif', alt: 'Förðun 1A' },
  { src: '/images/portfolio/makeup/2B.avif', alt: 'Förðun 2B' },
  { src: '/images/portfolio/makeup/2A.avif', alt: 'Förðun 2A' },
  { src: '/images/portfolio/makeup/3B.avif', alt: 'Förðun 3B' },
  { src: '/images/portfolio/makeup/3A.avif', alt: 'Förðun 3A' },
  { src: '/images/portfolio/makeup/4B.avif', alt: 'Förðun 4B' },
  { src: '/images/portfolio/makeup/4A.avif', alt: 'Förðun 4A' },
  { src: '/images/portfolio/makeup/5B.avif', alt: 'Förðun 5B' },
  { src: '/images/portfolio/makeup/5A.avif', alt: 'Förðun 5A' },
  { src: '/images/portfolio/makeup/6B.avif', alt: 'Förðun 6B' },
  { src: '/images/portfolio/makeup/6A.avif', alt: 'Förðun 6A' },
  { src: '/images/portfolio/makeup/7B.avif', alt: 'Förðun 7B' },
  { src: '/images/portfolio/makeup/7A.avif', alt: 'Förðun 7A' },
]

// Duplicate images for seamless looping
const scrollImages = [...images, ...images]

export default function GallerySection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [paused, setPaused] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

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
      <SectionHeading title="Portfolio" />

      <div
        className={styles.carousel}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          ref={trackRef}
          className={`${styles.track} ${paused ? styles.trackPaused : ''}`}
        >
          {scrollImages.map((img, i) => {
            const globalIndex = i % images.length
            return (
              <div
                key={`${img.src}-${i}`}
                className={styles.imageWrapper}
                onClick={() => setLightboxIndex(globalIndex)}
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
            )
          })}
        </div>
      </div>

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
              src={images[lightboxIndex].src}
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
