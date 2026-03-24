import { motion } from 'framer-motion'
import SectionHeading from '../SectionHeading/SectionHeading'
import styles from './AboutSection.module.css'

const owners = [
  {
    name: 'Rebekka Sif Þráinsdóttir',
    role: 'Förðunarfræðingur',
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=500&h=600&fit=crop',
    bio: 'Rebekka hefur yfir 10 ára reynslu í förðun fyrir brúðkaup, viðburði og kvikmyndir. Hún útskrifaðist frá Listaháskóla Íslands og hefur unnið með nokkrum af þekktustu ljósmyndurum landsins.',
    imageFirst: true,
  },
  {
    name: 'Ólöf Eir Brekkan',
    role: 'Hársnyrtir',
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=500&h=600&fit=crop',
    bio: 'Ólöf er vanur hársnyrtir með sérþekkingu á brúðarhárgreiðslum og stílrænni hársnyrðingu fyrir viðburði. Hún leggur áherslu á að hver viðskiptavinur fái persónulega og einstaka þjónustu.',
    imageFirst: false,
  },
]

export default function AboutSection() {
  return (
    <section id="um-okkur" className={styles.section}>
      <SectionHeading title="UM OKKUR" />
      <div className={styles.container}>
        {owners.map((owner, index) => (
          <motion.div
            key={owner.name}
            className={`${styles.row} ${owner.imageFirst ? styles.imageLeft : styles.imageRight}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.15, ease: 'easeOut' }}
          >
            <div className={styles.imageWrapper}>
              <img
                className={styles.image}
                src={owner.image}
                alt={owner.name}
                width={500}
                height={600}
                loading="lazy"
              />
            </div>
            <div className={styles.text}>
              <h3 className={styles.name}>{owner.name}</h3>
              <p className={styles.role}>{owner.role}</p>
              <div className={styles.divider} />
              <p className={styles.bio}>{owner.bio}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
