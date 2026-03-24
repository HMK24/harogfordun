import ServiceCard from '../ServiceCard/ServiceCard'
import styles from './ServicesSection.module.css'

const services = [
  {
    title: 'BRÚÐKAUP',
    imageSrc: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop',
    imageAlt: 'Brúður með fallegri hárgreiðslu og förðun á brúðkaupsdegi',
    href: '#umsagnir',
  },
  {
    title: 'VIÐBURÐIR',
    imageSrc: 'https://images.unsplash.com/photo-1529635612369-b5c8a3e5e07e?w=600&h=600&fit=crop',
    imageAlt: 'Konur á viðburði með faglega hárgreiðslu og förðun',
    href: '#umsagnir',
  },
  {
    title: 'KVIKMYNDIR & AUGLÝSINGAR',
    imageSrc: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=600&fit=crop',
    imageAlt: 'Fagleg förðun fyrir kvikmyndir og auglýsingar',
    href: '#umsagnir',
  },
]

export default function ServicesSection() {
  return (
    <section id="thjonusta" className={styles.section}>
      <div className={styles.grid}>
        {services.map((service, index) => (
          <ServiceCard key={service.title} {...service} index={index} />
        ))}
      </div>
    </section>
  )
}
