import { motion } from 'framer-motion'
import styles from './ServiceCard.module.css'

interface ServiceCardProps {
  title: string
  imageSrc: string
  imageAlt: string
  href: string
  index: number
}

export default function ServiceCard({ title, imageSrc, imageAlt, href, index }: ServiceCardProps) {
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
      <img
        className={styles.image}
        src={imageSrc}
        alt={imageAlt}
        width={600}
        height={600}
        loading="lazy"
      />
      <div className={styles.linkArea}>
        <a className={styles.link} href={href}>
          Skoða nánar ›
        </a>
      </div>
    </motion.div>
  )
}
