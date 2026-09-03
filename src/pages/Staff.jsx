import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Gift, Pencil, Search, Send, Trash2 } from 'lucide-react'
import { AVATAR_COLORS, DEPARTMENTS } from '../lib/constants'
import { daysUntilBirthday, initials } from '../lib/format'
import { useApp } from '../context/AppContext'
import Modal from '../components/Modal'

export default function Staff() {
  const { staff, addStaff, editStaff, removeStaff, departments, cloudError } = useApp()
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [dept, setDept] = useState('All')
  const [editing, setEditing] = useState(null)
  const adding = params.get('add') === '1'
  const soon = params.get('soon') === '1'
  const deptList = departments?.length ? departments : DEPARTMENTS

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return staff.filter((s) => {
      const matchDept = dept === 'All' || s.department === dept
      const hay = [
        s.name,
        s.role,
        s.department,
        s.email,
        s.professional,
        s.education,
        s.specialization,
      ].join(' ').toLowerCase()
      const matchQuery = !query || hay.includes(query)
      if (!matchDept || !matchQuery) return false
      if (!soon) return true
      const days = daysUntilBirthday(s.birthday)
      return days != null && days <= 30
    })
  }, [staff, q, dept, soon])

  return (
    <div>
      {cloudError && <p className="error-text">{cloudError}</p>}
      <p className="page-sub" style={{ marginTop: 0 }}>
        {soon
          ? `${filtered.length} birthday${filtered.length === 1 ? '' : 's'} in the next 30 days · Click a card to send a greeting.`
          : `${staff.length} team members · Click a card to edit the record, or send a greeting.`}
        {soon && (
          <>
            {' '}
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                params.delete('soon')
                setParams(params)
              }}
            >
              Show all staff
            </button>
          </>
        )}
      </p>
      <div className="search-wrap">
        <Search size={16} />
        <input className="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, role, department, or qualification..." />
      </div>
      <div className="filters">
        {['All', ...deptList].map((d) => (
          <button key={d} className={`filter-pill ${dept === d ? 'on' : ''}`} onClick={() => setDept(d)}>{d}</button>
        ))}
      </div>
      <div className="grid-cards">
        {filtered.map((s) => (
          <article
            className="staff-card clickable"
            key={s.id}
            onClick={() => setEditing(s)}
          >
            <div className="row" style={{ justifyContent: 'flex-start' }}>
              <div className="avatar" style={{ background: s.color }}>{initials(s.name)}</div>
              <div>
                <strong>{s.name}</strong>
                <div className="meta">{s.role || s.specialization || s.professional || 'Staff'}</div>
              </div>
            </div>
            <div className="pills">
              {s.staffCode && <span className="pill">{s.staffCode}</span>}
              {s.department && <span className="pill">{s.department}</span>}
              {s.years > 0 && <span className="pill">{s.years} yrs</span>}
            </div>
            {s.email ? <div className="meta">{s.email}</div> : <div className="meta">No email on file</div>}
            {s.specialization ? <div className="meta">{s.specialization}</div> : null}
            {s.education ? <div className="meta">{s.education}</div> : null}
            {s.professional && s.professional !== s.role ? <div className="meta">{s.professional}</div> : null}
            <div className="row">
              <button
                className="btn-outline"
                onClick={(e) => {
                  e.stopPropagation()
                  setEditing(s)
                }}
              >
                <Pencil size={15} /> Edit
              </button>
              <button
                className="btn-outline"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/compose?staff=${s.id}&occasion=birthday`)
                }}
              >
                <Gift size={15} /> Birthday Card
              </button>
              <button
                className="btn-outline"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/compose?staff=${s.id}`)
                }}
              >
                <Send size={15} /> Send a Card
              </button>
            </div>
          </article>
        ))}
      </div>

      {adding && (
        <AddStaffModal
          departments={deptList}
          staff={staff}
          onRemove={removeStaff}
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

      {editing && (
        <EditStaffModal
          person={editing}
          departments={deptList}
          onClose={() => {
            params.delete('edit')
            setParams(params)
            setEditing(null)
          }}
          onSave={async (person) => {
            try {
              await editStaff(person)
              params.delete('edit')
              setParams(params)
              setEditing(null)
            } catch (err) {
              alert(err.message || 'Could not save staff record')
            }
          }}
        />
      )}
    </div>
  )
}

function AddStaffModal({ onClose, onSave, onRemove, staff = [], departments = DEPARTMENTS }) {
  const [form, setForm] = useState({
    name: '',
    role: '',
    department: departments[0] || 'IT Department',
    email: '',
    professional: '',
    education: '',
    specialization: '',
    years: '',
    phone: '',
    birthday: '',
    color: AVATAR_COLORS[0],
  })

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  return (
    <Modal title="Add or Remove Staff" onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSave(form)
        }}
      >
        <div className="form-grid">
          <div className="field">
            <label>Full Name</label>
            <input required placeholder="e.g. Mr. Abubakar Abdullahi Kamba" value={form.name} onChange={set('name')} />
          </div>
          <div className="field">
            <label>Current Position</label>
            <input placeholder="e.g. Software Engineer" value={form.role} onChange={set('role')} />
          </div>
          <div className="field">
            <label>Current Department</label>
            <select value={form.department} onChange={set('department')}>
              {departments.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Email Address</label>
            <input type="email" placeholder="staff@blumentechnologies.com" value={form.email} onChange={set('email')} />
          </div>
          <div className="field">
            <label>Professional Qualifications</label>
            <input placeholder="e.g. Software Engineer" value={form.professional} onChange={set('professional')} />
          </div>
          <div className="field">
            <label>Educational Qualifications</label>
            <input placeholder="e.g. Computer Science (B.Sc)" value={form.education} onChange={set('education')} />
          </div>
          <div className="field">
            <label>Specialization</label>
            <input placeholder="e.g. Frontend Development" value={form.specialization} onChange={set('specialization')} />
          </div>
          <div className="field">
            <label>Years of Experience</label>
            <input type="number" min="0" placeholder="e.g. 7" value={form.years} onChange={set('years')} />
          </div>
          <div className="field">
            <label>Phone Number</label>
            <input placeholder="+234 800 000 0000" value={form.phone} onChange={set('phone')} />
          </div>
          <div className="field">
            <label>Birthday (MM-DD)</label>
            <input placeholder="08-19" value={form.birthday} onChange={set('birthday')} />
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
      <div className="remove-staff">
        <h3>Remove a staff member</h3>
        <p className="meta">Use the recycle bin if someone should no longer be on the directory.</p>
        {staff.map((person) => (
          <div className="list-row" key={person.id}>
            <div className="avatar" style={{ background: person.color }}>{initials(person.name)}</div>
            <div style={{ flex: 1 }}>
              <strong>{person.name}</strong>
              <div className="meta">{person.role || person.department || 'Staff'}</div>
            </div>
            <button
              type="button"
              className="icon-btn danger"
              title="Remove staff"
              aria-label={`Remove ${person.name}`}
              onClick={async () => {
                if (!window.confirm(`Remove ${person.name} from the staff directory?`)) return
                try {
                  await onRemove(person.id)
                } catch (err) {
                  alert(err.message || 'Could not remove this staff member')
                }
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </Modal>
  )
}

function EditStaffModal({ person, onClose, onSave, departments = DEPARTMENTS }) {
  const [form, setForm] = useState({
    id: person.id,
    name: person.name || '',
    role: person.role || '',
    department: person.department || departments[0] || '',
    email: person.email || '',
    professional: person.professional || '',
    education: person.education || '',
    specialization: person.specialization || '',
    years: person.years || '',
    phone: person.phone || '',
    birthday: person.birthday || '',
    color: person.color || AVATAR_COLORS[0],
  })
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  return (
    <Modal title={`Edit ${person.name}`} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSave(form)
        }}
      >
        <div className="form-grid">
          <div className="field">
            <label>Full Name</label>
            <input required value={form.name} onChange={set('name')} />
          </div>
          <div className="field">
            <label>Current Position</label>
            <input placeholder="e.g. Clinical informatics analyst" value={form.role} onChange={set('role')} />
          </div>
          <div className="field">
            <label>Current Department</label>
            <select value={form.department} onChange={set('department')}>
              {[form.department, ...departments].filter((d, i, all) => d && all.indexOf(d) === i).map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Email Address</label>
            <input type="email" value={form.email} onChange={set('email')} />
          </div>
          <div className="field">
            <label>Professional Qualifications</label>
            <input value={form.professional} onChange={set('professional')} />
          </div>
          <div className="field">
            <label>Educational Qualifications</label>
            <input value={form.education} onChange={set('education')} />
          </div>
          <div className="field">
            <label>Specialization</label>
            <input value={form.specialization} onChange={set('specialization')} />
          </div>
          <div className="field">
            <label>Years of Experience</label>
            <input type="number" min="0" value={form.years} onChange={set('years')} />
          </div>
          <div className="field">
            <label>Phone Number</label>
            <input value={form.phone} onChange={set('phone')} />
          </div>
          <div className="field">
            <label>Birthday (MM-DD)</label>
            <input value={form.birthday} onChange={set('birthday')} />
          </div>
        </div>
        <div className="actions">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-gold" type="submit">Save record</button>
        </div>
      </form>
    </Modal>
  )
}
