import styles from './TestimonialCard.module.css'

interface TestimonialCardProps {
  quote: string
  author: string
}

export default function TestimonialCard({ quote, author }: TestimonialCardProps) {
  return (
    <div className={styles.card}>
      <span className={styles.quoteMark}>{'\u201C'}</span>
      <p className={styles.quote}>{quote}</p>
      <p className={styles.author}>&mdash; {author}</p>
    </div>
  )
}
