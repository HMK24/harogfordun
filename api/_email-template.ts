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

const BRAND = {
  gold: '#c9a961',
  goldDark: '#9c7f3f',
  bg: '#faf8f4',
  text: '#2a2520',
  muted: '#6b6258',
  border: '#e8e0d0',
}

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

interface Row {
  label: string
  value: string
}

const buildRows = (p: SubmissionPayload): Row[] => {
  if (p.kind === 'review') {
    return [
      { label: 'Nafn', value: p.nafn ?? '' },
      { label: 'Viðburður', value: label(SERVICE_LABELS, p.umsognVidburdur) },
      { label: 'Verkefni', value: label(VERKEFNI_LABELS, p.umsognVerkefni) },
      { label: 'Einkunn', value: p.stjornur ? `${'★'.repeat(parseInt(p.stjornur, 10))}${'☆'.repeat(5 - parseInt(p.stjornur, 10))}  (${p.stjornur}/5)` : '' },
      { label: 'Umsögn', value: p.umsogn ?? '' },
    ].filter((r) => r.value)
  }

  return [
    { label: 'Þjónusta', value: label(SERVICE_LABELS, p.service) },
    { label: 'Verkefni', value: label(VERKEFNI_LABELS, p.verkefni) },
    { label: 'Nafn tengiliðs', value: p.nafn ?? '' },
    { label: 'Nafn fermingarbarns', value: p.nafnBarns ?? '' },
    { label: 'Nafn brúðar', value: p.nafnBrudar ?? '' },
    { label: 'Nafn brúðguma', value: p.nafnBrudguma ?? '' },
    { label: 'Netfang', value: p.netfang ?? '' },
    { label: 'Símanúmer', value: p.simi ?? '' },
    { label: 'Dagsetning prúfu', value: p.dagsetning ?? '' },
    { label: 'Dagsetning brúðkaups', value: p.dagsetningBrudkaups ?? '' },
    { label: 'Staðsetning', value: p.stadsetning ?? '' },
    { label: 'Póstnúmer', value: p.postnumer ?? '' },
    { label: 'Fjöldi viðskiptavina', value: p.fjoldi ?? '' },
    { label: 'Skilaboð', value: p.skilabod ?? '' },
  ].filter((r) => r.value)
}

export const buildSubject = (p: SubmissionPayload): string => {
  if (p.kind === 'review') {
    const stars = p.stjornur ? '★'.repeat(parseInt(p.stjornur, 10)) : ''
    return `Ný umsögn ${stars} — ${p.nafn ?? 'Óþekktur'}`
  }
  const svc = label(SERVICE_LABELS, p.service) || 'Fyrirspurn'
  return `Ný fyrirspurn — ${svc}${p.nafn ? ` — ${p.nafn}` : ''}`
}

export const buildHtml = (p: SubmissionPayload): string => {
  const rows = buildRows(p)
  const title = p.kind === 'review' ? 'Ný umsögn' : 'Ný fyrirspurn'
  const intro =
    p.kind === 'review'
      ? 'Ný umsögn barst í gegnum vefsíðuna.'
      : 'Ný fyrirspurn barst í gegnum vefsíðuna.'

  const rowsHtml = rows
    .map((r) => {
      const valueHtml = escapeHtml(r.value).replace(/\n/g, '<br>')
      return `
        <tr>
          <td style="padding:12px 16px;border-bottom:1px solid ${BRAND.border};font-size:13px;color:${BRAND.muted};text-transform:uppercase;letter-spacing:0.5px;font-weight:600;width:38%;vertical-align:top;">
            ${escapeHtml(r.label)}
          </td>
          <td style="padding:12px 16px;border-bottom:1px solid ${BRAND.border};font-size:15px;color:${BRAND.text};vertical-align:top;">
            ${valueHtml}
          </td>
        </tr>`
    })
    .join('')

  const replyHint =
    p.kind !== 'review' && p.netfang
      ? `<p style="margin:24px 0 0;font-size:13px;color:${BRAND.muted};text-align:center;">
           Smelltu á <strong>Reply</strong> í Gmail til að svara beint á ${escapeHtml(p.netfang)}.
         </p>`
      : ''

  return `<!DOCTYPE html>
<html lang="is">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
          <tr>
            <td style="background:${BRAND.text};padding:28px 32px;text-align:center;">
              <div style="color:${BRAND.gold};font-size:12px;letter-spacing:3px;text-transform:uppercase;margin-bottom:6px;">Hár &amp; Förðun</div>
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:500;letter-spacing:0.5px;">${escapeHtml(title)}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 8px;">
              <p style="margin:0 0 20px;font-size:15px;color:${BRAND.muted};line-height:1.5;">${escapeHtml(intro)}</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid ${BRAND.border};border-radius:6px;overflow:hidden;">
                ${rowsHtml}
              </table>
              ${replyHint}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;text-align:center;border-top:1px solid ${BRAND.border};">
              <p style="margin:0;font-size:12px;color:${BRAND.muted};letter-spacing:0.3px;">
                Sent sjálfvirkt frá <a href="https://harogfordun.is" style="color:${BRAND.goldDark};text-decoration:none;">harogfordun.is</a>
              </p>
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
  const rows = buildRows(p)
  const title = p.kind === 'review' ? 'Ný umsögn' : 'Ný fyrirspurn'
  const lines = [
    title,
    '='.repeat(title.length),
    '',
    ...rows.map((r) => `${r.label}:\n  ${r.value.replace(/\n/g, '\n  ')}`),
    '',
    '—',
    'Sent sjálfvirkt frá harogfordun.is',
  ]
  return lines.join('\n')
}
