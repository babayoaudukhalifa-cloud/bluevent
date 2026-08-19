import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Cake, CalendarDays, Send, Users } from 'lucide-react'
import { ASSETS, CEO, OCCASIONS } from '../lib/constants'
import {
  birthdayLabel,
  daysUntil,
  daysUntilBirthday,
  formatDate,
  greeting,
  initials,
  isToday,
  todayLabel,
} from '../lib/format'
import { useApp } from '../context/AppContext'
import OccasionIcon from '../components/OccasionIcon'

export default function Dashboard() {
  const { staff, events, sends, settings } = useApp()
  const navigate = useNavigate()

  const birthdays = useMemo(() => (
    staff
      .map((s) => ({ ...s, days: daysUntilBirthday(s.birthday) }))
      .filter((s) => s.days != null && s.days <= 30)
      .sort((a, b) => a.days - b.days)
  ), [staff])

  const todayEvents = useMemo(
    () => events.filter((e) => isToday(e.date)),
    [events],
  )

  const occasionRows = useMemo(
    () => [...events]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .filter((e) => daysUntil(e.date) >= -40)
      .slice(0, 8),
    [events],
  )

  const recent = sends.slice(0, 4)

  return (
    <div>
      <div className="welcome">
        <img src={ASSETS.ceo} alt={CEO.name} />
        <div>
          <p className="kicker">CEO Dashboard</p>
          <h1>{greeting()}, {settings.ceoName.split(' ').slice(0, 2).join(' ')} 👋</h1>
          <p className="page-sub">{todayLabel()} · Your staff care platform is active.</p>
        </div>
      </div>

      {todayEvents.map((event) => {
        const person = staff.find((s) => s.id === event.staffId)
        const occ = OCCASIONS.find((o) => o.value === event.type)
        return (
          <div className="today-spot" key={event.id}>
            <div className="event-icon"><OccasionIcon type={event.type} size={22} /></div>
            <div style={{ flex: 1 }}>
              <p className="kicker">Today at Blumen</p>
              <strong>{person?.name} · {occ?.label}</strong>
              <div className="meta">{event.notes || 'Send a card from the CEO office.'}</div>
            </div>
            <button className="btn-gold" onClick={() => navigate(`/compose?staff=${event.staffId}&occasion=${event.type}`)}>
              Send today’s card
            </button>
          </div>
        )
      })}

      <div className="grid-stats">
        <div className="stat-card stat-blue">
          <div className="stat-ico"><Users size={18} /></div>
          <div className="k">Total Staff</div>
          <div className="n">{staff.length}</div>
          <div className="s">{staff.length} active members</div>
        </div>
        <div className="stat-card stat-green">
          <div className="stat-ico"><Send size={18} /></div>
          <div className="k">Cards Sent</div>
          <div className="n">{sends.length}</div>
          <div className="s">From the CEO office</div>
        </div>
        <div className="stat-card stat-purple">
          <div className="stat-ico"><CalendarDays size={18} /></div>
          <div className="k">Events Tracked</div>
          <div className="n">{events.length}</div>
          <div className="s">{settings.autoSend ? 'Auto-send enabled' : 'Auto-send paused'}</div>
        </div>
        <div className="stat-card stat-orange">
          <div className="stat-ico"><Cake size={18} /></div>
          <div className="k">Birthdays Soon</div>
          <div className="n">{birthdays.length}</div>
          <div className="s">Within 30 days</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: '1rem' }}>
        <section className="card">
          <div className="section-head">
            <h2>Upcoming Birthdays</h2>
            <span className="pill">{birthdays.length} within 30 days</span>
          </div>
          {birthdays.length === 0 && <p className="meta">No birthdays in the next 30 days.</p>}
          {birthdays.map((s) => (
            <div className="list-row" key={s.id}>
              <div className="avatar" style={{ background: s.color }}>{initials(s.name)}</div>
              <div style={{ flex: 1 }}>
                <strong>{s.name}</strong>
                <div className="meta">{s.role}</div>
              </div>
              <div className="meta">{s.days === 0 ? 'Today' : `${s.days} days`} · {birthdayLabel(s.birthday)}</div>
              <button className="btn-outline" onClick={() => navigate(`/compose?staff=${s.id}&occasion=birthday`)}>Send Card</button>
            </div>
          ))}
        </section>

        <section className="card">
          <div className="section-head">
            <h2>Recent Sends</h2>
          </div>
          {recent.map((row) => {
            const person = staff.find((s) => s.id === row.staffId)
            const occ = OCCASIONS.find((o) => o.value === row.type)
            return (
              <div className="list-row" key={row.id}>
                <div className="event-icon"><OccasionIcon type={row.type} /></div>
                <div style={{ flex: 1 }}>
                  <strong>{person?.name}</strong>
                  <div className="meta">{occ?.label} · {formatDate(row.sentAt)}</div>
                </div>
                <span className="ok">Delivered</span>
              </div>
            )
          })}
        </section>
      </div>

      <section className="card" style={{ marginTop: '1rem' }}>
        <div className="section-head">
          <h2>Staff Events & Occasions</h2>
          <span className="pill">{occasionRows.length} tracked</span>
        </div>
        <div className="grid-cards">
          {occasionRows.map((event) => {
            const person = staff.find((s) => s.id === event.staffId)
            const occ = OCCASIONS.find((o) => o.value === event.type)
            const due = daysUntil(event.date)
            return (
              <article className={`event-card ${due === 0 ? 'today' : ''}`} key={event.id}>
                <div className="event-icon"><OccasionIcon type={event.type} size={20} /></div>
                <strong>{person?.name || 'Staff'}</strong>
                <div className="meta">{occ?.label}</div>
                {event.notes && <div className="meta">{event.notes}</div>}
                <div className="meta">{due === 0 ? 'Today' : formatDate(event.date)}</div>
                <button className="btn-gold" onClick={() => navigate(`/compose?staff=${event.staffId}&occasion=${event.type}`)}>
                  Send Card
                </button>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
