export function seedStaff() {
  return [
    { id: 'stf_amara', name: 'Amara Okafor', role: 'Senior Software Engineer', department: 'Engineering', years: 6, email: 'amara.okafor@blumentechnologies.com', phone: '+234 803 441 2290', birthday: '03-22', color: '#3B82F6' },
    { id: 'stf_tunde', name: 'Tunde Afolabi', role: 'DevOps Engineer', department: 'Engineering', years: 6, email: 'tunde.afolabi@blumentechnologies.com', phone: '+234 809 112 8844', birthday: '09-12', color: '#38BDF8' },
    { id: 'stf_adaeze', name: 'Adaeze Nwachukwu', role: 'Data Analyst', department: 'Engineering', years: 3, email: 'adaeze.nwachukwu@blumentechnologies.com', phone: '+234 807 991 4402', birthday: '11-04', color: '#A855F7' },
    { id: 'stf_blessing', name: 'Blessing Obi', role: 'Finance Manager', department: 'Finance', years: 7, email: 'blessing.obi@blumentechnologies.com', phone: '+234 807 890 1234', birthday: '02-14', color: '#EC4899' },
    { id: 'stf_emeka', name: 'Emeka Adeyemi', role: 'Sales Director', department: 'Sales', years: 8, email: 'emeka.adeyemi@blumentechnologies.com', phone: '+234 802 555 0192', birthday: '05-30', color: '#EF4444' },
    { id: 'stf_samuel', name: 'Samuel Adeleke', role: 'Business Development Manager', department: 'Sales', years: 6, email: 'samuel.adeleke@blumentechnologies.com', phone: '+234 814 330 7721', birthday: '07-08', color: '#F97316' },
    { id: 'stf_chidi', name: 'Chidi Nwosu', role: 'Product Manager', department: 'Product', years: 5, email: 'chidi.nwosu@blumentechnologies.com', phone: '+234 806 220 1188', birthday: '08-19', color: '#8B5CF6' },
    { id: 'stf_ngozi', name: 'Ngozi Eze', role: 'Senior Marketing Manager', department: 'Marketing', years: 4, email: 'ngozi.eze@blumentechnologies.com', phone: '+234 803 200 4411', birthday: '01-19', color: '#B45309' },
    { id: 'stf_kelechi', name: 'Kelechi Onyeka', role: 'Customer Success Lead', department: 'Support', years: 5, email: 'kelechi.onyeka@blumentechnologies.com', phone: '+234 809 776 1200', birthday: '12-02', color: '#22C55E' },
    { id: 'stf_chioma', name: 'Chioma Uche', role: 'UX Designer', department: 'Product', years: 3, email: 'chioma.uche@blumentechnologies.com', phone: '+234 802 667 3344', birthday: '08-30', color: '#7C3AED' },
    { id: 'stf_fatima', name: 'Fatima Ibrahim', role: 'HR Manager', department: 'Human Resources', years: 6, email: 'fatima.ibrahim@blumentechnologies.com', phone: '+234 803 441 8800', birthday: '04-11', color: '#10B981' },
    { id: 'stf_ibrahim', name: 'Ibrahim Musa', role: 'Legal Counsel', department: 'Legal', years: 4, email: 'ibrahim.musa@blumentechnologies.com', phone: '+234 805 119 3340', birthday: '10-21', color: '#64748B' },
  ]
}

export function seedEvents() {
  return [
    { id: 'evt_chidi_bday', staffId: 'stf_chidi', type: 'birthday', date: '2026-08-19', notes: 'Turning 34', auto: true },
    { id: 'evt_chioma_bday', staffId: 'stf_chioma', type: 'birthday', date: '2026-08-30', notes: '', auto: true },
    { id: 'evt_tunde_bday', staffId: 'stf_tunde', type: 'birthday', date: '2026-09-12', notes: '', auto: true },
    { id: 'evt_ngozi_promo', staffId: 'stf_ngozi', type: 'promotion', date: '2026-08-10', notes: 'Promoted to Senior Marketing Manager', auto: false },
    { id: 'evt_kelechi_wed', staffId: 'stf_kelechi', type: 'wedding', date: '2026-08-05', notes: '', auto: false },
    { id: 'evt_emeka_home', staffId: 'stf_emeka', type: 'new_home', date: '2026-08-01', notes: 'Bought a 4-bedroom duplex in Lekki', auto: false },
    { id: 'evt_tunde_bereave', staffId: 'stf_tunde', type: 'bereavement', date: '2026-07-28', notes: 'Lost his beloved mother', auto: false },
    { id: 'evt_amara_anniv', staffId: 'stf_amara', type: 'work_anniversary', date: '2026-06-01', notes: '5 years with Blumen Technologies', auto: false },
    { id: 'evt_adaeze_car', staffId: 'stf_adaeze', type: 'new_car', date: '2026-08-15', notes: 'Brand new Toyota Camry', auto: false },
  ]
}

export function seedSends() {
  return [
    { id: 'snd_1', staffId: 'stf_ngozi', type: 'promotion', channels: ['whatsapp', 'email'], status: 'delivered', sentAt: '2026-08-10T09:00:00' },
    { id: 'snd_2', staffId: 'stf_kelechi', type: 'wedding', channels: ['whatsapp', 'email'], status: 'delivered', sentAt: '2026-08-05T09:00:00' },
    { id: 'snd_3', staffId: 'stf_emeka', type: 'new_home', channels: ['email'], status: 'delivered', sentAt: '2026-08-01T09:00:00' },
    { id: 'snd_4', staffId: 'stf_tunde', type: 'bereavement', channels: ['whatsapp'], status: 'delivered', sentAt: '2026-07-28T09:00:00' },
    { id: 'snd_5', staffId: 'stf_amara', type: 'work_anniversary', channels: ['email'], status: 'delivered', sentAt: '2026-06-01T09:00:00' },
    { id: 'snd_6', staffId: 'stf_adaeze', type: 'new_car', channels: ['whatsapp'], status: 'delivered', sentAt: '2026-08-15T09:00:00' },
  ]
}

export function seedSettings() {
  return {
    ceoName: 'Dr. Yunusa Garba Muhammed',
    ceoTitle: 'Chief Executive Officer',
    ceoEmail: 'yunusa@blumentechnologies.com',
    replyTo: 'office@blumentechnologies.com',
    ccHr: 'hr@blumentechnologies.com',
    autoSend: true,
    reminder3Day: true,
    weeklySummary: true,
    notifyCeo: true,
  }
}
