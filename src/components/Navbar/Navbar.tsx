import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './Navbar.module.css'

const navLinks = [
  { label: 'UM OKKUR', target: 'hero' },
  { label: 'ÞJÓNUSTA', target: 'thjonusta' },
  { label: 'MYNDIR', target: 'myndir' },
  { label: 'HAFÐU SAMBAND', target: 'umsagnir' },
]

function handleScroll(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleNavClick = (target: string) => {
    setMenuOpen(false)
    handleScroll(target)
  }

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Aðalvalmynd">
        <div className={styles.logoWrapper}>
          <span className={styles.logoLine} />
          <a
            className={styles.logo}
            href="#top"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            harogfordun.is
          </a>
          <span className={styles.logoLine} />
        </div>

        <div className={styles.desktopLinks}>
          {navLinks.map((link) => (
            <a
              key={link.target}
              className={styles.navLink}
              href={`#${link.target}`}
              onClick={(e) => {
                e.preventDefault()
                handleScroll(link.target)
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            className={styles.ctaButton}
            href="#umsagnir"
            onClick={(e) => {
              e.preventDefault()
              handleScroll('umsagnir')
            }}
          >
            FÁ TILBOÐ
          </a>
        </div>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(true)}
          aria-label="Opna valmynd"
        >
          <Menu size={24} />
        </button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className={styles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <button
                className={styles.closeButton}
                onClick={() => setMenuOpen(false)}
                aria-label="Loka valmynd"
              >
                <X size={28} />
              </button>

              <div className={styles.overlayLinks}>
                {navLinks.map((link) => (
                  <a
                    key={link.target}
                    className={styles.overlayLink}
                    href={`#${link.target}`}
                    onClick={(e) => {
                      e.preventDefault()
                      handleNavClick(link.target)
                    }}
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  className={styles.overlayCta}
                  href="#umsagnir"
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavClick('umsagnir')
                  }}
                >
                  FÁ TILBOÐ
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
