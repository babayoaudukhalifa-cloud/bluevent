import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ASSETS, COMPANY } from '../lib/constants'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { user, login, usingCloud } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to="/" replace />

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(email.trim(), password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login-page">
      <div className="ambient" aria-hidden="true">
        <span className="orb orb-a" />
        <span className="orb orb-b" />
      </div>
      <form className="login-card glass" onSubmit={submit}>
        <img src={ASSETS.logo} alt={COMPANY.name} className="login-logo" />
        <p className="kicker">Staff Care Platform</p>
        <h1>Blumen Technologies</h1>
        <p className="meta">Event Planner · {usingCloud ? 'Live Supabase login' : 'Local demo workspace'}</p>
        <div className="field" style={{ marginTop: '1.1rem' }}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="ceo@blumentechnologies.com" />
        </div>
        <div className="field" style={{ marginTop: '0.8rem' }}>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required={usingCloud} minLength={usingCloud ? 6 : 0} />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button className="btn-gold" type="submit" disabled={busy} style={{ width: '100%', justifyContent: 'center', marginTop: '1.1rem' }}>
          {busy ? 'Signing in…' : 'Enter workspace'}
        </button>
      </form>
    </div>
  )
}
