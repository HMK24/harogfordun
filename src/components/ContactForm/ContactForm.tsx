import { useState, useRef, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { CheckCircle, AlertCircle } from 'lucide-react'
import DatePicker from '../DatePicker/DatePicker'
import styles from './ContactForm.module.css'

type ServiceType = '' | 'ferming' | 'brudkaup' | 'adrir' | 'umsogn'

interface FormData {
  thjonusta: ServiceType
  verkefni: string
  nafn: string
  nafnBarns: string
  nafnBrudar: string
  nafnBrudguma: string
  netfang: string
  simi: string
  dagsetning: string
  dagsetningBrudkaups: string
  stadsetning: string
  postnumer: string
  fjoldi: string
  skilabod: string
  umsognVidburdur: string
  umsognVerkefni: string
  stjornur: string
  umsogn: string
}

interface ContactFormProps {
  onReview?: (review: { quote: string; author: string; stars: number }) => void
}

// Icelandic street name autocomplete from static data
let streetsData: string[] | null = null

async function loadStreets(): Promise<string[]> {
  if (streetsData) return streetsData
  const mod = await import('../../data/streets.json')
  streetsData = mod.default as string[]
  return streetsData
}

function useAddressAutocomplete(inputValue: string) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [streets, setStreets] = useState<string[]>([])

  useEffect(() => {
    loadStreets().then(setStreets)
  }, [])

  useEffect(() => {
    if (!inputValue || inputValue.length < 2 || streets.length === 0) {
      setSuggestions([])
      return
    }
    const lower = inputValue.toLowerCase()
    const matches = streets
      .filter((s) => s.toLowerCase().startsWith(lower))
      .slice(0, 6)
    setSuggestions(matches)
  }, [inputValue, streets])

  return suggestions
}

interface StreetInputProps {
  className: string
  placeholder: string
  value: string
  onChange: (val: string) => void
  onBlur: () => void
  name: string
  hasError: boolean
}

function StreetInput({ className, placeholder, value, onChange, onBlur, name }: StreetInputProps) {
  const [focused, setFocused] = useState(false)
  const [inputVal, setInputVal] = useState(value)
  const suggestions = useAddressAutocomplete(inputVal)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleSelect = useCallback((street: string) => {
    setInputVal(street)
    onChange(street)
    setFocused(false)
  }, [onChange])

  return (
    <div className={styles.autocompleteWrapper} ref={wrapperRef}>
      <input
        className={className}
        placeholder={placeholder}
        name={name}
        value={inputVal}
        onChange={(e) => {
          setInputVal(e.target.value)
          onChange(e.target.value)
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setTimeout(() => setFocused(false), 150)
          onBlur()
        }}
        autoComplete="off"
      />
      {focused && suggestions.length > 0 && (
        <ul className={styles.suggestions}>
          {suggestions.map((s) => (
            <li key={s} className={styles.suggestion} onMouseDown={() => handleSelect(s)}>
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Shared Verkefni dropdown
function VerkefniSelect({ register, errors }: {
  register: FieldProps['register']
  errors: FieldProps['errors']
  hasPlaceholder?: boolean
}) {
  return (
    <div className={styles.field}>
      <select
        className={`${styles.select} ${errors.verkefni ? styles.inputError : ''}`}
        defaultValue=""
        {...register('verkefni', { required: 'Vinsamlegast veldu verkefni' })}
      >
        <option value="" disabled hidden>Verkefni</option>
        <option value="har">Hár</option>
        <option value="fordun">Förðun</option>
        <option value="har_fordun">Hár & förðun</option>
      </select>
      {errors.verkefni && <span className={styles.error}>{errors.verkefni.message}</span>}
    </div>
  )
}

export default function ContactForm({ onReview }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [service, setService] = useState<ServiceType>('')
  const [shakeButton, setShakeButton] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const errorBannerRef = useRef<HTMLDivElement>(null)
  const { register, handleSubmit, reset, formState: { errors }, setValue, trigger } = useForm<FormData>()

  const errorCount = Object.keys(errors).length
  const isReview = service === 'umsogn'

  useEffect(() => {
    if (errorCount > 0 && errorBannerRef.current) {
      errorBannerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [errorCount])

  const onInvalid = () => {
    setShakeButton(true)
    setTimeout(() => setShakeButton(false), 500)
  }

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    setSubmitError('')

    try {
      const payload = {
        kind: isReview ? 'review' : 'inquiry',
        service: data.thjonusta,
        verkefni: data.verkefni,
        nafn: data.nafn,
        nafnBarns: data.nafnBarns,
        nafnBrudar: data.nafnBrudar,
        nafnBrudguma: data.nafnBrudguma,
        netfang: data.netfang,
        simi: data.simi,
        dagsetning: data.dagsetning,
        dagsetningBrudkaups: data.dagsetningBrudkaups,
        stadsetning: data.stadsetning,
        postnumer: data.postnumer,
        fjoldi: data.fjoldi,
        skilabod: data.skilabod,
        umsognVidburdur: data.umsognVidburdur,
        umsognVerkefni: data.umsognVerkefni,
        stjornur: data.stjornur,
        umsogn: data.umsogn,
        botcheck: '',
      }

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json().catch(() => ({}))

      if (response.ok && result.success) {
        if (isReview && onReview) {
          const rating = parseInt(data.stjornur, 10)
          onReview({
            quote: `„${data.umsogn}"`,
            author: data.nafn,
            stars: rating,
          })
        }
        setSubmitted(true)
      } else {
        setSubmitError('Villa kom upp við sendingu. Vinsamlegast reyndu aftur.')
      }
    } catch {
      setSubmitError('Villa kom upp við sendingu. Vinsamlegast reyndu aftur.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    reset()
    setService('')
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <div className={styles.success}>
        <CheckCircle size={48} color="#22C55E" />
        <p className={styles.successText}>
          {isReview
            ? 'Takk fyrir umsögnina! Við kunnum vel að meta endurgjöf þína.'
            : 'Takk fyrir! Við höfum móttekið fyrirspurn þína og munum hafa samband við þig fljótlega.'}
        </p>
        <button className={styles.resetLink} onClick={handleReset} type="button">
          {isReview ? 'Senda aðra umsögn' : 'Senda aðra fyrirspurn'}
        </button>
      </div>
    )
  }

  return (
    <form className={styles.form} ref={formRef} onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
      <input type="checkbox" name="botcheck" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

      {errorCount > 0 && (
        <div className={styles.errorBanner} ref={errorBannerRef}>
          <AlertCircle size={18} />
          <span>Vinsamlegast lagfærðu {errorCount} {errorCount === 1 ? 'villu' : 'villur'} í forminu hér að neðan.</span>
        </div>
      )}
      <div className={styles.field}>
        <select
          className={`${styles.select} ${!service ? styles.selectPlaceholder : ''} ${errors.thjonusta ? styles.inputError : ''}`}
          defaultValue=""
          {...register('thjonusta', { required: 'Vinsamlegast veldu þjónustu' })}
          onChange={(e) => {
            const val = e.target.value as ServiceType
            setService(val)
            setValue('thjonusta', val)
          }}
        >
          <option value="" disabled hidden>Veldu viðburð</option>
          <option value="ferming">Ferming</option>
          <option value="brudkaup">Brúðkaup</option>
          <option value="adrir">Aðrir viðburðir</option>
          <option value="umsogn">Senda umsögn</option>
        </select>
        {errors.thjonusta && <span className={styles.error}>{errors.thjonusta.message}</span>}
      </div>

      {service === 'ferming' && <FermingFields register={register} errors={errors} setValue={setValue} trigger={trigger} />}
      {service === 'brudkaup' && <BrudkaupFields register={register} errors={errors} setValue={setValue} trigger={trigger} />}
      {service === 'adrir' && <AdrirFields register={register} errors={errors} setValue={setValue} trigger={trigger} />}
      {service === 'umsogn' && <UmsognFields register={register} errors={errors} />}

      {submitError && <p className={styles.submitError}>{submitError}</p>}

      {service && !isReview && (
        <button className={`${styles.button} ${shakeButton ? styles.buttonShake : ''}`} type="submit" disabled={submitting}>
          {submitting ? 'Sendi...' : 'SENDA FYRIRSPURN'}
        </button>
      )}
      {service && isReview && (
        <button className={`${styles.button} ${shakeButton ? styles.buttonShake : ''}`} type="submit" disabled={submitting}>
          {submitting ? 'Sendi...' : 'SENDA UMSÖGN'}
        </button>
      )}
    </form>
  )
}

// --- Sub-form components ---

type FieldProps = {
  register: ReturnType<typeof useForm<FormData>>['register']
  errors: ReturnType<typeof useForm<FormData>>['formState']['errors']
  setValue: ReturnType<typeof useForm<FormData>>['setValue']
  trigger: ReturnType<typeof useForm<FormData>>['trigger']
}

function FermingFields({ register, errors, setValue, trigger }: FieldProps) {
  const [dagsetning, setDagsetning] = useState('')
  const [stadsetning, setStadsetning] = useState('')

  register('dagsetning', { required: 'Vinsamlegast veldu dagsetningu' })
  register('stadsetning', { required: 'Vinsamlegast skráðu staðsetningu', minLength: { value: 2, message: 'Vinsamlegast skráðu staðsetningu' } })

  return (
    <>
      {/* Row 1: Verkefni (full width) + Nafn tengiliðs */}
      <div className={styles.row}>
        <VerkefniSelect register={register} errors={errors} />
        <div className={styles.field}>
          <input
            className={`${styles.input} ${errors.nafn ? styles.inputError : ''}`}
            placeholder="Nafn tengiliðs"
            {...register('nafn', { required: 'Vinsamlegast skráðu nafn', minLength: { value: 2, message: 'Vinsamlegast skráðu nafn' } })}
          />
          {errors.nafn && <span className={styles.error}>{errors.nafn.message}</span>}
        </div>
      </div>
      {/* Row 2: Nafn fermingarbarns + Netfang */}
      <div className={styles.row}>
        <div className={styles.field}>
          <input
            className={`${styles.input} ${errors.nafnBarns ? styles.inputError : ''}`}
            placeholder="Nafn fermingarbarns"
            {...register('nafnBarns')}
          />
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
      </div>
      {/* Row 3: Símanúmer + Dagsetning */}
      <div className={styles.row}>
        <div className={styles.field}>
          <input
            className={`${styles.input} ${errors.simi ? styles.inputError : ''}`}
            placeholder="Símanúmer"
            type="tel"
            {...register('simi', { required: 'Vinsamlegast skráðu símanúmer' })}
          />
          {errors.simi && <span className={styles.error}>{errors.simi.message}</span>}
        </div>
        <div className={styles.field}>
          <DatePicker
            placeholder="Dagsetning"
            value={dagsetning}
            onChange={(val) => {
              setDagsetning(val)
              setValue('dagsetning', val)
              trigger('dagsetning')
            }}
            hasError={!!errors.dagsetning}
          />
          {errors.dagsetning && <span className={styles.error}>{errors.dagsetning.message}</span>}
        </div>
      </div>
      {/* Row 4: Staðsetning + Póstnúmer */}
      <div className={styles.row}>
        <div className={styles.field}>
          <StreetInput
            className={`${styles.input} ${errors.stadsetning ? styles.inputError : ''}`}
            placeholder="Staðsetning"
            name="stadsetning"
            value={stadsetning}
            onChange={(val) => {
              setStadsetning(val)
              setValue('stadsetning', val)
              trigger('stadsetning')
            }}
            onBlur={() => trigger('stadsetning')}
            hasError={!!errors.stadsetning}
          />
          {errors.stadsetning && <span className={styles.error}>{errors.stadsetning.message}</span>}
        </div>
        <div className={styles.field}>
          <input
            className={`${styles.input} ${errors.postnumer ? styles.inputError : ''}`}
            placeholder="Póstnúmer"
            {...register('postnumer', { required: 'Vinsamlegast skráðu póstnúmer' })}
          />
          {errors.postnumer && <span className={styles.error}>{errors.postnumer.message}</span>}
        </div>
      </div>
      {/* Row 5: Skilaboð */}
      <div className={styles.field}>
        <textarea
          className={`${styles.textarea} ${errors.skilabod ? styles.inputError : ''}`}
          placeholder="Sérstakar óskir eða þarfir"
          {...register('skilabod', { maxLength: { value: 500, message: 'Hámark 500 stafir' } })}
        />
        {errors.skilabod && <span className={styles.error}>{errors.skilabod.message}</span>}
      </div>
    </>
  )
}

function BrudkaupFields({ register, errors, setValue, trigger }: FieldProps) {
  const [dagsetning, setDagsetning] = useState('')
  const [dagsetningBrudkaups, setDagsetningBrudkaups] = useState('')
  const [stadsetning, setStadsetning] = useState('')

  register('dagsetning', { required: 'Vinsamlegast veldu dagsetningu' })
  register('dagsetningBrudkaups', { required: 'Vinsamlegast veldu dagsetningu brúðkaups' })
  register('stadsetning', { required: 'Vinsamlegast skráðu staðsetningu', minLength: { value: 2, message: 'Vinsamlegast skráðu staðsetningu' } })

  return (
    <>
      {/* Row 1: Verkefni (full width) */}
      <VerkefniSelect register={register} errors={errors} />
      {/* Row 2: Nafn tengiliðs + Netfang */}
      <div className={styles.row}>
        <div className={styles.field}>
          <input
            className={`${styles.input} ${errors.nafn ? styles.inputError : ''}`}
            placeholder="Nafn tengiliðs"
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
      </div>
      {/* Row 3: Símanúmer + Nafn brúðar */}
      <div className={styles.row}>
        <div className={styles.field}>
          <input
            className={`${styles.input} ${errors.simi ? styles.inputError : ''}`}
            placeholder="Símanúmer"
            type="tel"
            {...register('simi', { required: 'Vinsamlegast skráðu símanúmer' })}
          />
          {errors.simi && <span className={styles.error}>{errors.simi.message}</span>}
        </div>
        <div className={styles.field}>
          <input
            className={`${styles.input}`}
            placeholder="Nafn brúðar"
            {...register('nafnBrudar')}
          />
        </div>
      </div>
      {/* Row 4: Nafn brúðguma + Staðsetning */}
      <div className={styles.row}>
        <div className={styles.field}>
          <input
            className={`${styles.input}`}
            placeholder="Nafn brúðguma"
            {...register('nafnBrudguma')}
          />
        </div>
        <div className={styles.field}>
          <StreetInput
            className={`${styles.input} ${errors.stadsetning ? styles.inputError : ''}`}
            placeholder="Staðsetning"
            name="stadsetning"
            value={stadsetning}
            onChange={(val) => {
              setStadsetning(val)
              setValue('stadsetning', val)
              trigger('stadsetning')
            }}
            onBlur={() => trigger('stadsetning')}
            hasError={!!errors.stadsetning}
          />
          {errors.stadsetning && <span className={styles.error}>{errors.stadsetning.message}</span>}
        </div>
      </div>
      {/* Row 5: Póstnúmer + Fjöldi einstaklinga */}
      <div className={styles.row}>
        <div className={styles.field}>
          <input
            className={`${styles.input} ${errors.postnumer ? styles.inputError : ''}`}
            placeholder="Póstnúmer"
            {...register('postnumer', { required: 'Vinsamlegast skráðu póstnúmer' })}
          />
          {errors.postnumer && <span className={styles.error}>{errors.postnumer.message}</span>}
        </div>
        <div className={styles.field}>
          <input
            className={`${styles.input} ${errors.fjoldi ? styles.inputError : ''}`}
            placeholder="Fjöldi einstaklinga"
            type="number"
            {...register('fjoldi', { required: 'Vinsamlegast skráðu fjölda' })}
          />
          {errors.fjoldi && <span className={styles.error}>{errors.fjoldi.message}</span>}
        </div>
      </div>
      {/* Row 6: Dagsetning prufu + Dagsetning brúðkaups */}
      <div className={styles.row}>
        <div className={styles.field}>
          <DatePicker
            placeholder="Dagsetning prufu"
            value={dagsetning}
            onChange={(val) => {
              setDagsetning(val)
              setValue('dagsetning', val)
              trigger('dagsetning')
            }}
            hasError={!!errors.dagsetning}
          />
          {errors.dagsetning && <span className={styles.error}>{errors.dagsetning.message}</span>}
        </div>
        <div className={styles.field}>
          <DatePicker
            placeholder="Dagsetning brúðkaups"
            value={dagsetningBrudkaups}
            onChange={(val) => {
              setDagsetningBrudkaups(val)
              setValue('dagsetningBrudkaups', val)
              trigger('dagsetningBrudkaups')
            }}
            hasError={!!errors.dagsetningBrudkaups}
          />
          {errors.dagsetningBrudkaups && <span className={styles.error}>{errors.dagsetningBrudkaups.message}</span>}
        </div>
      </div>
      {/* Row 7: Skilaboð */}
      <div className={styles.field}>
        <textarea
          className={`${styles.textarea} ${errors.skilabod ? styles.inputError : ''}`}
          placeholder="Sérstakar óskir eða þarfir"
          {...register('skilabod', { maxLength: { value: 500, message: 'Hámark 500 stafir' } })}
        />
        {errors.skilabod && <span className={styles.error}>{errors.skilabod.message}</span>}
      </div>
    </>
  )
}

function AdrirFields({ register, errors, setValue, trigger }: FieldProps) {
  const [dagsetning, setDagsetning] = useState('')
  const [stadsetning, setStadsetning] = useState('')

  register('dagsetning', { required: 'Vinsamlegast veldu dagsetningu' })
  register('stadsetning', { required: 'Vinsamlegast skráðu staðsetningu', minLength: { value: 2, message: 'Vinsamlegast skráðu staðsetningu' } })

  return (
    <>
      {/* Row 1: Verkefni (full width) */}
      <VerkefniSelect register={register} errors={errors} />
      {/* Row 2: Nafn tengiliðs + Netfang */}
      <div className={styles.row}>
        <div className={styles.field}>
          <input
            className={`${styles.input} ${errors.nafn ? styles.inputError : ''}`}
            placeholder="Nafn tengiliðs"
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
      </div>
      {/* Row 3: Símanúmer + Dagsetning */}
      <div className={styles.row}>
        <div className={styles.field}>
          <input
            className={`${styles.input} ${errors.simi ? styles.inputError : ''}`}
            placeholder="Símanúmer"
            type="tel"
            {...register('simi', { required: 'Vinsamlegast skráðu símanúmer' })}
          />
          {errors.simi && <span className={styles.error}>{errors.simi.message}</span>}
        </div>
        <div className={styles.field}>
          <DatePicker
            placeholder="Dagsetning"
            value={dagsetning}
            onChange={(val) => {
              setDagsetning(val)
              setValue('dagsetning', val)
              trigger('dagsetning')
            }}
            hasError={!!errors.dagsetning}
          />
          {errors.dagsetning && <span className={styles.error}>{errors.dagsetning.message}</span>}
        </div>
      </div>
      {/* Row 4: Staðsetning + Póstnúmer */}
      <div className={styles.row}>
        <div className={styles.field}>
          <StreetInput
            className={`${styles.input} ${errors.stadsetning ? styles.inputError : ''}`}
            placeholder="Staðsetning"
            name="stadsetning"
            value={stadsetning}
            onChange={(val) => {
              setStadsetning(val)
              setValue('stadsetning', val)
              trigger('stadsetning')
            }}
            onBlur={() => trigger('stadsetning')}
            hasError={!!errors.stadsetning}
          />
          {errors.stadsetning && <span className={styles.error}>{errors.stadsetning.message}</span>}
        </div>
        <div className={styles.field}>
          <input
            className={`${styles.input} ${errors.postnumer ? styles.inputError : ''}`}
            placeholder="Póstnúmer"
            {...register('postnumer', { required: 'Vinsamlegast skráðu póstnúmer' })}
          />
          {errors.postnumer && <span className={styles.error}>{errors.postnumer.message}</span>}
        </div>
      </div>
      {/* Row 5: Fjöldi einstaklinga (full width) */}
      <div className={styles.field}>
        <input
          className={`${styles.input} ${errors.fjoldi ? styles.inputError : ''}`}
          placeholder="Fjöldi einstaklinga"
          type="number"
          {...register('fjoldi', { required: 'Vinsamlegast skráðu fjölda' })}
        />
        {errors.fjoldi && <span className={styles.error}>{errors.fjoldi.message}</span>}
      </div>
      {/* Row 6: Skilaboð */}
      <div className={styles.field}>
        <textarea
          className={`${styles.textarea} ${errors.skilabod ? styles.inputError : ''}`}
          placeholder="Sérstakar óskir eða þarfir"
          {...register('skilabod', { maxLength: { value: 500, message: 'Hámark 500 stafir' } })}
        />
        {errors.skilabod && <span className={styles.error}>{errors.skilabod.message}</span>}
      </div>
    </>
  )
}

function UmsognFields({ register, errors }: Omit<FieldProps, 'setValue' | 'trigger'>) {
  return (
    <>
      {/* Row 1: Nafn */}
      <div className={styles.field}>
        <input
          className={`${styles.input} ${errors.nafn ? styles.inputError : ''}`}
          placeholder="Nafn"
          {...register('nafn', { required: 'Vinsamlegast skráðu nafn', minLength: { value: 2, message: 'Vinsamlegast skráðu nafn' } })}
        />
        {errors.nafn && <span className={styles.error}>{errors.nafn.message}</span>}
      </div>
      {/* Row 2: Viðburður */}
      <div className={styles.field}>
        <select
          className={`${styles.select} ${errors.umsognVidburdur ? styles.inputError : ''}`}
          defaultValue=""
          {...register('umsognVidburdur', { required: 'Vinsamlegast veldu viðburð' })}
        >
          <option value="" disabled hidden>Viðburður</option>
          <option value="ferming">Ferming</option>
          <option value="brudkaup">Brúðkaup</option>
          <option value="annar">Annar viðburður</option>
        </select>
        {errors.umsognVidburdur && <span className={styles.error}>{errors.umsognVidburdur.message}</span>}
      </div>
      {/* Row 3: Verkefni */}
      <div className={styles.field}>
        <select
          className={`${styles.select} ${errors.umsognVerkefni ? styles.inputError : ''}`}
          defaultValue=""
          {...register('umsognVerkefni', { required: 'Vinsamlegast veldu verkefni' })}
        >
          <option value="" disabled hidden>Verkefni</option>
          <option value="har">Hár</option>
          <option value="fordun">Förðun</option>
          <option value="har_fordun">Hár & förðun</option>
        </select>
        {errors.umsognVerkefni && <span className={styles.error}>{errors.umsognVerkefni.message}</span>}
      </div>
      {/* Row 4: Stigagjöf */}
      <div className={styles.field}>
        <select
          className={`${styles.select} ${errors.stjornur ? styles.inputError : ''}`}
          defaultValue=""
          {...register('stjornur', { required: 'Vinsamlegast veldu einkunn' })}
        >
          <option value="" disabled hidden>Stigagjöf</option>
          <option value="5">★★★★★ Framúrskarandi</option>
          <option value="4">★★★★ Mjög gott</option>
          <option value="3">★★★ Gott</option>
          <option value="2">★★ Sæmilegt</option>
          <option value="1">★ Lélegt</option>
        </select>
        {errors.stjornur && <span className={styles.error}>{errors.stjornur.message}</span>}
      </div>
      {/* Row 5: Umsögn */}
      <div className={styles.field}>
        <textarea
          className={`${styles.textarea} ${errors.umsogn ? styles.inputError : ''}`}
          placeholder="Umsögn"
          {...register('umsogn', { required: 'Vinsamlegast skrifaðu umsögn', maxLength: { value: 500, message: 'Hámark 500 stafir' } })}
        />
        {errors.umsogn && <span className={styles.error}>{errors.umsogn.message}</span>}
      </div>
    </>
  )
}
