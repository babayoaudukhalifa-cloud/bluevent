import { isSupabaseConfigured, supabase } from './supabase'
import { seedEvents, seedSends, seedSettings, seedStaff } from './seed'

export const usingCloud = isSupabaseConfigured && Boolean(supabase)

function mapStaff(row) {
  return {
    id: row.id,
    name: row.full_name,
    role: row.job_title,
    department: row.department,
    years: row.years,
    email: row.email,
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
  }
}

export async function loadCloud() {
  const [staffRes, eventsRes, sendsRes, settingsRes] = await Promise.all([
    supabase.from('staff').select('*').order('full_name'),
    supabase.from('staff_events').select('*').order('event_date', { ascending: false }),
    supabase.from('card_sends').select('*').order('sent_at', { ascending: false }),
    supabase.from('app_settings').select('*').eq('id', 1).maybeSingle(),
  ])

  if (staffRes.error) throw staffRes.error
  if (eventsRes.error) throw eventsRes.error
  if (sendsRes.error) throw sendsRes.error

  return {
    staff: (staffRes.data || []).map(mapStaff),
    events: (eventsRes.data || []).map(mapEvent),
    sends: (sendsRes.data || []).map(mapSend),
    settings: mapSettings(settingsRes.data),
  }
}

export async function insertStaff(person) {
  const { data, error } = await supabase
    .from('staff')
    .insert({
      full_name: person.name,
      job_title: person.role,
      department: person.department,
      years: Number(person.years) || 0,
      email: person.email,
      phone: person.phone,
      birthday: person.birthday,
      color: person.color,
    })
    .select()
    .single()
  if (error) throw error
  return mapStaff(data)
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

export async function saveSettings(settings) {
  const { error } = await supabase.from('app_settings').upsert({
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
  })
  if (error) throw error
}

export function localFallback() {
  return {
    staff: seedStaff(),
    events: seedEvents(),
    sends: seedSends(),
    settings: seedSettings(),
  }
}
