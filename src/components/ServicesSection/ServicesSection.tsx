import ServiceCard from '../ServiceCard/ServiceCard'
import styles from './ServicesSection.module.css'

const services = [
  {
    title: 'BRÚÐKAUP',
    images: ['/images/services/Brúðkaup 1.avif', '/images/services/Brúðkaup2.avif'],
    imageAlt: 'Brúðargreiðsla og brúðarförðun – fagleg þjónusta á brúðkaupsdegi',
    href: '#umsagnir',
  },
  {
    title: 'VIÐBURÐIR',
    images: ['/images/services/Viðburðir 1.avif', '/images/services/Viðburðir2.avif'],
    imageAlt: 'Fermingargreiðsla, förðun og klipping fyrir viðburði',
    href: '#umsagnir',
  },
  {
    title: 'AUGLÝSINGAR',
    images: ['/images/services/Auglýsingar 1.avif', '/images/services/Auglýsingar2.avif'],
    imageAlt: 'Fagleg förðun, litun og klipping fyrir kvikmyndir og auglýsingar',
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
