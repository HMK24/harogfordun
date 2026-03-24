import { motion } from 'framer-motion'
import styles from './ProcessStep.module.css'

interface ProcessStepProps {
  number: number
  text: string
  index: number
  isLast?: boolean
}

export default function ProcessStep({ number, text, index, isLast }: ProcessStepProps) {
  return (
    <motion.div
      className={`${styles.step} ${!isLast ? styles.withDivider : ''}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.3, ease: 'easeOut' }}
    >
      <div className={styles.circle}>
        <span className={styles.number}>{number}</span>
      </div>
      <p className={styles.text}>{text}</p>
      <div className={styles.underline} />
    </motion.div>
  )
}
