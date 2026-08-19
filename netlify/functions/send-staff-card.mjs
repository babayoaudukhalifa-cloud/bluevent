import nodemailer from 'nodemailer'
import { createClient } from '@supabase/supabase-js'

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
    const ceoName = settings.ceoName || 'Dr. Yunusa Garba Muhammed'
    const ceoTitle = settings.ceoTitle || 'Chief Executive Officer'

    if (!staff.email) {
      return new Response(JSON.stringify({ error: 'Staff email is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const site = process.env.URL || process.env.DEPLOY_PRIME_URL || 'http://localhost:5173'
    const logoBuf = await fetchBuffer(`${site}/blumen-logo.png`)
    const ceoBuf = await fetchBuffer(`${site}/ceo-yunusa.png`)

    const html = `
      <div style="margin:0;padding:24px;background:#070f1c;font-family:Georgia,serif;color:#f4f7fb;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#0d1b2a;border:1px solid #234;border-radius:18px;">
          <tr><td style="padding:28px;text-align:center;background:#000;">
            <img src="cid:blumen-logo" alt="Blumen Technologies" width="96" height="96" style="border-radius:20px;" />
          </td></tr>
          <tr><td style="padding:8px 28px 0;text-align:center;">
            <img src="cid:ceo-photo" alt="${ceoName}" width="148" height="148" style="border-radius:50%;border:3px solid #e4c15a;" />
            <p style="margin:12px 0 0;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#e4c15a;">From the office of the CEO</p>
            <h2 style="margin:6px 0 0;color:#fff;">${ceoName}</h2>
            <p style="margin:4px 0 0;color:#9bb4c8;font-size:13px;">${ceoTitle}</p>
          </td></tr>
          <tr><td style="padding:22px 32px;font-size:15px;line-height:1.7;color:#e8eef4;white-space:pre-wrap;">${String(message).replace(/</g, '&lt;')}</td></tr>
          <tr><td style="padding:8px 32px 28px;color:#c9d6e0;font-size:14px;line-height:1.6;">
            Warm regards,<br/><strong style="color:#fff;">${ceoName}</strong><br/>${ceoTitle}<br/>Blumen Technologies
          </td></tr>
        </table>
      </div>
    `

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return new Response(JSON.stringify({
        ok: false,
        queued: false,
        error: 'SMTP is not set on Netlify yet. Card was still recorded. Add SMTP_USER and SMTP_PASS to send email.',
      }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: staff.email,
      cc: settings.ccHr || undefined,
      replyTo: settings.replyTo || undefined,
      subject: `${occasionLabel} from ${ceoName} · Blumen Technologies`,
      text: message,
      html,
      attachments: [
        { filename: 'blumen-logo.png', content: logoBuf, cid: 'blumen-logo' },
        { filename: 'ceo-yunusa.png', content: ceoBuf, cid: 'ceo-photo' },
      ],
    })

    return new Response(JSON.stringify({ ok: true, to: staff.email }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || 'Could not send card' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
