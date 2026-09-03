import { Mail, MessageCircle, Trash2 } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { findOccasion } from '../lib/occasions'
import { formatDateTime } from '../lib/format'
import { useApp } from '../context/AppContext'
import OccasionIcon from '../components/OccasionIcon'

export default function History() {
  const { staff, sends, settings, removeSend } = useApp()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const channel = params.get('channel')
  const emailCount = sends.filter((s) => s.channels?.includes('email')).length
  const waCount = sends.filter((s) => s.channels?.includes('whatsapp')).length
  const rows = channel ? sends.filter((s) => s.channels?.includes(channel)) : sends

  const exportCsv = () => {
    const header = ['Staff', 'Role', 'Occasion', 'Channels', 'Status', 'Sent at']
    const lines = sends.map((row) => {
      const person = staff.find((s) => s.id === row.staffId)
      const occ = findOccasion(row.type, settings.customOccasions)
      return [
        person?.name,
        person?.role,
        occ?.label || row.type,
        (row.channels || []).join(' + '),
        row.status,
        formatDateTime(row.sentAt),
      ].join(',')
    })
    const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'blumen-send-history.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="row">
        <p className="page-sub" style={{ marginTop: 0 }}>
          {rows.length} cards sent · {rows.length} delivered successfully.
        </p>
        <button className="btn-outline" onClick={exportCsv}>Export CSV</button>
      </div>

      <div className="grid-stats" style={{ margin: '1rem 0' }}>
        <Link to="/history" className={`stat-card ${!channel ? 'on' : ''}`}>
          <div className="k">Total Sent</div>
          <div className="n">{sends.length}</div>
        </Link>
        <Link to="/history?channel=whatsapp" className={`stat-card stat-green ${channel === 'whatsapp' ? 'on' : ''}`}>
          <div className="k">Via WhatsApp</div>
          <div className="n" style={{ color: 'var(--ok)' }}>{waCount}</div>
        </Link>
        <Link to="/history?channel=email" className={`stat-card stat-blue ${channel === 'email' ? 'on' : ''}`}>
          <div className="k">Via Email</div>
          <div className="n" style={{ color: 'var(--blue)' }}>{emailCount}</div>
        </Link>
      </div>

      <section className="card">
        <h2 className="page-title" style={{ fontSize: '1.4rem' }}>All Sent Cards</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Staff</th>
              <th>Occasion</th>
              <th>Channels</th>
              <th>When</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const person = staff.find((s) => s.id === row.staffId)
              const occ = findOccasion(row.type, settings.customOccasions)
              return (
                <tr
                  key={row.id}
                  className="clickable"
                  onClick={() => navigate(`/compose?staff=${row.staffId}&occasion=${row.type}`)}
                >
                  <td>
                    <strong>{person?.name}</strong>
                    <div className="meta">{person?.role}</div>
                  </td>
                  <td>
                    <span className="row" style={{ justifyContent: 'flex-start' }}>
                      <span className="event-icon"><OccasionIcon type={row.type} /></span>
                      {occ?.label || row.type}
                    </span>
                  </td>
                  <td>
                    <span className="row" style={{ justifyContent: 'flex-start', width: 'auto' }}>
                      {row.channels?.includes('whatsapp') && <MessageCircle size={16} />}
                      {row.channels?.includes('email') && <Mail size={16} />}
                      {(row.channels || []).join(' · ')}
                    </span>
                  </td>
                  <td>{formatDateTime(row.sentAt)}</td>
                  <td className="ok">Delivered</td>
                  <td>
                    <button
                      type="button"
                      className="icon-btn danger"
                      title="Remove from history"
                      aria-label="Remove from history"
                      onClick={async (e) => {
                        e.stopPropagation()
                        if (!window.confirm(`Remove this delivered card for ${person?.name || 'this staff member'}?`)) return
                        try {
                          await removeSend(row.id)
                        } catch (err) {
                          alert(err.message || 'Could not remove this card')
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}
