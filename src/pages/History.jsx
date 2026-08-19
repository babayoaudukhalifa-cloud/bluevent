import { Mail, MessageCircle } from 'lucide-react'
import { OCCASIONS } from '../lib/constants'
import { formatDateTime } from '../lib/format'
import { useApp } from '../context/AppContext'
import OccasionIcon from '../components/OccasionIcon'

export default function History() {
  const { staff, sends } = useApp()
  const emailCount = sends.filter((s) => s.channels?.includes('email')).length
  const waCount = sends.filter((s) => s.channels?.includes('whatsapp')).length

  const exportCsv = () => {
    const header = ['Staff', 'Role', 'Occasion', 'Channels', 'Status', 'Sent at']
    const lines = sends.map((row) => {
      const person = staff.find((s) => s.id === row.staffId)
      const occ = OCCASIONS.find((o) => o.value === row.type)
      return [
        person?.name,
        person?.role,
        occ?.label,
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
          {sends.length} cards sent · {sends.length} delivered successfully.
        </p>
        <button className="btn-outline" onClick={exportCsv}>Export CSV</button>
      </div>

      <div className="grid-stats" style={{ margin: '1rem 0' }}>
        <div className="stat-card">
          <div className="k">Total Sent</div>
          <div className="n">{sends.length}</div>
        </div>
        <div className="stat-card stat-green">
          <div className="k">Via WhatsApp</div>
          <div className="n" style={{ color: 'var(--ok)' }}>{waCount}</div>
        </div>
        <div className="stat-card stat-blue">
          <div className="k">Via Email</div>
          <div className="n" style={{ color: 'var(--blue)' }}>{emailCount}</div>
        </div>
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
            </tr>
          </thead>
          <tbody>
            {sends.map((row) => {
              const person = staff.find((s) => s.id === row.staffId)
              const occ = OCCASIONS.find((o) => o.value === row.type)
              return (
                <tr key={row.id}>
                  <td>
                    <strong>{person?.name}</strong>
                    <div className="meta">{person?.role}</div>
                  </td>
                  <td>
                    <span className="row" style={{ justifyContent: 'flex-start' }}>
                      <span className="event-icon"><OccasionIcon type={row.type} /></span>
                      {occ?.label}
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
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}
