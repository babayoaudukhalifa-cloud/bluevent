import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import html2canvas from 'html2canvas'
import { Search } from 'lucide-react'
import { OCCASIONS } from '../lib/constants'
import { initials, whatsappNumber } from '../lib/format'
import { occasionCopy, plainMessage } from '../lib/messages'
import { useApp } from '../context/AppContext'
import { supabase } from '../lib/supabase'
import MessageCard from '../components/MessageCard'
import OccasionIcon from '../components/OccasionIcon'

export default function Compose() {
  const { staff, settings, addSend } = useApp()
  const [params] = useSearchParams()
  const preStaff = params.get('staff') || ''
  const preOcc = params.get('occasion') || ''

  const [step, setStep] = useState(preStaff ? (preOcc ? 3 : 2) : 1)
  const [staffId, setStaffId] = useState(preStaff)
  const [occasion, setOccasion] = useState(preOcc || 'birthday')
  const [notes, setNotes] = useState('')
  const [q, setQ] = useState('')
  const [emailOn, setEmailOn] = useState(true)
  const [waOn, setWaOn] = useState(true)
  const [status, setStatus] = useState('')
  const [sending, setSending] = useState(false)

  const person = staff.find((s) => s.id === staffId)
  const occ = OCCASIONS.find((o) => o.value === occasion)
  const body = useMemo(
    () => occasionCopy(occasion, person, notes),
    [occasion, person, notes],
  )

  const visibleStaff = staff.filter((s) => {
    const hay = `${s.name} ${s.role}`.toLowerCase()
    return !q.trim() || hay.includes(q.trim().toLowerCase())
  })

  const send = async () => {
    if (!person || sending) return
    const channels = [
      emailOn ? 'email' : null,
      waOn ? 'whatsapp' : null,
    ].filter(Boolean)
    if (!channels.length) {
      setStatus('Choose Email, WhatsApp, or both.')
      return
    }

    setSending(true)
    const text = plainMessage({ body, settings })

    try {
      const node = document.getElementById('ceo-message-card')
      if (node) {
        const canvas = await html2canvas(node, { backgroundColor: '#0a1422', scale: 2, useCORS: true })
        const link = document.createElement('a')
        link.download = `Blumen-${person.name.replace(/\s+/g, '-')}-${occ?.label || 'card'}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
      }

      let emailed = false
      if (emailOn) {
        try {
          const { data } = supabase ? await supabase.auth.getSession() : { data: { session: null } }
          const token = data?.session?.access_token
          const res = await fetch('/.netlify/functions/send-staff-card', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              staff: person,
              settings,
              occasionLabel: occ?.label,
              body,
              channels,
            }),
          })
          const payload = await res.json().catch(() => ({}))
          emailed = Boolean(payload.ok)
          if (!emailed) {
            const subject = encodeURIComponent(`${occ?.label || 'Greeting'} from ${settings.ceoName} · Blumen Technologies`)
            const cc = settings.ccHr ? `&cc=${encodeURIComponent(settings.ccHr)}` : ''
            window.open(`mailto:${encodeURIComponent(person.email)}?subject=${subject}&body=${encodeURIComponent(text)}${cc}`)
          }
        } catch {
          const subject = encodeURIComponent(`${occ?.label || 'Greeting'} from ${settings.ceoName} · Blumen Technologies`)
          window.open(`mailto:${encodeURIComponent(person.email)}?subject=${subject}&body=${encodeURIComponent(text)}`)
        }
      }

      if (waOn) {
        const num = whatsappNumber(person.phone)
        window.open(`https://wa.me/${num}?text=${encodeURIComponent(text)}`, '_blank')
      }

      await addSend({ staffId: person.id, type: occasion, channels, body })
      setStatus(
        emailed
          ? 'Email sent with the Blumen logo and CEO photo, then the message. WhatsApp opened if selected.'
          : 'Card recorded. Logo + CEO photo PNG downloaded. Email/WhatsApp opened with the message.',
      )
    } catch (err) {
      setStatus(err.message || 'Could not send card')
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <p className="page-sub" style={{ marginTop: 0 }}>
        Send a personalized card from {settings.ceoName} to any team member. Every card starts with the Blumen logo and the CEO photo, then the message.
      </p>

      <div className="stepper">
        <div className={`step ${step === 1 ? 'on' : ''}`}>1. Select Staff</div>
        <div className={`step ${step === 2 ? 'on' : ''}`}>2. Choose Occasion</div>
        <div className={`step ${step === 3 ? 'on' : ''}`}>3. Preview & Send</div>
      </div>

      {step === 1 && (
        <section className="card">
          <h2 className="page-title" style={{ fontSize: '1.4rem' }}>Who would you like to send a card to?</h2>
          <div className="search-wrap" style={{ margin: '0.9rem 0' }}>
            <Search size={16} />
            <input className="search" placeholder="Search staff..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="staff-pick">
            {visibleStaff.map((s) => (
              <button key={s.id} className={`pick ${staffId === s.id ? 'on' : ''}`} onClick={() => setStaffId(s.id)}>
                <div className="avatar" style={{ background: s.color }}>{initials(s.name)}</div>
                <div>
                  <strong>{s.name}</strong>
                  <div className="meta">{s.role}</div>
                </div>
              </button>
            ))}
          </div>
          <div className="actions">
            <button className="btn-gold" disabled={!staffId} onClick={() => setStep(2)}>Continue</button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="card">
          <h2 className="page-title" style={{ fontSize: '1.4rem' }}>Choose occasion</h2>
          <div className="occ-grid" style={{ marginTop: '1rem' }}>
            {OCCASIONS.map((o) => (
              <button key={o.value} className={`occ ${occasion === o.value ? 'on' : ''}`} onClick={() => setOccasion(o.value)}>
                <OccasionIcon type={o.value} />
                {o.label}
              </button>
            ))}
          </div>
          <div className="field" style={{ marginTop: '1rem' }}>
            <label>Extra note (optional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add a personal line from the CEO..." />
          </div>
          <div className="actions">
            <button className="btn-ghost" onClick={() => setStep(1)}>Back</button>
            <button className="btn-gold" onClick={() => setStep(3)}>Preview card</button>
          </div>
        </section>
      )}

      {step === 3 && (
        <div className="grid-2">
          <MessageCard body={body} settings={settings} />
          <section className="card">
            <h2 className="page-title" style={{ fontSize: '1.4rem' }}>Send to {person?.name}</h2>
            <p className="meta">{occ?.label} · Card includes Blumen logo + CEO photo + message</p>
            <div className="toggle-row">
              <div>
                <strong>Email</strong>
                <div className="meta">{person?.email}</div>
              </div>
              <button type="button" className={`toggle ${emailOn ? 'on' : ''}`} onClick={() => setEmailOn((v) => !v)}>
                <span />
              </button>
            </div>
            <div className="toggle-row">
              <div>
                <strong>WhatsApp</strong>
                <div className="meta">{person?.phone}</div>
              </div>
              <button type="button" className={`toggle ${waOn ? 'on' : ''}`} onClick={() => setWaOn((v) => !v)}>
                <span />
              </button>
            </div>
            {status && <p className="ok" style={{ marginTop: '1rem' }}>{status}</p>}
            <div className="actions">
              <button className="btn-ghost" onClick={() => setStep(2)}>Back</button>
              <button className="btn-gold" onClick={send} disabled={sending}>
                {sending ? 'Sending…' : 'Send card'}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
