import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback, useEffect } from 'react'
import SectionHeading from '../SectionHeading/SectionHeading'
import styles from './GallerySection.module.css'

const images = [
  { src: '/images/portfolio/hair/1.JPG', alt: 'Hárgreiðsla 1' },
  { src: '/images/portfolio/hair/2.JPG', alt: 'Hárgreiðsla 2' },
  { src: '/images/portfolio/hair/3.JPG', alt: 'Hárgreiðsla 3' },
  { src: '/images/portfolio/hair/4.JPG', alt: 'Hárgreiðsla 4' },
  { src: '/images/portfolio/hair/5.JPG', alt: 'Hárgreiðsla 5' },
  { src: '/images/portfolio/hair/6.JPG', alt: 'Hárgreiðsla 6' },
  { src: '/images/portfolio/hair/7.JPG', alt: 'Hárgreiðsla 7' },
  { src: '/images/portfolio/hair/8.JPG', alt: 'Hárgreiðsla 8' },
  { src: '/images/portfolio/hair/9.JPG', alt: 'Hárgreiðsla 9' },
  { src: '/images/portfolio/hair/10.JPG', alt: 'Hárgreiðsla 10' },
  { src: '/images/portfolio/makeup/1A.avif', alt: 'Förðun 1A' },
  { src: '/images/portfolio/makeup/1B.avif', alt: 'Förðun 1B' },
  { src: '/images/portfolio/makeup/2A.avif', alt: 'Förðun 2A' },
  { src: '/images/portfolio/makeup/2B.avif', alt: 'Förðun 2B' },
  { src: '/images/portfolio/makeup/3A.avif', alt: 'Förðun 3A' },
  { src: '/images/portfolio/makeup/3B.avif', alt: 'Förðun 3B' },
  { src: '/images/portfolio/makeup/4A.avif', alt: 'Förðun 4A' },
  { src: '/images/portfolio/makeup/4B.avif', alt: 'Förðun 4B' },
  { src: '/images/portfolio/makeup/5A.avif', alt: 'Förðun 5A' },
  { src: '/images/portfolio/makeup/5B.avif', alt: 'Förðun 5B' },
  { src: '/images/portfolio/makeup/6A.avif', alt: 'Förðun 6A' },
  { src: '/images/portfolio/makeup/6B.avif', alt: 'Förðun 6B' },
  { src: '/images/portfolio/makeup/7A.avif', alt: 'Förðun 7A' },
  { src: '/images/portfolio/makeup/7B.avif', alt: 'Förðun 7B' },
]

const IMAGES_PER_SLIDE = 4

export default function GallerySection() {
  const [slideIndex, setSlideIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const totalSlides = Math.ceil(images.length / IMAGES_PER_SLIDE)

  const prevSlide = useCallback(() => {
    setSlideIndex((i) => (i - 1 + totalSlides) % totalSlides)
  }, [totalSlides])

  const nextSlide = useCallback(() => {
    setSlideIndex((i) => (i + 1) % totalSlides)
  }, [totalSlides])

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

  const currentImages = images.slice(
    slideIndex * IMAGES_PER_SLIDE,
    slideIndex * IMAGES_PER_SLIDE + IMAGES_PER_SLIDE,
  )

  return (
    <section id="myndir" className={styles.section}>
      <SectionHeading title="Portfolio" />

      <div className={styles.carousel}>
        <button
          className={`${styles.carouselBtn} ${styles.carouselPrev}`}
          onClick={prevSlide}
          aria-label="Fyrri myndir"
        >
          &#8249;
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={slideIndex}
            className={styles.grid}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {currentImages.map((img) => {
              const globalIndex = images.indexOf(img)
              return (
                <div
                  key={img.src}
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
          </motion.div>
        </AnimatePresence>

        <button
          className={`${styles.carouselBtn} ${styles.carouselNext}`}
          onClick={nextSlide}
          aria-label="Næstu myndir"
        >
          &#8250;
        </button>
      </div>

      <div className={styles.dots}>
        {Array.from({ length: totalSlides }, (_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === slideIndex ? styles.dotActive : ''}`}
            onClick={() => setSlideIndex(i)}
            aria-label={`Síða ${i + 1}`}
          />
        ))}
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
