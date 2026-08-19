import { ASSETS } from '../lib/constants'
import { useApp } from '../context/AppContext'

function Toggle({ on, onClick }) {
  return (
    <button type="button" className={`toggle ${on ? 'on' : ''}`} onClick={onClick} aria-pressed={on}>
      <span />
    </button>
  )
}

export default function SettingsPage() {
  const { settings, updateSettings, resetDemo, usingCloud, cloudError } = useApp()

  const set = (key) => (e) => updateSettings({ [key]: e.target.value })
  const flip = (key) => () => updateSettings({ [key]: !settings[key] })

  return (
    <div>
      <section className="card" style={{ marginBottom: '1rem' }}>
        <h2 className="page-title" style={{ fontSize: '1.5rem' }}>CEO Profile</h2>
        <div className="row" style={{ alignItems: 'flex-start', marginTop: '1rem' }}>
          <img src={ASSETS.ceo} alt={settings.ceoName} style={{ width: 110, height: 110, borderRadius: 18, objectFit: 'cover', border: '2px solid var(--gold)' }} />
          <div className="form-grid" style={{ flex: 1 }}>
            <div className="field">
              <label>Full Name</label>
              <input value={settings.ceoName} onChange={set('ceoName')} />
            </div>
            <div className="field">
              <label>Title</label>
              <input value={settings.ceoTitle} onChange={set('ceoTitle')} />
            </div>
          </div>
        </div>
      </section>

      <section className="card" style={{ marginBottom: '1rem' }}>
        <h2 className="page-title" style={{ fontSize: '1.5rem' }}>Automation Settings</h2>
        <div className="toggle-row">
          <div>
            <strong>Send email notifications to CEO</strong>
            <div className="meta">Get notified before each message is sent.</div>
          </div>
          <Toggle on={settings.notifyCeo} onClick={flip('notifyCeo')} />
        </div>
        <div className="toggle-row">
          <div>
            <strong>Auto-send CEO messages</strong>
            <div className="meta">Messages are sent automatically on the event date.</div>
          </div>
          <Toggle on={settings.autoSend} onClick={flip('autoSend')} />
        </div>
        <div className="toggle-row">
          <div>
            <strong>3-day advance reminder</strong>
            <div className="meta">Receive reminders 3 days before upcoming events.</div>
          </div>
          <Toggle on={settings.reminder3Day} onClick={flip('reminder3Day')} />
        </div>
        <div className="toggle-row">
          <div>
            <strong>Weekly summary report</strong>
            <div className="meta">Receive a weekly digest of all events and messages.</div>
          </div>
          <Toggle on={settings.weeklySummary} onClick={flip('weeklySummary')} />
        </div>
      </section>

      <section className="card">
        <h2 className="page-title" style={{ fontSize: '1.5rem' }}>Email Configuration</h2>
        <div className="field" style={{ marginTop: '0.8rem' }}>
          <label>CEO Email Address</label>
          <input type="email" value={settings.ceoEmail} onChange={set('ceoEmail')} />
        </div>
        <div className="field" style={{ marginTop: '0.8rem' }}>
          <label>Reply-To Address</label>
          <input type="email" value={settings.replyTo} onChange={set('replyTo')} />
        </div>
        <div className="field" style={{ marginTop: '0.8rem' }}>
          <label>CC: HR Department</label>
          <input type="email" value={settings.ccHr} onChange={set('ccHr')} />
        </div>
        <p className="meta" style={{ marginTop: '1rem' }}>
          Staff cards always attach the Blumen logo and Dr. Yunusa’s photo before the message.
          {usingCloud ? ' Data is saved in Supabase.' : ' This browser is using local demo data until Supabase is connected.'}
        </p>
        {cloudError && <p className="error-text">{cloudError}</p>}
        <div className="actions">
          {!usingCloud && <button className="btn-ghost" type="button" onClick={resetDemo}>Reset demo data</button>}
          <button className="btn-gold" type="button" onClick={() => alert(usingCloud ? 'Settings saved to Supabase.' : 'Settings saved on this device.')}>Save Changes</button>
        </div>
      </section>
    </div>
  )
}
