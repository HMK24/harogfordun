import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './ServiceCard.module.css'

interface ServiceCardProps {
  title: string
  images: string[]
  imageAlt: string
  href: string
  index: number
}

export default function ServiceCard({ title, images, imageAlt, href, index }: ServiceCardProps) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [images.length])

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.15, ease: 'easeOut' }}
    >
      <div className={styles.headingArea}>
        <h3 className={styles.title}>{title}</h3>
      </div>
      <div className={styles.slider}>
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            className={styles.image}
            src={images[current]}
            alt={imageAlt}
            loading="lazy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        </AnimatePresence>
      </div>
      <div className={styles.linkArea}>
        <a className={styles.link} href={href}>
          Skoða nánar ›
        </a>
      </div>
    </motion.div>
  )
}
