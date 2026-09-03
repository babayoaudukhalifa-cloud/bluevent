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
  const first = String(phone).split(/[/,;|]/)[0] || ''
  const digits = first.replace(/[^\d]/g, '')
  if (!digits) return ''
  if (digits.startsWith('234')) return digits
  if (digits.startsWith('0')) return `234${digits.slice(1)}`
  if (digits.length === 10) return `234${digits}`
  return digits
}

export function displayPhone(phone = '') {
  const parts = String(phone).split(/\s*[/|,;]\s*/).filter(Boolean)
  if (parts.length > 1) return parts.map((part) => displayPhone(part)).join(' / ')
  const num = whatsappNumber(phone)
  if (!num) return ''
  if (num.startsWith('234')) return `+${num}`
  return `+${num}`
}

const TITLES = {
  mr: 'Mr.',
  mrs: 'Mrs.',
  ms: 'Ms.',
  miss: 'Miss',
  dr: 'Dr.',
  prof: 'Prof.',
  engr: 'Engr.',
  mallam: 'Mallam',
  alhaji: 'Alhaji',
  alh: 'Alhaji',
  chief: 'Chief',
  sir: 'Sir',
}

export function letterSalutation(fullName = '') {
  const parts = String(fullName)
    .replace(/[\u200e\u200f]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (!parts.length) return 'Dear colleague'

  const isTitle = (word) => Boolean(TITLES[word.replace(/\./g, '').toLowerCase()])
  const titleWord = parts.find(isTitle)
  const rest = parts.filter((word) => !isTitle(word))
  const first = rest[0]
  const last = rest[rest.length - 1]

  if (titleWord && last) {
    const title = TITLES[titleWord.replace(/\./g, '').toLowerCase()]
    return `Dear ${title} ${last}`
  }
  return `Dear ${first || 'colleague'}`
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
