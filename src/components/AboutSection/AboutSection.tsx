import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import SectionHeading from '../SectionHeading/SectionHeading'
import styles from './AboutSection.module.css'

function parseBold(text: string): ReactNode[] {
  return text.split(/\*\*(.*?)\*\*/).map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  )
}

const owners = [
  {
    name: 'Rebekka Sif Þráinsdóttir',
    role: 'Förðunarfræðingur',
    image: '/images/owners/RS - NB.avif',
    bio: 'Förðunarfræðingur með gráðu frá **Reykjavík Makeup School árið 2017** með **framúrskarandi árangri**.\nSíðan þá hef ég aflað mér víðtækrar reynslu í förðunarstörfum og sérhæfi mig í **brúðarförðun**, **förðun** fyrir viðburði og **litun** þar sem ég legg mikla áherslu á **gæði, nákvæmni og fagmennsku**.\n\nMarkmið mitt er að veita **persónulega og hlýja þjónustu** og huga sérstaklega að þörfum og óskum **hvers og eins**. Ég vil að allir viðskiptavinir gangi ánægðir frá borði og að útkoman endurspegli **þína einstöku fegurð**.',
    imageFirst: true,
  },
  {
    name: 'Ólöf Eir Brekkan',
    role: 'Hársnyrtir',
    image: '/images/owners/Ólöf Eir NB.avif',
    bio: 'Hárgreiðslukona með **6 ára reynslu í hársnyrti**. Ég hef haft mikinn áhuga á hári frá unga aldri og hef séð um hárgreiðslur á vinum og vandamönnum af fullri alvöru **frá því árið 2020** þar til ég lét að lokum drauminn rætast og útskrifaðist frá **Hárakademíunni vorið 2024** og lauk **sveinsprófi haustið sama ár**. Ég sérhæfi mig í **brúðargreiðslu**, **fermingargreiðslu**, **klippingu** og **litun**.\n\nÉg legg einstaka áherslu á **vandvirkni, gæði** og að veita **persónulega og hlýja þjónustu**. Fyrir mér snýst hárgreiðsla ekki bara um að gera hárið fallegt – heldur að láta hverjum og einum líða **vel og öruggum** með sitt hár og útlit.',
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

                loading="lazy"
              />
            </div>
            <div className={styles.text}>
              <h3 className={styles.name}>{owner.name}</h3>
              <p className={styles.role}>{owner.role}</p>
              <div className={styles.divider} />
              <div className={styles.bio}>
                {owner.bio.split('\n\n').map((paragraph, i) => (
                  <p key={i}>
                    {paragraph.split('\n').map((line, j, arr) => (
                      <span key={j}>{parseBold(line)}{j < arr.length - 1 && <br />}</span>
                    ))}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
