import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Gift, Search, Send } from 'lucide-react'
import { AVATAR_COLORS, DEPARTMENTS } from '../lib/constants'
import { initials } from '../lib/format'
import { useApp } from '../context/AppContext'
import Modal from '../components/Modal'

export default function Staff() {
  const { staff, addStaff } = useApp()
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [dept, setDept] = useState('All')
  const adding = params.get('add') === '1'

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return staff.filter((s) => {
      const matchDept = dept === 'All' || s.department === dept
      const hay = `${s.name} ${s.role} ${s.department}`.toLowerCase()
      return matchDept && (!query || hay.includes(query))
    })
  }, [staff, q, dept])

  return (
    <div>
      <p className="page-sub" style={{ marginTop: 0 }}>
        {staff.length} team members · Click any card to send a greeting.
      </p>
      <div className="search-wrap">
        <Search size={16} />
        <input className="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, role, or department..." />
      </div>
      <div className="filters">
        {['All', ...DEPARTMENTS].map((d) => (
          <button key={d} className={`filter-pill ${dept === d ? 'on' : ''}`} onClick={() => setDept(d)}>{d}</button>
        ))}
      </div>
      <div className="grid-cards">
        {filtered.map((s) => (
          <article className="staff-card" key={s.id}>
            <div className="row" style={{ justifyContent: 'flex-start' }}>
              <div className="avatar" style={{ background: s.color }}>{initials(s.name)}</div>
              <div>
                <strong>{s.name}</strong>
                <div className="meta">{s.role}</div>
              </div>
            </div>
            <div className="pills">
              <span className="pill">{s.department}</span>
              <span className="pill">{s.years}yrs</span>
            </div>
            <div className="meta">{s.email}</div>
            <div className="meta">{s.phone}</div>
            <div className="row">
              <button className="btn-outline" onClick={() => navigate(`/compose?staff=${s.id}&occasion=birthday`)}>
                <Gift size={15} /> Birthday Card
              </button>
              <button className="btn-outline" onClick={() => navigate(`/compose?staff=${s.id}`)}>
                <Send size={15} /> Send a Card
              </button>
            </div>
          </article>
        ))}
      </div>

      {adding && (
        <AddStaffModal
          onClose={() => {
            params.delete('add')
            setParams(params)
          }}
          onSave={async (person) => {
            try {
              await addStaff(person)
              params.delete('add')
              setParams(params)
            } catch (err) {
              alert(err.message || 'Could not add staff')
            }
          }}
        />
      )}
    </div>
  )
}

function AddStaffModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: '',
    role: '',
    department: 'Engineering',
    email: '',
    phone: '+234 ',
    birthday: '',
    years: '1',
    color: AVATAR_COLORS[0],
  })

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  return (
    <Modal title="Add New Staff Member" onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSave(form)
        }}
      >
        <div className="form-grid">
          <div className="field">
            <label>Full Name</label>
            <input required placeholder="e.g. Amara Okafor" value={form.name} onChange={set('name')} />
          </div>
          <div className="field">
            <label>Role / Job Title</label>
            <input required placeholder="e.g. Software Engineer" value={form.role} onChange={set('role')} />
          </div>
          <div className="field">
            <label>Department</label>
            <select value={form.department} onChange={set('department')}>
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Email Address</label>
            <input required type="email" placeholder="staff@blumentechnologies.com" value={form.email} onChange={set('email')} />
          </div>
          <div className="field">
            <label>Phone Number</label>
            <input required placeholder="+234 800 000 0000" value={form.phone} onChange={set('phone')} />
          </div>
          <div className="field">
            <label>Birthday (MM-DD)</label>
            <input required placeholder="08-19" value={form.birthday} onChange={set('birthday')} />
          </div>
        </div>
        <div className="field" style={{ marginTop: '0.8rem' }}>
          <label>Avatar Color</label>
          <div className="colors">
            {AVATAR_COLORS.map((c) => (
              <button
                type="button"
                key={c}
                className={`swatch ${form.color === c ? 'on' : ''}`}
                style={{ background: c }}
                onClick={() => setForm((f) => ({ ...f, color: c }))}
              />
            ))}
          </div>
        </div>
        <div className="actions">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-gold" type="submit">Add Staff Member</button>
        </div>
      </form>
    </Modal>
  )
}
