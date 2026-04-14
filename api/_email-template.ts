// HTML + plain-text email template for form submissions.
// Edit freely — this file is the single source of truth for how the email looks in Gmail.

export interface SubmissionPayload {
  kind: 'inquiry' | 'review'
  service?: string
  verkefni?: string
  nafn?: string
  nafnBarns?: string
  nafnBrudar?: string
  nafnBrudguma?: string
  netfang?: string
  simi?: string
  dagsetning?: string
  dagsetningBrudkaups?: string
  stadsetning?: string
  postnumer?: string
  fjoldi?: string
  skilabod?: string
  umsognVidburdur?: string
  umsognVerkefni?: string
  stjornur?: string
  umsogn?: string
}

// Matches the website's design system (see src/styles/variables.css).
const BRAND = {
  gold: '#B48B4D',
  goldLight: '#D4A843',
  goldDark: '#996F09',
  cream: '#FDF8F0',
  creamDark: '#F5EDE0',
  ink: '#2C2C2C',
  inkSoft: '#3a342d',
  text: '#2C2C2C',
  muted: '#666666',
  mutedLight: '#999999',
  border: '#E8E0D0',
  white: '#FFFFFF',
}

const LOGO_URL = 'https://harogfordun.is/brand/logo-dark.png'
const SITE_URL = 'https://harogfordun.is'
const INFO_EMAIL = 'info@harogfordun.is'
const INFO_PHONE = '848-3732'

const SERVICE_LABELS: Record<string, string> = {
  ferming: 'Ferming',
  brudkaup: 'Brúðkaup',
  adrir: 'Aðrir viðburðir',
  annar: 'Annar viðburður',
}

const VERKEFNI_LABELS: Record<string, string> = {
  har: 'Hár',
  fordun: 'Förðun',
  har_fordun: 'Hár & förðun',
}

const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const label = (map: Record<string, string>, value: string | undefined): string =>
  value ? map[value] ?? value : ''

// Group fields into semantic sections so the email reads like a brief, not a dump.
interface Row {
  label: string
  value: string
}

interface Section {
  title: string
  rows: Row[]
}

const sectionFromRows = (title: string, rows: Row[]): Section | null => {
  const filtered = rows.filter((r) => r.value)
  return filtered.length ? { title, rows: filtered } : null
}

const buildSections = (p: SubmissionPayload): Section[] => {
  if (p.kind === 'review') {
    const stars = p.stjornur ? parseInt(p.stjornur, 10) : 0
    const starsDisplay = stars
      ? `${'★'.repeat(stars)}${'☆'.repeat(Math.max(0, 5 - stars))}  (${stars}/5)`
      : ''
    return [
      sectionFromRows('Umsagnaraðili', [
        { label: 'Nafn', value: p.nafn ?? '' },
        { label: 'Viðburður', value: label(SERVICE_LABELS, p.umsognVidburdur) },
        { label: 'Verkefni', value: label(VERKEFNI_LABELS, p.umsognVerkefni) },
      ]),
      sectionFromRows('Einkunn', [{ label: 'Stjörnur', value: starsDisplay }]),
      sectionFromRows('Umsögn', [{ label: 'Texti', value: p.umsogn ?? '' }]),
    ].filter((s): s is Section => s !== null)
  }

  return [
    sectionFromRows('Þjónusta', [
      { label: 'Viðburður', value: label(SERVICE_LABELS, p.service) },
      { label: 'Verkefni', value: label(VERKEFNI_LABELS, p.verkefni) },
      { label: 'Fjöldi viðskiptavina', value: p.fjoldi ?? '' },
    ]),
    sectionFromRows('Tengiliður', [
      { label: 'Nafn tengiliðs', value: p.nafn ?? '' },
      { label: 'Nafn fermingarbarns', value: p.nafnBarns ?? '' },
      { label: 'Nafn brúðar', value: p.nafnBrudar ?? '' },
      { label: 'Nafn brúðguma', value: p.nafnBrudguma ?? '' },
      { label: 'Netfang', value: p.netfang ?? '' },
      { label: 'Símanúmer', value: p.simi ?? '' },
    ]),
    sectionFromRows('Tímasetning & staðsetning', [
      { label: 'Dagsetning prúfu', value: p.dagsetning ?? '' },
      { label: 'Dagsetning brúðkaups', value: p.dagsetningBrudkaups ?? '' },
      { label: 'Staðsetning', value: p.stadsetning ?? '' },
      { label: 'Póstnúmer', value: p.postnumer ?? '' },
    ]),
    sectionFromRows('Sérstakar óskir', [{ label: 'Skilaboð', value: p.skilabod ?? '' }]),
  ].filter((s): s is Section => s !== null)
}

const sanitizeFromName = (s: string): string =>
  s.replace(/["<>\r\n]/g, '').trim().slice(0, 64)

export const buildFromName = (p: SubmissionPayload): string => {
  const name = p.nafn ? sanitizeFromName(p.nafn) : ''
  if (p.kind === 'review') {
    return name ? `${name} — Umsögn` : 'Umsögn'
  }
  const svc = label(SERVICE_LABELS, p.service)
  if (name && svc) return `${name} — ${svc}`
  if (name) return name
  if (svc) return svc
  return 'Ný fyrirspurn'
}

export const buildSubject = (p: SubmissionPayload): string => {
  if (p.kind === 'review') {
    const stars = p.stjornur ? '★'.repeat(parseInt(p.stjornur, 10)) : ''
    return `Ný umsögn ${stars} — ${p.nafn ?? 'Óþekktur'}`
  }
  const svc = label(SERVICE_LABELS, p.service) || 'Fyrirspurn'
  return `Ný fyrirspurn — ${svc}${p.nafn ? ` — ${p.nafn}` : ''}`
}

const serifStack = "'Playfair Display', Georgia, 'Times New Roman', serif"
const sansStack =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"

const renderSection = (section: Section): string => {
  const rowsHtml = section.rows
    .map((r, idx) => {
      const isLast = idx === section.rows.length - 1
      const valueHtml = escapeHtml(r.value).replace(/\n/g, '<br>')
      const borderStyle = isLast ? '' : `border-bottom:1px solid ${BRAND.border};`
      return `
        <tr>
          <td style="padding:14px 0;${borderStyle}font-family:${sansStack};font-size:11px;color:${BRAND.mutedLight};text-transform:uppercase;letter-spacing:1.5px;font-weight:600;width:42%;vertical-align:top;">
            ${escapeHtml(r.label)}
          </td>
          <td style="padding:14px 0;${borderStyle}font-family:${sansStack};font-size:15px;color:${BRAND.text};vertical-align:top;line-height:1.55;">
            ${valueHtml}
          </td>
        </tr>`
    })
    .join('')

  return `
    <tr>
      <td style="padding:28px 40px 8px;">
        <div style="font-family:${sansStack};font-size:11px;color:${BRAND.gold};text-transform:uppercase;letter-spacing:3px;font-weight:600;margin-bottom:6px;">
          ${escapeHtml(section.title)}
        </div>
        <div style="height:1px;background:linear-gradient(to right, ${BRAND.gold}, ${BRAND.border} 60%, transparent);margin-bottom:4px;"></div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          ${rowsHtml}
        </table>
      </td>
    </tr>`
}

export const buildHtml = (p: SubmissionPayload): string => {
  const sections = buildSections(p)
  const eyebrow = p.kind === 'review' ? 'Ný umsögn' : 'Ný fyrirspurn'
  const headline =
    p.kind === 'review'
      ? 'Einhver skildi eftir umsögn'
      : p.nafn
        ? `Frá ${escapeHtml(p.nafn)}`
        : 'Ný fyrirspurn á vefsíðunni'

  const sectionsHtml = sections.map(renderSection).join('')

  const replyCta =
    p.kind !== 'review' && p.netfang
      ? `
        <tr>
          <td style="padding:8px 40px 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding:20px;background:${BRAND.cream};border-radius:4px;border:1px solid ${BRAND.border};">
                  <div style="font-family:${sansStack};font-size:12px;color:${BRAND.muted};letter-spacing:0.5px;margin-bottom:10px;">
                    Svara beint með Reply í Gmail
                  </div>
                  <a href="mailto:${escapeHtml(p.netfang)}"
                     style="font-family:${sansStack};font-size:15px;color:${BRAND.goldDark};text-decoration:none;font-weight:600;letter-spacing:0.3px;">
                    ${escapeHtml(p.netfang)}
                  </a>
                  ${p.simi ? `
                    <div style="margin-top:6px;font-family:${sansStack};font-size:14px;color:${BRAND.muted};">
                      · ${escapeHtml(p.simi)}
                    </div>
                  ` : ''}
                </td>
              </tr>
            </table>
          </td>
        </tr>`
      : ''

  return `<!DOCTYPE html>
<html lang="is">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(eyebrow)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.cream};font-family:${sansStack};color:${BRAND.text};-webkit-font-smoothing:antialiased;">
  <!-- Preheader (hidden, shown in Gmail preview) -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    ${escapeHtml(eyebrow)} — ${escapeHtml(p.nafn ?? '')}${p.service ? ' · ' + escapeHtml(label(SERVICE_LABELS, p.service)) : ''}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.cream};padding:40px 16px;">
    <tr>
      <td align="center">

        <!-- Top brand wordmark (matches site navbar) -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin-bottom:20px;">
          <tr>
            <td align="center" style="padding:0 0 8px;">
              <a href="${SITE_URL}" style="font-family:${serifStack};font-style:italic;font-size:26px;color:${BRAND.gold};text-decoration:none;letter-spacing:0.5px;">
                harogfordun.is
              </a>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:0;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:40px;height:1px;background:${BRAND.gold};"></td>
                  <td style="width:8px;"></td>
                  <td style="font-family:${sansStack};font-size:10px;color:${BRAND.gold};letter-spacing:3px;text-transform:uppercase;">Ný skráning</td>
                  <td style="width:8px;"></td>
                  <td style="width:40px;height:1px;background:${BRAND.gold};"></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Main card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
               style="max-width:640px;background:${BRAND.white};border-radius:6px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.06);border:1px solid ${BRAND.border};">

          <!-- Dark header with logo + gold accent -->
          <tr>
            <td style="background:${BRAND.ink};padding:40px 32px 36px;text-align:center;position:relative;">
              <img src="${LOGO_URL}" alt="Hár & Förðun" width="140" style="display:block;margin:0 auto 18px;max-width:140px;height:auto;">
              <div style="height:1px;width:60px;background:${BRAND.gold};margin:0 auto 16px;"></div>
              <div style="font-family:${sansStack};font-size:11px;color:${BRAND.goldLight};letter-spacing:4px;text-transform:uppercase;font-weight:500;margin-bottom:10px;">
                ${escapeHtml(eyebrow)}
              </div>
              <h1 style="margin:0;font-family:${serifStack};font-size:28px;font-weight:400;color:${BRAND.white};letter-spacing:0.3px;line-height:1.3;">
                ${headline}
              </h1>
            </td>
          </tr>

          <!-- Faint watermark strip (decorative) -->
          <tr>
            <td style="height:4px;background:linear-gradient(to right, ${BRAND.gold}, ${BRAND.goldLight}, ${BRAND.gold});"></td>
          </tr>

          ${sectionsHtml}

          ${replyCta}

        </table>

        <!-- Footer (mirrors site footer) -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin-top:24px;">
          <tr>
            <td align="center" style="padding:20px 16px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:0 14px;font-family:${sansStack};font-size:13px;color:${BRAND.muted};">
                    <a href="mailto:${INFO_EMAIL}" style="color:${BRAND.muted};text-decoration:none;">✉ ${INFO_EMAIL}</a>
                  </td>
                  <td style="padding:0 14px;font-family:${sansStack};font-size:13px;color:${BRAND.muted};">
                    <a href="tel:${INFO_PHONE.replace(/\D/g, '')}" style="color:${BRAND.muted};text-decoration:none;">☎ ${INFO_PHONE}</a>
                  </td>
                </tr>
              </table>
              <div style="margin-top:16px;font-family:${sansStack};font-size:11px;color:${BRAND.mutedLight};letter-spacing:0.5px;">
                Sent sjálfvirkt frá
                <a href="${SITE_URL}" style="color:${BRAND.gold};text-decoration:none;">harogfordun.is</a>
              </div>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`
}

export const buildText = (p: SubmissionPayload): string => {
  const sections = buildSections(p)
  const title = p.kind === 'review' ? 'Ný umsögn' : 'Ný fyrirspurn'
  const lines: string[] = [title, '='.repeat(title.length), '']
  for (const s of sections) {
    lines.push(s.title.toUpperCase())
    lines.push('-'.repeat(s.title.length))
    for (const r of s.rows) {
      lines.push(`${r.label}:\n  ${r.value.replace(/\n/g, '\n  ')}`)
    }
    lines.push('')
  }
  lines.push('—')
  lines.push(`Sent sjálfvirkt frá ${SITE_URL}`)
  return lines.join('\n')
}
