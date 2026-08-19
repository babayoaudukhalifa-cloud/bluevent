import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { OCCASIONS } from '../lib/constants'
import { formatDate, isToday } from '../lib/format'
import { useApp } from '../context/AppContext'
import Modal from '../components/Modal'
import OccasionIcon from '../components/OccasionIcon'

export default function Events() {
  const { staff, events, addEvent } = useApp()
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const logging = params.get('log') === '1'

  const rows = useMemo(() => (
    [...events].sort((a, b) => new Date(b.date) - new Date(a.date))
  ), [events])

  return (
    <div>
      <p className="page-sub" style={{ marginTop: 0 }}>{events.length} tracked events.</p>
      <div className="grid-cards" style={{ marginTop: '1rem' }}>
        {rows.map((event) => {
          const person = staff.find((s) => s.id === event.staffId)
          const occ = OCCASIONS.find((o) => o.value === event.type)
          return (
              <article className={`event-card ${isToday(event.date) ? 'today' : ''}`} key={event.id}>
              <div className="event-icon"><OccasionIcon type={event.type} size={20} /></div>
              <strong>{person?.name || 'Staff'}</strong>
              <div className="meta">{occ?.label}</div>
              {event.notes && <div className="meta">{event.notes}</div>}
              <div className="meta">{formatDate(event.date)}</div>
              <button className="btn-gold" onClick={() => navigate(`/compose?staff=${event.staffId}&occasion=${event.type}`)}>
                Send Card
              </button>
            </article>
          )
        })}
      </div>

      {logging && (
        <LogEventModal
          staff={staff}
          onClose={() => {
            params.delete('log')
            setParams(params)
          }}
          onSave={async (event) => {
            try {
              await addEvent(event)
              params.delete('log')
              setParams(params)
            } catch (err) {
              alert(err.message || 'Could not log event')
            }
          }}
        />
      )}
    </div>
  )
}

function LogEventModal({ staff, onClose, onSave }) {
  const [form, setForm] = useState({
    staffId: staff[0]?.id || '',
    type: 'promotion',
    date: new Date().toISOString().slice(0, 10),
    notes: '',
  })

  return (
    <Modal title="Log New Event" onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSave(form)
        }}
      >
        <div className="field">
          <label>Staff Member</label>
          <select value={form.staffId} onChange={(e) => setForm((f) => ({ ...f, staffId: e.target.value }))}>
            {staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="field" style={{ marginTop: '0.8rem' }}>
          <label>Event Type</label>
          <div className="occ-grid">
            {OCCASIONS.map((o) => (
              <button
                type="button"
                key={o.value}
                className={`occ ${form.type === o.value ? 'on' : ''}`}
                onClick={() => setForm((f) => ({ ...f, type: o.value }))}
              >
                <OccasionIcon type={o.value} />
                {o.label}
              </button>
            ))}
          </div>
        </div>
        <div className="field" style={{ marginTop: '0.8rem' }}>
          <label>Event Date</label>
          <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
        </div>
        <div className="field" style={{ marginTop: '0.8rem' }}>
          <label>Notes (optional)</label>
          <textarea placeholder="Add any additional context..." value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
        </div>
        <div className="actions">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-gold" type="submit">Log Event</button>
        </div>
      </form>
    </Modal>
  )
}
