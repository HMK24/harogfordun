import { Mail, Phone } from 'lucide-react'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer id="footer" className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.contact}>
          <a className={styles.contactItem} href="mailto:info@harogfordun.is">
            <Mail size={16} />
            info@harogfordun.is
          </a>
          <a className={styles.contactItem} href="tel:+354848-3732">
            <Phone size={16} />
            848-3732
          </a>
          <div className={styles.socialLinks}>
            <a
              className={styles.socialLink}
              href="https://www.instagram.com/harogfordun"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="ig-gradient" x1="0" y1="24" x2="24" y2="0">
                    <stop offset="0%" stopColor="#FD5" />
                    <stop offset="50%" stopColor="#FF543E" />
                    <stop offset="100%" stopColor="#C837AB" />
                  </linearGradient>
                </defs>
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig-gradient)" strokeWidth="2" />
                <circle cx="12" cy="12" r="5" stroke="url(#ig-gradient)" strokeWidth="2" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="url(#ig-gradient)" />
              </svg>
            </a>
            <a
              className={styles.socialLink}
              href="https://www.facebook.com/HarogFordun.is"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
          </div>
        </div>
        <p className={styles.copyright}>
          © 2026 harogfordun.is – Öll réttindi áskilin
        </p>
      </div>
    </footer>
  )
}
