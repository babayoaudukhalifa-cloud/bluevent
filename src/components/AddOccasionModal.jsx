import { useState } from 'react'
import Modal from './Modal'

export default function AddOccasionModal({ onClose, onSave }) {
  const [label, setLabel] = useState('')
  const [template, setTemplate] = useState('')
  const [saving, setSaving] = useState(false)

  return (
    <Modal title="Add occasion type" onClose={onClose}>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          setSaving(true)
          try {
            await onSave({ label, template })
          } catch (err) {
            alert(err.message || 'Could not add occasion type')
            setSaving(false)
          }
        }}
      >
        <p className="meta">
          This adds a new greeting type to the list — birthday, bereavement, promotion, hospital visit, and so on.
        </p>
        <div className="field" style={{ marginTop: '0.9rem' }}>
          <label>Occasion name</label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Hospital / Illness"
            required
            autoFocus
          />
        </div>
        <div className="field" style={{ marginTop: '0.8rem' }}>
          <label>Default message (optional)</label>
          <textarea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            placeholder="I am sorry to hear that a loved one is unwell. Please know that you and your family are in our thoughts and prayers. We hope for a swift recovery."
          />
        </div>
        <div className="actions">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-gold" type="submit" disabled={saving || !label.trim()}>
            {saving ? 'Adding…' : 'Add to list'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
