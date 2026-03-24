import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer id="footer" className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.contact}>
          <span>Netfang: info@harogfordun.is</span>
          <span>Sími: 555-1234</span>
          <span>Instagram: @harogfordun.is</span>
        </div>
        <p className={styles.copyright}>
          © 2025 harogfordun.is – Öll réttindi áskilin
        </p>
      </div>
    </footer>
  )
}
