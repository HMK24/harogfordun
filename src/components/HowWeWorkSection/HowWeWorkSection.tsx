import SectionHeading from '../SectionHeading/SectionHeading'
import ProcessStep from '../ProcessStep/ProcessStep'
import styles from './HowWeWorkSection.module.css'

const steps = [
  { number: 1, text: 'Sendu okkur dagsetningu og fjölda' },
  { number: 2, text: 'Við gerum tímaplan & tilboð' },
  { number: 3, text: 'Við komum á staðinn & sjáum um rest' },
]

export default function HowWeWorkSection() {
  return (
    <section id="svona-virkum-vid" className={styles.section}>
      <SectionHeading title="SVONA VIRKAR FERLIÐ" />
      <div className={styles.card}>
        <div className={styles.steps}>
          {steps.map((step, index) => (
            <ProcessStep key={step.number} {...step} index={index} isLast={index === steps.length - 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
