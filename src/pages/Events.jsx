import { useMemo, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { allOccasions, findOccasion } from '../lib/occasions'
import { formatDate, isToday } from '../lib/format'
import { useApp } from '../context/AppContext'
import AddOccasionModal from '../components/AddOccasionModal'
import Modal from '../components/Modal'
import OccasionIcon from '../components/OccasionIcon'

export default function Events() {
  const { staff, events, settings, addEvent, addOccasionType, removeOccasionType } = useApp()
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const logging = params.get('log') === '1'
  const addingType = params.get('type') === '1'
  const occasions = allOccasions(settings.customOccasions)
  const customIds = new Set((settings.customOccasions || []).map((item) => item.value))

  const rows = useMemo(() => (
    [...events].sort((a, b) => new Date(b.date) - new Date(a.date))
  ), [events])

  const closeQuery = (key) => {
    params.delete(key)
    setParams(params)
  }

  return (
    <div>
      <div className="row">
        <p className="page-sub" style={{ marginTop: 0 }}>{events.length} tracked events.</p>
        <div className="row" style={{ width: 'auto' }}>
          <button type="button" className="btn-ghost" onClick={() => navigate('/events?type=1')}>+ Add occasion type</button>
          <button type="button" className="btn-gold" onClick={() => navigate('/events?log=1')}>+ Add Event</button>
        </div>
      </div>

      <section className="card" style={{ marginTop: '1rem' }}>
        <div className="section-head">
          <h2>Occasion types</h2>
          <button type="button" className="pill" onClick={() => navigate('/events?type=1')}>
            {occasions.length} types
          </button>
        </div>
        <p className="meta">
          These appear when you compose a card or log an event. Add your own — for example a greeting when a loved one is in hospital.
        </p>
        <div className="occ-grid" style={{ marginTop: '1rem' }}>
          {occasions.map((o) => (
            <div key={o.value} className={`occ-type ${customIds.has(o.value) ? 'custom' : ''}`}>
              <div className="event-icon"><OccasionIcon type={o.value} /></div>
              <strong>{o.label}</strong>
              {customIds.has(o.value) ? (
                <button
                  type="button"
                  className="icon-btn danger"
                  title="Remove occasion type"
                  onClick={async () => {
                    if (!window.confirm(`Remove “${o.label}” from the occasion list?`)) return
                    try {
                      await removeOccasionType(o.value)
                    } catch (err) {
                      alert(err.message || 'Could not remove occasion type')
                    }
                  }}
                >
                  <Trash2 size={14} />
                </button>
              ) : (
                <span className="meta">Built-in</span>
              )}
            </div>
          ))}
          <button type="button" className="occ occ-add" onClick={() => navigate('/events?type=1')}>
            <Plus size={18} />
            Add type
          </button>
        </div>
      </section>

      {rows.length === 0 && (
        <section className="card" style={{ marginTop: '1rem' }}>
          <h2 className="page-title" style={{ fontSize: '1.3rem' }}>No staff events yet</h2>
          <p className="meta">Log a welcome, promotion, birthday, wedding, hospital visit, Eid greeting, or any other staff occasion. Auto-send can pick it up on the date.</p>
          <div className="actions">
            <button type="button" className="btn-gold" onClick={() => navigate('/events?log=1')}>Add an event</button>
          </div>
        </section>
      )}
      <div className="grid-cards" style={{ marginTop: '1rem' }}>
        {rows.map((event) => {
          const person = staff.find((s) => s.id === event.staffId)
          const occ = findOccasion(event.type, settings.customOccasions)
          const to = `/compose?staff=${event.staffId}&occasion=${event.type}`
          return (
              <article
                className={`event-card clickable ${isToday(event.date) ? 'today' : ''}`}
                key={event.id}
                onClick={() => navigate(to)}
              >
              <div className="event-icon"><OccasionIcon type={event.type} size={20} /></div>
              <strong>{person?.name || 'Staff'}</strong>
              <div className="meta">{occ?.label || event.type}</div>
              {event.notes && <div className="meta">{event.notes}</div>}
              <div className="meta">{formatDate(event.date)}</div>
              <button className="btn-gold" onClick={(e) => { e.stopPropagation(); navigate(to) }}>
                Send Card
              </button>
            </article>
          )
        })}
      </div>

      {logging && (
        <LogEventModal
          staff={staff}
          occasions={occasions}
          onClose={() => closeQuery('log')}
          onSave={async (event) => {
            try {
              await addEvent(event)
              closeQuery('log')
            } catch (err) {
              alert(err.message || 'Could not log event')
            }
          }}
        />
      )}

      {addingType && (
        <AddOccasionModal
          onClose={() => closeQuery('type')}
          onSave={async ({ label, template }) => {
            await addOccasionType({ label, template })
            closeQuery('type')
          }}
        />
      )}
    </div>
  )
}

function LogEventModal({ staff, occasions, onClose, onSave }) {
  const [q, setQ] = useState('')
  const [form, setForm] = useState({
    staffId: staff[0]?.id || '',
    type: 'promotion',
    date: new Date().toISOString().slice(0, 10),
    notes: '',
  })
  const people = staff.filter((s) => {
    const hay = `${s.name} ${s.role} ${s.department}`.toLowerCase()
    return !q.trim() || hay.includes(q.trim().toLowerCase())
  })

  return (
    <Modal title="Add Event" onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!form.staffId) {
            alert('Choose a staff member.')
            return
          }
          onSave(form)
        }}
      >
        <div className="field">
          <label>Staff Member</label>
          <input
            className="search"
            style={{ paddingLeft: '1.1rem' }}
            placeholder="Search staff..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            value={form.staffId}
            onChange={(e) => setForm((f) => ({ ...f, staffId: e.target.value }))}
            style={{ marginTop: '0.5rem' }}
            required
          >
            <option value="">Select staff</option>
            {(q.trim() ? people : staff).map((s) => (
              <option key={s.id} value={s.id}>{s.name}{s.role ? ` · ${s.role}` : ''}</option>
            ))}
          </select>
        </div>
        <div className="field" style={{ marginTop: '0.8rem' }}>
          <label>Event Type</label>
          <div className="occ-grid">
            {occasions.map((o) => (
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
          <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} required />
        </div>
        <div className="field" style={{ marginTop: '0.8rem' }}>
          <label>Notes (optional)</label>
          <textarea placeholder="Add any additional context..." value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
        </div>
        <div className="actions">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-gold" type="submit" disabled={!form.staffId}>Save Event</button>
        </div>
      </form>
    </Modal>
  )
}
