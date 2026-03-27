import styles from './TestimonialCard.module.css'

interface TestimonialCardProps {
  quote: string
  author: string
  stars?: number
}

export default function TestimonialCard({ quote, author, stars }: TestimonialCardProps) {
  return (
    <div className={styles.card}>
      <span className={styles.quoteMark}>{'\u201C'}</span>
      {stars && (
        <div className={styles.stars}>
          {Array.from({ length: stars }, (_, i) => (
            <span key={i} className={styles.star}>★</span>
          ))}
        </div>
      )}
      <p className={styles.quote}>{quote}</p>
      <p className={styles.author}>&mdash; {author}</p>
    </div>
  )
}
