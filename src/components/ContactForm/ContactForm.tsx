import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CheckCircle } from 'lucide-react'
import styles from './ContactForm.module.css'

interface FormData {
  nafn: string
  netfang: string
  dagsetning: string
  stadsetning: string
  fjoldi: string
  skilabod?: string
}

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()

  const onSubmit = (data: FormData) => {
    console.log(data)
    setSubmitted(true)
  }

  const handleReset = () => {
    reset()
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <div className={styles.success}>
        <CheckCircle size={48} color="#22C55E" />
        <p className={styles.successText}>
          Takk fyrir! Við höfum móttekið fyrirspurn þína og munum hafa samband við þig fljótlega.
        </p>
        <button className={styles.resetLink} onClick={handleReset} type="button">
          Senda aðra fyrirspurn
        </button>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={styles.field}>
        <input
          className={`${styles.input} ${errors.nafn ? styles.inputError : ''}`}
          placeholder="Nafn"
          {...register('nafn', { required: 'Vinsamlegast skráðu nafn', minLength: { value: 2, message: 'Vinsamlegast skráðu nafn' } })}
        />
        {errors.nafn && <span className={styles.error}>{errors.nafn.message}</span>}
      </div>
      <div className={styles.field}>
        <input
          className={`${styles.input} ${errors.netfang ? styles.inputError : ''}`}
          placeholder="Netfang"
          type="email"
          {...register('netfang', { required: 'Vinsamlegast skráðu gilt netfang', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Vinsamlegast skráðu gilt netfang' } })}
        />
        {errors.netfang && <span className={styles.error}>{errors.netfang.message}</span>}
      </div>
      <div className={styles.field}>
        <input
          className={`${styles.input} ${errors.dagsetning ? styles.inputError : ''}`}
          placeholder="Dagsetning"
          {...register('dagsetning', { required: 'Vinsamlegast veldu dagsetningu' })}
        />
        {errors.dagsetning && <span className={styles.error}>{errors.dagsetning.message}</span>}
      </div>
      <div className={styles.field}>
        <input
          className={`${styles.input} ${errors.stadsetning ? styles.inputError : ''}`}
          placeholder="Staðsetning"
          {...register('stadsetning', { required: 'Vinsamlegast skráðu staðsetningu', minLength: { value: 2, message: 'Vinsamlegast skráðu staðsetningu' } })}
        />
        {errors.stadsetning && <span className={styles.error}>{errors.stadsetning.message}</span>}
      </div>
      <div className={styles.field}>
        <input
          className={`${styles.input} ${errors.fjoldi ? styles.inputError : ''}`}
          placeholder="Fjöldi fólks"
          {...register('fjoldi', { required: 'Vinsamlegast skráðu fjölda' })}
        />
        {errors.fjoldi && <span className={styles.error}>{errors.fjoldi.message}</span>}
      </div>
      <div className={styles.field}>
        <textarea
          className={`${styles.textarea} ${errors.skilabod ? styles.inputError : ''}`}
          placeholder="Skilaboð"
          {...register('skilabod', { maxLength: { value: 500, message: 'Hámark 500 stafir' } })}
        />
        {errors.skilabod && <span className={styles.error}>{errors.skilabod.message}</span>}
      </div>
      <button className={styles.button} type="submit">SENDA FYRIRSPURN</button>
    </form>
  )
}
