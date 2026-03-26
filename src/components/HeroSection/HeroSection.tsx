import styles from './HeroSection.module.css'

function handleScroll(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function HeroSection() {
  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>Hár & Förðun</h1>
        <p className={styles.subtitle}>FYRIR STÓRU STUNDIRNAR</p>
        <hr className={styles.divider} />
        <p className={styles.description}>
          Brúðargreiðsla • Brúðarförðun • Fermingargreiðsla • Förðun • Klipping • Litun
        </p>
        <div className={styles.buttons}>
          <a
            className={styles.btnPrimary}
            href="#umsagnir"
            onClick={(e) => {
              e.preventDefault()
              handleScroll('umsagnir')
            }}
          >
            FÁ TILBOÐ
          </a>
          <a
            className={styles.btnOutline}
            href="#myndir"
            onClick={(e) => {
              e.preventDefault()
              handleScroll('myndir')
            }}
          >
            SJÁ MYNDIR
          </a>
        </div>
      </div>
    </section>
  )
}
