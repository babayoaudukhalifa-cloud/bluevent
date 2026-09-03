import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import html2canvas from 'html2canvas'
import { Plus, Search } from 'lucide-react'
import { displayPhone, initials, whatsappNumber } from '../lib/format'
import { occasionCopy, plainMessage } from '../lib/messages'
import { allOccasions, findOccasion } from '../lib/occasions'
import { useApp } from '../context/AppContext'
import { supabase } from '../lib/supabase'
import AddOccasionModal from '../components/AddOccasionModal'
import MessageCard from '../components/MessageCard'
import OccasionIcon from '../components/OccasionIcon'

export default function Compose() {
  const { staff, settings, addSend, addOccasionType } = useApp()
  const [params] = useSearchParams()
  const preStaff = params.get('staff') || ''
  const preOcc = params.get('occasion') || ''

  const [step, setStep] = useState(preStaff ? (preOcc ? 3 : 2) : 1)
  const [staffId, setStaffId] = useState(preStaff)
  const [occasion, setOccasion] = useState(preOcc || 'birthday')
  const [notes, setNotes] = useState('')
  const [draft, setDraft] = useState('')
  const [q, setQ] = useState('')
  const [emailOn, setEmailOn] = useState(true)
  const [waOn, setWaOn] = useState(true)
  const [status, setStatus] = useState('')
  const [sending, setSending] = useState(false)
  const [addingType, setAddingType] = useState(false)
  const occasions = allOccasions(settings.customOccasions)

  const person = staff.find((s) => s.id === staffId)
  const occ = findOccasion(occasion, settings.customOccasions)
  const template = useMemo(
    () => occasionCopy(occasion, person, notes, settings.customOccasions),
    [occasion, person, notes, settings.customOccasions],
  )

  useEffect(() => {
    setDraft(template)
  }, [template])

  const body = draft || template
  const email = String(person?.email || '').trim()
  const wa = whatsappNumber(person?.phone)

  useEffect(() => {
    setEmailOn(Boolean(email))
    setWaOn(Boolean(wa))
    setStatus('')
  }, [person?.id, email, wa])

  const visibleStaff = staff.filter((s) => {
    const hay = `${s.name} ${s.role}`.toLowerCase()
    return !q.trim() || hay.includes(q.trim().toLowerCase())
  })

  const send = async () => {
    if (!person || sending) return
    const sendEmail = emailOn && Boolean(email)
    const sendWa = waOn && Boolean(wa)
    const channels = [
      sendEmail ? 'email' : null,
      sendWa ? 'whatsapp' : null,
    ].filter(Boolean)
    if (!channels.length) {
      if (emailOn && !email && waOn && !wa) {
        setStatus(`No email or WhatsApp number on file for ${person.name}.`)
      } else if (emailOn && !email) {
        setStatus(`No email on file for ${person.name}. Turn Email off or add their address.`)
      } else if (waOn && !wa) {
        setStatus(`No phone on file for ${person.name}. Turn WhatsApp off or add their number.`)
      } else {
        setStatus('Choose Email, WhatsApp, or both.')
      }
      return
    }

    setSending(true)
    setStatus('')
    const text = plainMessage({ body, settings })
    const sent = []

    try {
      const node = document.getElementById('ceo-message-card')
      if (node) {
        const canvas = await html2canvas(node, { backgroundColor: '#0c121c', scale: 2, useCORS: true })
        const link = document.createElement('a')
        link.download = `Blumen-${person.name.replace(/\s+/g, '-')}-${occ?.label || 'card'}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
      }

      let payload = {}
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
            staff: { ...person, email, phone: person.phone },
            settings,
            occasionLabel: occ?.label || occasion,
            body,
            channels,
          }),
        })
        payload = await res.json().catch(() => ({}))
        if (!res.ok && payload.error) throw new Error(payload.error)
      } catch (err) {
        payload = { error: err.message }
      }

      if (sendEmail) {
        if (payload.email?.sent) {
          sent.push(`Email sent from Blumen Technologies (${payload.from || 'office@blumentechnologies.com'}) to ${email}`)
        } else {
          const subject = encodeURIComponent(`${occ?.label || 'Greeting'} from ${settings.ceoName} · Blumen Technologies`)
          const cc = settings.ccHr ? `&cc=${encodeURIComponent(settings.ccHr)}` : ''
          window.open(`mailto:${encodeURIComponent(email)}?subject=${subject}&body=${encodeURIComponent(text)}${cc}`)
          sent.push(`Email opened to ${email}${payload.email?.error || payload.error ? ` (${payload.email?.error || payload.error})` : ''}`)
        }
      }

      if (sendWa) {
        if (payload.whatsapp?.sent) {
          sent.push(`WhatsApp sent from the Blumen Technologies business number to ${displayPhone(person.phone)}`)
        } else {
          window.open(`https://wa.me/${wa}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
          sent.push(`WhatsApp opened to ${displayPhone(person.phone)} — tap Send${payload.whatsapp?.error ? ` (${payload.whatsapp.error})` : ''}`)
        }
      }

      await addSend({ staffId: person.id, type: occasion, channels, body })
      setStatus(sent.join('. ') || 'Card recorded.')
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
        <button type="button" className={`step ${step === 1 ? 'on' : ''}`} onClick={() => setStep(1)}>
          1. Select Staff
        </button>
        <button
          type="button"
          className={`step ${step === 2 ? 'on' : ''}`}
          disabled={!staffId}
          onClick={() => setStep(2)}
        >
          2. Choose Occasion
        </button>
        <button
          type="button"
          className={`step ${step === 3 ? 'on' : ''}`}
          disabled={!staffId}
          onClick={() => setStep(3)}
        >
          3. Preview & Send
        </button>
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
            {occasions.map((o) => (
              <button key={o.value} className={`occ ${occasion === o.value ? 'on' : ''}`} onClick={() => setOccasion(o.value)}>
                <OccasionIcon type={o.value} />
                {o.label}
              </button>
            ))}
            <button type="button" className="occ occ-add" onClick={() => setAddingType(true)}>
              <Plus size={18} />
              Add type
            </button>
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

      {addingType && (
        <AddOccasionModal
          onClose={() => setAddingType(false)}
          onSave={async ({ label, template }) => {
            const value = await addOccasionType({ label, template })
            setOccasion(value)
            setAddingType(false)
          }}
        />
      )}

      {step === 3 && (
        <div className="grid-2">
          <MessageCard body={body} settings={settings} />
          <section className="card">
            <h2 className="page-title" style={{ fontSize: '1.4rem' }}>Send to {person?.name}</h2>
            <p className="meta">{occ?.label || occasion} · Logo, CEO photo, then the signed letter</p>
            <div className="field" style={{ marginTop: '1rem' }}>
              <label>Edit message</label>
              <textarea
                className="message-edit"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Write or edit the CEO message before sending..."
              />
              <button
                type="button"
                className="btn-ghost"
                style={{ marginTop: '0.35rem', paddingLeft: 0 }}
                onClick={() => setDraft(template)}
              >
                Reset to template
              </button>
            </div>
            <div className="toggle-row">
              <div>
                <strong>Email from Blumen Technologies</strong>
                <div className="meta">{person?.email || 'No email on file'} · From office@blumentechnologies.com</div>
              </div>
              <button type="button" className={`toggle ${emailOn ? 'on' : ''}`} onClick={() => setEmailOn((v) => !v)}>
                <span />
              </button>
            </div>
            <div className="toggle-row">
              <div>
                <strong>WhatsApp from Blumen Technologies</strong>
                <div className="meta">{person?.phone ? displayPhone(person.phone) : 'No phone on file'} · Sent from the company business number</div>
              </div>
              <button type="button" className={`toggle ${waOn ? 'on' : ''}`} onClick={() => setWaOn((v) => !v)}>
                <span />
              </button>
            </div>
            <p className="meta" style={{ marginTop: '0.8rem' }}>
              Cards go out as Blumen Technologies. Email uses office@blumentechnologies.com. WhatsApp uses the company business number when it is connected on Netlify.
              {!wa ? ' WhatsApp stays off until a phone number is added.' : ''}
              {!email ? ' Email stays off until an address is added.' : ''}
            </p>
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
