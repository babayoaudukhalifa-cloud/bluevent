import nodemailer from 'nodemailer'
import { createClient } from '@supabase/supabase-js'
import { brandedEmailHtml, plainMessage } from '../../src/lib/messages.js'
import { whatsappNumber } from '../../src/lib/format.js'

const OFFICIAL_FROM = 'Blumen Technologies <office@blumentechnologies.com>'

async function callerIsSignedIn(token) {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key || !token) return false
  const client = createClient(url, key, { auth: { persistSession: false } })
  const { data, error } = await client.auth.getUser(token)
  return Boolean(!error && data?.user)
}

async function fetchBuffer(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Could not load ${url}`)
  return Buffer.from(await res.arrayBuffer())
}

function officialFrom() {
  const from = (process.env.SMTP_FROM || '').trim()
  if (from && !/resend\.dev/i.test(from)) return from
  return OFFICIAL_FROM
}

async function sendEmail({ from, to, cc, replyTo, subject, html, text, logoBuf, ceoBuf }) {
  const resendKey = (process.env.RESEND_API_KEY || '').trim()
  const smtpUser = (process.env.SMTP_USER || '').trim()
  const smtpPass = (process.env.SMTP_PASS || '').replace(/\s+/g, '')
  const smtpHost = (process.env.SMTP_HOST || '').trim()

  if (resendKey) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        cc: cc ? [cc] : undefined,
        reply_to: replyTo || undefined,
        subject,
        html,
        text,
        attachments: [
          { filename: 'blumen-logo.png', content: logoBuf.toString('base64'), content_id: 'blumen-logo' },
          { filename: 'ceo-yunusa.png', content: ceoBuf.toString('base64'), content_id: 'ceo-photo' },
        ],
      }),
    })
    const payload = await res.json().catch(() => ({}))
    const detail = payload.message || payload.error?.message || payload.error || ''
    if (!res.ok) {
      if (/resend\.dev|own email|testing emails|not verified/i.test(String(detail))) {
        throw new Error('Verify blumentechnologies.com in Resend, then set SMTP_FROM to Blumen Technologies <office@blumentechnologies.com>.')
      }
      throw new Error(String(detail) || 'Resend could not send the email.')
    }
    return
  }

  if (!smtpUser || !smtpPass) {
    const err = new Error('Add RESEND_API_KEY on Netlify, or SMTP_USER and SMTP_PASS.')
    err.code = 'SMTP_MISSING'
    throw err
  }

  const transporter = smtpHost
    ? nodemailer.createTransport({
      host: smtpHost,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: { user: smtpUser, pass: smtpPass },
    })
    : nodemailer.createTransport({
      service: 'gmail',
      auth: { user: smtpUser, pass: smtpPass },
    })

  await transporter.sendMail({
    from,
    to,
    cc: cc || undefined,
    replyTo: replyTo || undefined,
    subject,
    text,
    html,
    attachments: [
      { filename: 'blumen-logo.png', content: logoBuf, cid: 'blumen-logo' },
      { filename: 'ceo-yunusa.png', content: ceoBuf, cid: 'ceo-photo' },
    ],
  })
}

async function sendWhatsApp({ to, text, staffName, occasionLabel }) {
  const token = (process.env.WHATSAPP_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN || '').trim()
  const phoneId = (process.env.WHATSAPP_PHONE_NUMBER_ID || '').trim()
  const twilioSid = (process.env.TWILIO_ACCOUNT_SID || '').trim()
  const twilioToken = (process.env.TWILIO_AUTH_TOKEN || '').trim()
  const twilioFrom = (process.env.TWILIO_WHATSAPP_FROM || '').trim()
  const digits = whatsappNumber(to)

  if (!digits) {
    return { sent: false, error: 'No WhatsApp number on file.' }
  }

  if (token && phoneId) {
    const template = (process.env.WHATSAPP_TEMPLATE_NAME || '').trim()
    const payload = template
      ? {
        messaging_product: 'whatsapp',
        to: digits,
        type: 'template',
        template: {
          name: template,
          language: { code: process.env.WHATSAPP_TEMPLATE_LANG || 'en' },
          components: [{
            type: 'body',
            parameters: [
              { type: 'text', text: String(staffName || 'Team member').slice(0, 60) },
              { type: 'text', text: String(occasionLabel || 'Greeting').slice(0, 60) },
              { type: 'text', text: String(text || '').slice(0, 1000) },
            ],
          }],
        },
      }
      : {
        messaging_product: 'whatsapp',
        to: digits,
        type: 'text',
        text: { preview_url: false, body: String(text || '').slice(0, 4096) },
      }

    const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new Error(data.error?.message || 'WhatsApp Business could not send the message.')
    }
    return { sent: true }
  }

  if (twilioSid && twilioToken && twilioFrom) {
    const from = twilioFrom.startsWith('whatsapp:') ? twilioFrom : `whatsapp:${twilioFrom}`
    const body = new URLSearchParams({
      From: from,
      To: `whatsapp:+${digits}`,
      Body: String(text || '').slice(0, 1600),
    })
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new Error(data.message || 'Twilio could not send the WhatsApp message.')
    }
    return { sent: true }
  }

  return { sent: false, fallback: true }
}

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'POST only' }), { status: 405 })
  }

  try {
    const auth = req.headers.get('authorization') || ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
    const signedIn = await callerIsSignedIn(token)
    if (!signedIn && process.env.SUPABASE_URL) {
      return new Response(JSON.stringify({ error: 'Sign in to send a card.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const body = await req.json()
    const staff = body.staff || {}
    const settings = body.settings || {}
    const occasionLabel = body.occasionLabel || 'Greeting'
    const message = body.body || ''
    const channels = Array.isArray(body.channels) ? body.channels : ['email']
    const sendEmailChannel = channels.includes('email')
    const sendWaChannel = channels.includes('whatsapp')
    const ceoName = settings.ceoName || 'Dr. Yunusa Garba Muhammed'
    const from = officialFrom()
    const text = plainMessage({ body: message, settings })

    if (sendEmailChannel && !staff.email) {
      return new Response(JSON.stringify({ error: 'Staff email is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    if (sendWaChannel && !whatsappNumber(staff.phone)) {
      return new Response(JSON.stringify({ error: 'Staff WhatsApp number is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const result = {
      ok: true,
      from,
      email: { sent: false },
      whatsapp: { sent: false },
    }

    if (sendEmailChannel) {
      const site = process.env.URL || process.env.DEPLOY_PRIME_URL || 'http://localhost:5173'
      const logoBuf = await fetchBuffer(`${site}/blumen-logo.png`)
      const ceoBuf = await fetchBuffer(`${site}/ceo-yunusa.png`)
      const html = brandedEmailHtml({
        body: message,
        settings,
        logoSrc: 'cid:blumen-logo',
        photoSrc: 'cid:ceo-photo',
      })
      try {
        await sendEmail({
          from,
          to: staff.email,
          cc: settings.ccHr,
          replyTo: settings.replyTo || 'office@blumentechnologies.com',
          subject: `${occasionLabel} from ${ceoName} · Blumen Technologies`,
          html,
          text,
          logoBuf,
          ceoBuf,
        })
        result.email = { sent: true, from }
      } catch (err) {
        if (err.code === 'SMTP_MISSING') {
          result.email = { sent: false, fallback: true, error: err.message }
        } else {
          throw err
        }
      }
    }

    if (sendWaChannel) {
      try {
        result.whatsapp = await sendWhatsApp({
          to: staff.phone,
          text,
          staffName: staff.name,
          occasionLabel,
        })
      } catch (err) {
        result.whatsapp = { sent: false, fallback: true, error: err.message }
      }
    }

    result.ok = (result.email.sent || result.email.fallback || !sendEmailChannel)
      && (result.whatsapp.sent || result.whatsapp.fallback || !sendWaChannel)

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const msg = String(err.message || err)
    const friendly = /Invalid login|EAUTH|Username and Password not accepted/i.test(msg)
      ? 'Gmail rejected SMTP_USER / SMTP_PASS. Use the 16-character App Password, not the normal Gmail password, and match SMTP_USER to that same Gmail.'
      : (err.message || 'Could not send card')
    return new Response(JSON.stringify({ error: friendly }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
