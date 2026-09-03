import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Bell,
  CalendarDays,
  Clock3,
  LayoutGrid,
  LogOut,
  Menu,
  Send,
  Settings,
  Users,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { ASSETS, CEO, COMPANY } from '../lib/constants'
import { findOccasion } from '../lib/occasions'
import { daysUntil, daysUntilBirthday, formatDate } from '../lib/format'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/staff', label: 'Staff Directory', icon: Users },
  { to: '/events', label: 'Events', icon: CalendarDays, badge: true },
  { to: '/compose', label: 'Compose & Send', icon: Send },
  { to: '/history', label: 'Send History', icon: Clock3 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

const dock = links.filter((l) => l.to !== '/settings')

export default function Layout() {
  const { staff, events, settings, usingCloud } = useApp()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [notesOpen, setNotesOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const upcoming = events.filter((e) => daysUntil(e.date) >= 0).length

  const alerts = useMemo(() => {
    const items = []
    events.forEach((event) => {
      const due = daysUntil(event.date)
      if (due == null || due < 0 || due > 7) return
      const person = staff.find((s) => s.id === event.staffId)
      const occ = findOccasion(event.type, settings.customOccasions)
      items.push({
        id: event.id,
        title: `${person?.name} · ${occ?.label || event.type}`,
        detail: due === 0 ? 'Today' : `In ${due} day${due === 1 ? '' : 's'} · ${formatDate(event.date)}`,
        to: `/compose?staff=${event.staffId}&occasion=${event.type}`,
      })
    })
    staff.forEach((s) => {
      const due = daysUntilBirthday(s.birthday)
      if (due == null || due > 7) return
      if (items.some((i) => i.id === `bday-${s.id}` || i.to.includes(`staff=${s.id}&occasion=birthday`))) return
      items.push({
        id: `bday-${s.id}`,
        title: `${s.name} · Birthday`,
        detail: due === 0 ? 'Today' : `In ${due} day${due === 1 ? '' : 's'}`,
        to: `/compose?staff=${s.id}&occasion=birthday`,
      })
    })
    return items.slice(0, 8)
  }, [events, staff, settings.customOccasions])

  const title = links.find((l) => (l.end ? location.pathname === '/' : location.pathname.startsWith(l.to)))?.label || COMPANY.product

  return (
    <div className="app-shell">
      <div className="ambient" aria-hidden="true">
        <span className="window-light" />
        <span className="orb orb-a" />
        <span className="orb orb-b" />
        <span className="orb orb-c" />
      </div>
      <div className="grain" aria-hidden="true" />
      {open && <div className="nav-dim" onClick={() => setOpen(false)} />}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <img src={ASSETS.mark} alt="" />
          <div className="brand-name">
            BLUMEN
            <span>TECHNOLOGIES</span>
          </div>
        </NavLink>
        <div className="nav-kicker">Staff Care Platform</div>
        <ul className="nav-list">
          {links.map(({ to, label, icon: Icon, end, badge }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <span className="nav-ico"><Icon size={16} /></span>
                {label}
                {badge && upcoming > 0 && <span className="nav-badge">{upcoming}</span>}
              </NavLink>
            </li>
          ))}
        </ul>

        <NavLink to="/settings" className="auto-box" onClick={() => setOpen(false)}>
          <strong>{settings.autoSend ? 'Auto-Send Active' : 'Auto-Send Paused'}</strong>
          <p>{events.length} events being monitored</p>
        </NavLink>

        <div className="ceo-box">
          <NavLink to="/settings" className="ceo-profile" onClick={() => setOpen(false)}>
            <img src={ASSETS.ceo} alt={CEO.name} />
            <div>
              <strong>{user?.full_name || settings.ceoName}</strong>
              <span>{user?.role ? String(user.role).toUpperCase() : settings.ceoTitle}</span>
            </div>
          </NavLink>
          {user && (
            <button
              className="icon-btn"
              title="Sign out"
              onClick={async () => {
                await logout()
                navigate('/login')
              }}
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="row" style={{ justifyContent: 'flex-start' }}>
            <button className="icon-btn menu-btn" onClick={() => setOpen(true)} aria-label="Menu">
              <Menu size={18} />
            </button>
            <div>
              <h1 className="page-title">{title}</h1>
              {location.pathname === '/' && (
                <p className="page-sub">Blumen Technologies · {COMPANY.location}</p>
              )}
            </div>
          </div>
          <div className="row" style={{ width: 'auto' }}>
            {location.pathname === '/' && (
              <button className="btn-gold" onClick={() => navigate('/events?log=1')}>+ Log Event</button>
            )}
            {location.pathname === '/events' && (
              <>
                <button className="btn-ghost" onClick={() => navigate('/events?type=1')}>+ Occasion type</button>
                <button className="btn-gold" onClick={() => navigate('/events?log=1')}>+ Add Event</button>
              </>
            )}
            {location.pathname === '/staff' && (
              <button className="btn-gold" onClick={() => navigate('/staff?add=1')}>+ Add Staff</button>
            )}
            <button
              type="button"
              className={`live-pill ${usingCloud ? 'on' : ''}`}
              onClick={() => navigate('/settings')}
              title={usingCloud ? 'Connected to Supabase' : 'Local demo mode'}
            >
              {usingCloud ? 'LIVE · SUPABASE' : 'LOCAL DEMO'}
            </button>
            <button className="icon-btn" aria-label="Notifications" onClick={() => setNotesOpen((v) => !v)}>
              <Bell size={18} />
              {alerts.length > 0 && <span className="dot" />}
            </button>
          </div>
        </header>

        {notesOpen && (
          <div className="notify-panel glass">
            <div className="section-head">
              <h2>Notifications</h2>
              <button className="btn-ghost" onClick={() => setNotesOpen(false)}>Close</button>
            </div>
            {alerts.length === 0 && <p className="meta">No staff occasions in the next 7 days.</p>}
            {alerts.map((item) => (
              <button
                key={item.id}
                className="notify-row"
                onClick={() => {
                  setNotesOpen(false)
                  navigate(item.to)
                }}
              >
                <strong>{item.title}</strong>
                <span className="meta">{item.detail}</span>
              </button>
            ))}
          </div>
        )}

        <div className="content">
          <Outlet />
        </div>
      </div>

      <nav className="dock" aria-label="Quick navigation">
        {dock.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `dock-link ${isActive ? 'on' : ''}`}
            title={label}
          >
            <Icon size={18} />
            <span>{label.split(' ')[0]}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
