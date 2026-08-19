export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

export function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-NG', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDateTime(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString('en-NG', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function greeting(now = new Date()) {
  const h = now.getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export function todayLabel(now = new Date()) {
  return now.toLocaleDateString('en-NG', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function daysUntilBirthday(mmdd, now = new Date()) {
  if (!mmdd) return null
  const [m, d] = mmdd.split('-').map(Number)
  if (!m || !d) return null
  const year = now.getFullYear()
  let next = new Date(year, m - 1, d)
  const today = new Date(year, now.getMonth(), now.getDate())
  if (next < today) next = new Date(year + 1, m - 1, d)
  return Math.round((next - today) / 86400000)
}

export function birthdayLabel(mmdd) {
  if (!mmdd) return ''
  const [m, d] = mmdd.split('-').map(Number)
  return new Date(2026, m - 1, d).toLocaleDateString('en-NG', {
    month: 'short',
    day: 'numeric',
  })
}

export function whatsappNumber(phone = '') {
  return phone.replace(/[^\d]/g, '').replace(/^0/, '234')
}

export function startOfDay(now = new Date()) {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

export function daysUntil(dateStr, now = new Date()) {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return null
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  return Math.round((target - startOfDay(now)) / 86400000)
}

export function isToday(dateStr, now = new Date()) {
  return daysUntil(dateStr, now) === 0
}

export function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`
}
