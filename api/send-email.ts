import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'
import { buildHtml, buildSubject, buildText, type SubmissionPayload } from './_email-template.js'

const FROM = 'Hár & Förðun <noreply@harogfordun.is>'
const TO = 'info@harogfordun.is'

const isEmail = (v: unknown): v is string =>
  typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

const str = (v: unknown, max = 1000): string | undefined => {
  if (typeof v !== 'string') return undefined
  const trimmed = v.trim()
  if (!trimmed) return undefined
  return trimmed.slice(0, max)
}

const sanitize = (body: Record<string, unknown>): SubmissionPayload | null => {
  const kindRaw = body.kind
  if (kindRaw !== 'inquiry' && kindRaw !== 'review') return null

  const payload: SubmissionPayload = {
    kind: kindRaw,
    service: str(body.service, 40),
    verkefni: str(body.verkefni, 40),
    nafn: str(body.nafn, 200),
    nafnBarns: str(body.nafnBarns, 200),
    nafnBrudar: str(body.nafnBrudar, 200),
    nafnBrudguma: str(body.nafnBrudguma, 200),
    netfang: str(body.netfang, 320),
    simi: str(body.simi, 40),
    dagsetning: str(body.dagsetning, 40),
    dagsetningBrudkaups: str(body.dagsetningBrudkaups, 40),
    stadsetning: str(body.stadsetning, 200),
    postnumer: str(body.postnumer, 20),
    fjoldi: str(body.fjoldi, 10),
    skilabod: str(body.skilabod, 2000),
    umsognVidburdur: str(body.umsognVidburdur, 40),
    umsognVerkefni: str(body.umsognVerkefni, 40),
    stjornur: str(body.stjornur, 2),
    umsogn: str(body.umsogn, 2000),
  }

  if (!payload.nafn) return null
  if (payload.kind === 'inquiry' && !isEmail(payload.netfang)) return null
  if (payload.kind === 'review' && !payload.umsogn) return null

  return payload
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const body = typeof req.body === 'string' ? safeJson(req.body) : req.body
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Invalid body' })
  }

  // Honeypot — bots fill hidden fields, humans leave them empty.
  if (typeof (body as Record<string, unknown>).botcheck === 'string' && (body as Record<string, unknown>).botcheck) {
    return res.status(200).json({ success: true })
  }

  const payload = sanitize(body as Record<string, unknown>)
  if (!payload) return res.status(400).json({ error: 'Invalid or incomplete submission' })

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('RESEND_API_KEY not set')
    return res.status(500).json({ error: 'Server misconfigured' })
  }

  const resend = new Resend(apiKey)

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: payload.kind === 'inquiry' && payload.netfang ? payload.netfang : undefined,
      subject: buildSubject(payload),
      html: buildHtml(payload),
      text: buildText(payload),
    })

    if (error) {
      console.error('Resend error:', error)
      return res.status(502).json({ error: 'Email delivery failed' })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Unexpected send error:', err)
    return res.status(500).json({ error: 'Unexpected server error' })
  }
}

function safeJson(s: string): unknown {
  try {
    return JSON.parse(s)
  } catch {
    return null
  }
}
