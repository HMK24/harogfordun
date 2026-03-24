import styles from './SectionHeading.module.css'

interface SectionHeadingProps {
  title: string
}

export default function SectionHeading({ title }: SectionHeadingProps) {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>{title}</h2>
    </div>
  )
}
