import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import styles from './ThemeToggle.module.css'

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <button
      className={styles.toggle}
      onClick={() => setDark((d) => !d)}
      aria-label={dark ? 'Skipta yfir í ljóst' : 'Skipta yfir í dökkt'}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
