import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SectionHeading from '../SectionHeading/SectionHeading'
import TestimonialCard from '../TestimonialCard/TestimonialCard'
import ContactForm from '../ContactForm/ContactForm'
import styles from './TestimonialsSection.module.css'

const initialTestimonials = [
  {
    quote: '„Þær voru algjörlega frábærar! Ég var í skýjunum með förðunina og harið og brúðkaupsdagurinn var alveg einstakur."',
    author: 'Anna S.',
  },
  {
    quote: '„Algjörlega ótrúlegt lið! Þær komu á staðinn með allt sem þurfti og sáu um alla gesti okkar. Mæli eindregið með þeim."',
    author: 'Katrín H.',
  },
  {
    quote: '„Við fengjum þjónustuna fyrir kvikmyndartökur og þær voru ótrúlega fagmannlegar. Allt gekk hratt og snyrðilega."',
    author: 'Sigríður B.',
  },
]

const AUTO_SLIDE_MS = 6000

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState(initialTestimonials)
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1)
    setCurrent(index)
  }, [current])

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1)
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, AUTO_SLIDE_MS)
    return () => clearInterval(timer)
  }, [current, testimonials.length])

  const handleReview = useCallback((review: { quote: string; author: string }) => {
    setTestimonials((prev) => [...prev, review])
  }, [])

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  }

  return (
    <section id="umsagnir" className={styles.section}>
      <SectionHeading title="HEYRÐU Í OKKUR" />
      <div className={styles.grid}>
        <motion.div
          className={styles.testimonial}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className={styles.slider}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                <TestimonialCard
                  quote={testimonials[current].quote}
                  author={testimonials[current].author}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className={styles.dots}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === current ? styles.dotActive : ''}`}
                onClick={() => goTo(index)}
                aria-label={`Umsögn ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
        <motion.div
          className={styles.formArea}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <ContactForm onReview={handleReview} />
        </motion.div>
      </div>
    </section>
  )
}
