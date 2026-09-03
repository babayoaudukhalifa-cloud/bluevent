import { DEPARTMENTS } from './constants'
import { isSupabaseConfigured, supabase } from './supabase'
import { seedEvents, seedSends, seedSettings, seedStaff } from './seed'

export const usingCloud = isSupabaseConfigured && Boolean(supabase)

function nameKey(name = '') {
  return String(name)
    .toLowerCase()
    .replace(/^(mr|mrs|ms|miss|dr)\.?\s+/g, '')
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

const OLD_DEMO_EMAILS = [
  'amara.okafor@blumentechnologies.com',
  'tunde.afolabi@blumentechnologies.com',
  'adaeze.nwachukwu@blumentechnologies.com',
  'blessing.obi@blumentechnologies.com',
  'emeka.adeyemi@blumentechnologies.com',
  'samuel.adeleke@blumentechnologies.com',
  'chidi.nwosu@blumentechnologies.com',
  'ngozi.eze@blumentechnologies.com',
  'kelechi.onyeka@blumentechnologies.com',
  'chioma.uche@blumentechnologies.com',
  'fatima.ibrahim@blumentechnologies.com',
  'ibrahim.musa@blumentechnologies.com',
]

export function looksLikeOldDemo(staff = []) {
  return staff.some((s) => OLD_DEMO_EMAILS.includes(String(s.email || '').toLowerCase()))
}

export function needsStaffSync(staff = []) {
  if (looksLikeOldDemo(staff)) return true
  const allowed = new Set(DEPARTMENTS)
  return staff.some((s) => s.department && !allowed.has(s.department))
}

export async function mergeMissingSeedStaff(data) {
  const existing = data?.staff || []
  const have = new Set(existing.map((person) => nameKey(person.name)))
  const missing = seedStaff().filter((person) => !have.has(nameKey(person.name)))
  if (!missing.length) return data

  let inserted = await supabase.from('staff').insert(
    missing.map((person) => ({
      full_name: person.name,
      job_title: person.role || '',
      department: person.department || '',
      years: Number(person.years) || 0,
      email: person.email || null,
      staff_code: person.staffCode || '',
      professional: person.professional || '',
      education: person.education || '',
      specialization: person.specialization || '',
      phone: person.phone || '',
      birthday: person.birthday || '',
      color: person.color,
    })),
  ).select()

  if (inserted.error) {
    inserted = await supabase.from('staff').insert(
      missing.map((person) => ({
        full_name: person.name,
        job_title: person.role || '',
        department: person.department || '',
        years: Number(person.years) || 0,
        email: person.email || null,
        phone: person.phone || '',
        birthday: person.birthday || '',
        color: person.color,
      })),
    ).select()
  }
  if (inserted.error) throw inserted.error

  return {
    ...data,
    staff: [...existing, ...(inserted.data || []).map(mapStaff)],
  }
}

async function syncDepartments() {
  const rows = DEPARTMENTS.map((name, sort_order) => ({ name, sort_order: sort_order + 1 }))
  const { error } = await supabase.from('departments').upsert(rows)
  if (error) return
}

function staffPayload(person, includeRegisterFields) {
  const row = {
    full_name: person.name,
    job_title: person.role || '',
    department: person.department || '',
    years: Number(person.years) || 0,
    email: person.email || null,
    phone: person.phone || '',
    birthday: person.birthday || '',
    color: person.color,
  }
  if (includeRegisterFields) {
    row.staff_code = person.staffCode || ''
    row.professional = person.professional || ''
    row.education = person.education || ''
    row.specialization = person.specialization || ''
  }
  return row
}

function staffRows(includeRegisterFields) {
  return seedStaff().map((person) => staffPayload(person, includeRegisterFields))
}

export async function applyStaffRegister(existing = []) {
  await syncDepartments()
  const haveByName = new Map((existing || []).map((person) => [nameKey(person.name), person]))
  const haveByEmail = new Map(
    (existing || [])
      .filter((person) => person.email)
      .map((person) => [String(person.email).toLowerCase(), person]),
  )
  const missing = []

  for (const person of seedStaff()) {
    const current = (person.email && haveByEmail.get(String(person.email).toLowerCase()))
      || haveByName.get(nameKey(person.name))
    if (!current) {
      missing.push(person)
      continue
    }
    let updated = await supabase.from('staff').update(staffPayload(person, true)).eq('id', current.id)
    if (updated.error) {
      updated = await supabase.from('staff').update(staffPayload(person, false)).eq('id', current.id)
    }
    if (updated.error) continue
  }

  if (missing.length) {
    let inserted = await supabase.from('staff').insert(missing.map((person) => staffPayload(person, true)))
    if (inserted.error) {
      inserted = await supabase.from('staff').insert(missing.map((person) => staffPayload(person, false)))
    }
  }

  return loadCloud()
}

async function clearStaffTables() {
  const sends = await supabase.from('card_sends').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (sends.error) throw sends.error
  const events = await supabase.from('staff_events').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (events.error) throw events.error
  const staff = await supabase.from('staff').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (staff.error) throw staff.error
}

export async function replaceStaffDirectory() {
  await clearStaffTables()
  await syncDepartments()
  let inserted = await supabase.from('staff').insert(staffRows(true)).select()
  if (inserted.error) {
    inserted = await supabase.from('staff').insert(staffRows(false)).select()
  }
  if (inserted.error) throw inserted.error
  return loadCloud()
}

function mapStaff(row) {
  return {
    id: row.id,
    name: row.full_name,
    role: row.job_title || '',
    department: row.department || '',
    years: row.years || 0,
    email: row.email || '',
    staffCode: row.staff_code || '',
    professional: row.professional || '',
    education: row.education || '',
    specialization: row.specialization || '',
    phone: row.phone || '',
    birthday: row.birthday || '',
    color: row.color || '#3B82F6',
  }
}

function mapEvent(row) {
  return {
    id: row.id,
    staffId: row.staff_id,
    type: row.type,
    date: row.event_date,
    notes: row.notes || '',
    auto: row.auto !== false,
  }
}

function mapSend(row) {
  return {
    id: row.id,
    staffId: row.staff_id,
    type: row.type,
    channels: row.channels || [],
    body: row.body || '',
    status: row.status || 'delivered',
    sentAt: row.sent_at,
  }
}

function mapSettings(row) {
  if (!row) return seedSettings()
  return {
    ceoName: row.ceo_name,
    ceoTitle: row.ceo_title,
    ceoEmail: row.ceo_email,
    replyTo: row.reply_to,
    ccHr: row.cc_hr,
    autoSend: row.auto_send,
    reminder3Day: row.reminder_3_day,
    weeklySummary: row.weekly_summary,
    notifyCeo: row.notify_ceo,
    customOccasions: Array.isArray(row.custom_occasions) ? row.custom_occasions : [],
  }
}

function resolveDepartments(rows = [], staff = []) {
  const fromTable = (rows || []).map((row) => row.name).filter(Boolean)
  const fromStaff = [...new Set(staff.map((person) => person.department).filter(Boolean))]
  const extra = fromStaff.filter((name) => !DEPARTMENTS.includes(name) && !fromTable.includes(name))
  if (fromTable.length) return [...fromTable, ...extra]
  return [...DEPARTMENTS, ...extra.filter((name) => !DEPARTMENTS.includes(name))]
}

export async function loadCloud() {
  const [staffRes, eventsRes, sendsRes, settingsRes, deptRes] = await Promise.all([
    supabase.from('staff').select('*').order('full_name'),
    supabase.from('staff_events').select('*').order('event_date', { ascending: false }),
    supabase.from('card_sends').select('*').order('sent_at', { ascending: false }),
    supabase.from('app_settings').select('*').eq('id', 1).maybeSingle(),
    supabase.from('departments').select('name, sort_order').order('sort_order'),
  ])

  if (staffRes.error) throw staffRes.error
  if (eventsRes.error) throw eventsRes.error
  if (sendsRes.error) throw sendsRes.error

  const staff = (staffRes.data || []).map(mapStaff)
  return {
    staff,
    events: (eventsRes.data || []).map(mapEvent),
    sends: (sendsRes.data || []).map(mapSend),
    settings: mapSettings(settingsRes.data),
    departments: resolveDepartments(deptRes.data, staff),
  }
}

export async function insertStaff(person) {
  const { data, error } = await supabase
    .from('staff')
    .insert({
      full_name: person.name,
      job_title: person.role || '',
      department: person.department || '',
      years: Number(person.years) || 0,
      email: person.email || null,
      staff_code: person.staffCode || '',
      professional: person.professional || '',
      education: person.education || '',
      specialization: person.specialization || '',
      phone: person.phone || '',
      birthday: person.birthday || '',
      color: person.color,
    })
    .select()
    .single()
  if (error) throw error
  return mapStaff(data)
}

export async function updateStaff(person) {
  const payload = staffPayload(person, true)
  let result = await supabase.from('staff').update(payload).eq('id', person.id).select().single()
  if (result.error) {
    result = await supabase.from('staff').update(staffPayload(person, false)).eq('id', person.id).select().single()
  }
  if (result.error) throw result.error
  return mapStaff(result.data)
}

export async function insertEvent(event) {
  const { data, error } = await supabase
    .from('staff_events')
    .insert({
      staff_id: event.staffId,
      type: event.type,
      event_date: event.date,
      notes: event.notes || '',
      auto: event.auto !== false,
    })
    .select()
    .single()
  if (error) throw error
  return mapEvent(data)
}

export async function deleteStaff(id) {
  const { error } = await supabase.from('staff').delete().eq('id', id)
  if (error) throw error
}

export async function deleteSend(id) {
  const { error } = await supabase.from('card_sends').delete().eq('id', id)
  if (error) throw error
}

export async function insertSend(send) {
  const { data, error } = await supabase
    .from('card_sends')
    .insert({
      staff_id: send.staffId,
      type: send.type,
      channels: send.channels || [],
      body: send.body || '',
      status: send.status || 'delivered',
    })
    .select()
    .single()
  if (error) throw error
  return mapSend(data)
}

export async function saveSettings(settings, { requireCustomOccasions = false } = {}) {
  const payload = {
    id: 1,
    ceo_name: settings.ceoName,
    ceo_title: settings.ceoTitle,
    ceo_email: settings.ceoEmail,
    reply_to: settings.replyTo,
    cc_hr: settings.ccHr,
    auto_send: settings.autoSend,
    reminder_3_day: settings.reminder3Day,
    weekly_summary: settings.weeklySummary,
    notify_ceo: settings.notifyCeo,
    custom_occasions: settings.customOccasions || [],
  }
  let { error } = await supabase.from('app_settings').upsert(payload)
  if (error && /custom_occasions/i.test(error.message || '')) {
    if (requireCustomOccasions) {
      throw new Error('Run the custom_occasions SQL in Supabase first, then add the occasion again.')
    }
    delete payload.custom_occasions
    const retry = await supabase.from('app_settings').upsert(payload)
    error = retry.error
  }
  if (error) throw error
}

export function localFallback() {
  const staff = seedStaff()
  return {
    staff,
    events: seedEvents(),
    sends: seedSends(),
    settings: seedSettings(),
    departments: resolveDepartments([], staff),
  }
}
