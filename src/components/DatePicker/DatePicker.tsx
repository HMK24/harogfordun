import { useState, useRef, useEffect } from 'react'
import styles from './DatePicker.module.css'

const MONTHS_IS = [
  'Janúar', 'Febrúar', 'Mars', 'Apríl', 'Maí', 'Júní',
  'Júlí', 'Ágúst', 'September', 'Október', 'Nóvember', 'Desember',
]
const WEEKDAYS_IS = ['Mán', 'Þri', 'Mið', 'Fim', 'Fös', 'Lau', 'Sun']

interface DatePickerProps {
  placeholder: string
  value: string
  onChange: (value: string) => void
  hasError?: boolean
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1 // Monday = 0
}

function formatDate(d: Date) {
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}.${mm}.${d.getFullYear()}`
}

export default function DatePicker({ placeholder, value, onChange, hasError }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const wrapperRef = useRef<HTMLDivElement>(null)

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth)

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  const selectDay = (day: number) => {
    const selected = new Date(viewYear, viewMonth, day)
    onChange(formatDate(selected))
    setOpen(false)
  }

  // Parse selected value to highlight
  const selectedDate = value
    ? (() => {
        const parts = value.split('.')
        if (parts.length === 3) {
          return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]))
        }
        return null
      })()
    : null

  useEffect(() => {
    if (!open) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [open])

  // Previous month trailing days
  const prevMonthDays = getDaysInMonth(
    viewMonth === 0 ? viewYear - 1 : viewYear,
    viewMonth === 0 ? 11 : viewMonth - 1
  )

  const cells: { day: number; current: boolean; disabled: boolean }[] = []
  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: prevMonthDays - firstDay + 1 + i, current: false, disabled: true })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true, disabled: false })
  }
  const remaining = 7 - (cells.length % 7)
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      cells.push({ day: i, current: false, disabled: true })
    }
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={`${styles.trigger} ${hasError ? styles.triggerError : ''} ${!value ? styles.placeholder : ''}`}
        onClick={() => setOpen(!open)}
      >
        {value || placeholder}
      </button>

      {open && (
        <>
          <div className={styles.overlay} onClick={() => setOpen(false)} />
          <div className={styles.calendar}>
            <div className={styles.header}>
              <button type="button" className={styles.navBtn} onClick={prevMonth}>
                &#8249;
              </button>
              <span className={styles.monthYear}>
                {MONTHS_IS[viewMonth]} {viewYear}
              </span>
              <button type="button" className={styles.navBtn} onClick={nextMonth}>
                &#8250;
              </button>
            </div>
            <div className={styles.weekdays}>
              {WEEKDAYS_IS.map((wd) => (
                <span key={wd} className={styles.weekday}>{wd}</span>
              ))}
            </div>
            <div className={styles.days}>
              {cells.map((cell, i) => {
                const isSelected =
                  cell.current &&
                  selectedDate &&
                  selectedDate.getDate() === cell.day &&
                  selectedDate.getMonth() === viewMonth &&
                  selectedDate.getFullYear() === viewYear

                return (
                  <button
                    key={i}
                    type="button"
                    className={`${styles.day} ${isSelected ? styles.daySelected : ''} ${!cell.current ? styles.dayOutside : ''} ${cell.disabled ? styles.dayDisabled : ''}`}
                    onClick={() => cell.current && selectDay(cell.day)}
                    tabIndex={cell.disabled ? -1 : 0}
                  >
                    {cell.day}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
