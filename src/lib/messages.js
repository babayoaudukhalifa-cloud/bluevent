import { ASSETS, CEO, COMPANY } from './constants'
import { letterSalutation } from './format'

export function occasionCopy(occasion, staff, extra = '', customOccasions = []) {
  const greeting = letterSalutation(staff?.name)
  const company = COMPANY.name
  const extras = extra ? `\n\n${extra}` : ''

  const map = {
    welcome: `${greeting},\n\nWelcome to ${company}. We are glad to have you on the team, and we look forward to the skill, character, and energy you will bring. May this be the start of a fruitful and fulfilling journey with us.${extras}`,
    confirmation: `${greeting},\n\nCongratulations on your confirmation of appointment. Your work, reliability, and growth have earned this recognition. We are proud to have you as a confirmed member of the ${company} family.${extras}`,
    promotion: `${greeting},\n\nCongratulations on your well-deserved promotion. Your work, leadership, and consistency continue to raise the standard at ${company}. We are proud of you and excited for this next chapter.${extras}`,
    recognition: `${greeting},\n\nOn behalf of ${company}, I commend you for your outstanding contribution. Your excellence has been noticed, and we are proud to recognise you. Thank you for raising the bar for us all.${extras}`,
    work_anniversary: `${greeting},\n\nThank you for your years of service to ${company}. Your contribution has helped shape the company we are becoming. We are grateful for you and look forward to many more years together.${extras}`,
    project_success: `${greeting},\n\nCongratulations on the successful delivery of this project. Your diligence, teamwork, and follow-through reflect the standard we hold at ${company}. Well done, and thank you.${extras}`,
    qualification: `${greeting},\n\nCongratulations on your professional qualification. This achievement speaks to your discipline and commitment to growth. ${company} is proud of you and looks forward to the value this will add to your work.${extras}`,
    graduation: `${greeting},\n\nCongratulations on your graduation. Your hard work and perseverance have paid off, and the entire ${company} family celebrates this academic milestone with you.${extras}`,
    farewell: `${greeting},\n\nAs you take your leave from ${company}, I thank you for the contribution you have made during your time with us. You go with our respect, our good wishes, and an open door. May the next chapter be fruitful and fulfilling.${extras}`,
    retirement: `${greeting},\n\nOn behalf of everyone at ${company}, I thank you for your years of dedicated service. You have given much, and you leave a mark on this organisation. May retirement bring you rest, health, and joy with those you love.${extras}`,
    birthday: `${greeting},\n\nOn behalf of everyone at ${company}, I wish you a joyful birthday. Thank you for the energy, care, and excellence you bring to our team. May the year ahead bring you good health, growth, and every success you are working toward.${extras}`,
    engagement: `${greeting},\n\nWarm congratulations on your engagement. May this season of promise be filled with joy, and may the home you are preparing be blessed. The ${company} family celebrates with you.${extras}`,
    traditional_marriage: `${greeting},\n\nCongratulations on your traditional marriage. May this union be blessed with peace, understanding, and lasting love. We at ${company} share in your joy.${extras}`,
    wedding: `${greeting},\n\nWarm congratulations on your wedding. May your new home be filled with peace, laughter, and lasting love. The entire ${company} family celebrates this beautiful season with you.${extras}`,
    wedding_anniversary: `${greeting},\n\nCongratulations on your wedding anniversary. May your home continue to be blessed with love, patience, and joy. We celebrate this milestone with you.${extras}`,
    new_baby: `${greeting},\n\nHeartfelt congratulations on the arrival of your baby. May your family be blessed with health, peace, and overflowing joy. We celebrate with you.${extras}`,
    naming_ceremony: `${greeting},\n\nCongratulations on the naming of your child. May the name be a blessing, and may the child grow in health, wisdom, and peace. The ${company} family shares in your joy.${extras}`,
    new_home: `${greeting},\n\nCongratulations on your new home. May it be a place of rest, welcome, and blessing for you and your family. We celebrate this milestone with you.${extras}`,
    new_car: `${greeting},\n\nCongratulations on your new car. Wishing you safe journeys and many good miles ahead. The team at ${company} shares in your joy.${extras}`,
    get_well: `${greeting},\n\nI am sorry to hear that you are unwell. Please take the time you need to rest and recover. You are in our thoughts, and everyone at ${company} wishes you a swift return to full health.${extras}`,
    illness: `${greeting},\n\nI am sorry to hear that a loved one is unwell. Please know that you and your family are in our thoughts and prayers. The entire ${company} team stands with you, and we hope for a swift recovery and peace in the days ahead.${extras}`,
    bereavement: `${greeting},\n\nI am deeply sorry for your loss. Please know that you and your family are in our thoughts, and that ${company} stands with you during this time. May you find comfort and strength in the days ahead.${extras}`,
    eid: `${greeting},\n\nEid Mubarak. On behalf of ${company}, I wish you and your family a blessed celebration filled with peace, gratitude, and joy. May this season bring you reward and renewed strength.${extras}`,
    christmas: `${greeting},\n\nMerry Christmas. On behalf of everyone at ${company}, I wish you and your family a peaceful and joyful celebration. May the season bring rest, hope, and every blessing.${extras}`,
    new_year: `${greeting},\n\nHappy New Year. Thank you for all you contributed in the year gone by. May the year ahead bring you good health, progress, and success, and may ${company} continue to grow with you.${extras}`,
    hajj: `${greeting},\n\nCongratulations on the successful completion of your pilgrimage. May your prayers be accepted, and may the blessings of this sacred journey abide with you and your family. We at ${company} share in your joy.${extras}`,
    traditional_title: `${greeting},\n\nCongratulations on your traditional title. This honour reflects the respect you have earned in your community. ${company} is proud of you and celebrates this recognition with you.${extras}`,
  }

  const custom = (customOccasions || []).find((item) => item.value === occasion)
  if (custom?.template) {
    const body = String(custom.template).trim()
    return body.includes('\n') ? `${body}${extras}` : `${greeting},\n\n${body}${extras}`
  }

  return map[occasion] || `${greeting},\n\nWith warm regards from ${company}.${extras}`
}

export function splitLetter(body = '') {
  const chunks = String(body).trim().split(/\n\s*\n/)
  return {
    greeting: String(chunks[0] || '').replace(/\s+/g, ' ').trim(),
    paragraphs: chunks.slice(1).map((part) => part.replace(/\s+/g, ' ').trim()).filter(Boolean),
  }
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/* Email colour / layout map — mirrors MessageCard families */
const EMAIL_THEME = {
  birthday: { bg:'#ffffff', text:'#0f1b2d', muted:'#5b6b80', accent:'#0ea5e9', logo:'left', photo:'aside' },
  promotion: { bg:'#0a0e17', text:'#ffffff', muted:'#a0a8b4', accent:'#d4af37', logo:'center', photo:'hero', exec:true },
  confirmation: { bg:'#eef1f5', text:'#0f1b2d', muted:'#5b6b80', accent:'#14b8a6', logo:'right', photo:'aside' },
  recognition: { bg:'#f4f6f9', text:'#0f1b2d', muted:'#5b6b80', accent:'#38bdf8', logo:'right', photo:'aside' },
  work_anniversary: { bg:'#0a0e17', text:'#ffffff', muted:'#a0a8b4', accent:'#d4af37', logo:'center', photo:'hero', exec:true },
  project_success: { bg:'#0a0e17', text:'#ffffff', muted:'#a0a8b4', accent:'#d4af37', logo:'center', photo:'hero', exec:true },
  qualification: { bg:'#f4f6f9', text:'#0f1b2d', muted:'#5b6b80', accent:'#38bdf8', logo:'right', photo:'aside' },
  graduation: { bg:'#f4f6f9', text:'#0f1b2d', muted:'#5b6b80', accent:'#6366f1', logo:'right', photo:'aside' },
  welcome: { bg:'#0a0e17', text:'#ffffff', muted:'#a0a8b4', accent:'#d4af37', logo:'center', photo:'hero', exec:true },
  farewell: { bg:'#152033', text:'#eef2f7', muted:'#9aa8b8', accent:'#94a3b8', logo:'left', photo:'inside' },
  retirement: { bg:'#152033', text:'#eef2f7', muted:'#9aa8b8', accent:'#c9a227', logo:'left', photo:'inside' },
  engagement: { bg:'#ffffff', text:'#0f1b2d', muted:'#5b6b80', accent:'#14b8a6', logo:'center', photo:'inside' },
  traditional_marriage: { bg:'#fffdf8', text:'#0f1b2d', muted:'#5b6b80', accent:'#14b8a6', logo:'center', photo:'inside' },
  wedding: { bg:'#ffffff', text:'#0f1b2d', muted:'#5b6b80', accent:'#14b8a6', logo:'center', photo:'inside' },
  wedding_anniversary: { bg:'#fffdf8', text:'#0f1b2d', muted:'#5b6b80', accent:'#c9a227', logo:'center', photo:'inside' },
  new_baby: { bg:'#f4fffb', text:'#0f1b2d', muted:'#5b6b80', accent:'#14b8a6', logo:'left', photo:'aside' },
  naming_ceremony: { bg:'#f4fffb', text:'#0f1b2d', muted:'#5b6b80', accent:'#14b8a6', logo:'left', photo:'aside' },
  new_home: { bg:'#f7fbf8', text:'#0f1b2d', muted:'#5b6b80', accent:'#14b8a6', logo:'left', photo:'aside' },
  new_car: { bg:'#f4f9ff', text:'#0f1b2d', muted:'#5b6b80', accent:'#0ea5e9', logo:'left', photo:'aside' },
  get_well: { bg:'#0d9488', text:'#ffffff', muted:'rgba(255,255,255,0.78)', accent:'#99f6e4', logo:'left', photo:'aside' },
  illness: { bg:'#0e7490', text:'#ffffff', muted:'rgba(255,255,255,0.78)', accent:'#67e8f9', logo:'left', photo:'aside' },
  bereavement: { bg:'#152033', text:'#eef2f7', muted:'#9aa8b8', accent:'#7dd3fc', logo:'left', photo:'inside' },
  eid: { bg:'#10261a', text:'#f7fee7', muted:'#a3b8a8', accent:'#c9a227', logo:'center', photo:'inside' },
  christmas: { bg:'#fffaf5', text:'#0f1b2d', muted:'#5b6b80', accent:'#0d9488', logo:'left', photo:'aside' },
  new_year: { bg:'#152033', text:'#eef2f7', muted:'#9aa8b8', accent:'#c9a227', logo:'left', photo:'aside' },
  hajj: { bg:'#10261a', text:'#f7fee7', muted:'#a3b8a8', accent:'#c9a227', logo:'center', photo:'inside' },
  traditional_title: { bg:'#eef1f5', text:'#0f1b2d', muted:'#5b6b80', accent:'#c9a227', logo:'right', photo:'aside' },
}

const EMAIL_DEFAULT = { bg:'#ffffff', text:'#0f1b2d', muted:'#5b6b80', accent:'#0ea5e9', logo:'left', photo:'aside' }

export function brandedEmailHtml({ body, settings, logoSrc, photoSrc, occasion }) {
  const ceoName  = settings?.ceoName  || CEO.name
  const ceoTitle = settings?.ceoTitle || CEO.title
  const t = EMAIL_THEME[occasion] || EMAIL_DEFAULT
  const { greeting, paragraphs } = splitLetter(body)
  const paras = (paragraphs.length ? paragraphs : [String(body || '').replace(greeting, '').trim()]).filter(Boolean)
    .map((p) => `<p style="margin:0 0 16px;line-height:1.9;font-size:15px;color:${t.text};font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;text-align:justify;text-justify:inter-word;text-align-last:left;hyphens:none;word-break:keep-all;">${escapeHtml(p)}</p>`)
    .join('')
  const logoAlign = t.logo === 'right' ? 'right' : t.logo === 'center' ? 'center' : 'left'
  const photoHtml = `<img src="${photoSrc}" alt="" width="64" height="64" style="width:64px;height:64px;border-radius:50%;object-fit:cover;border:3px solid ${t.accent};" />`

  if (t.exec) {
    return `<!doctype html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:28px 12px;background:#07090f;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto;background:#0a0e17;border:1px solid rgba(212,175,55,0.38);border-radius:28px;overflow:hidden;">
    <tr>
      <td style="padding:28px 32px 8px;text-align:center;">
        <img src="${logoSrc}" alt="Blumen Technologies" width="72" height="72" style="width:72px;height:72px;object-fit:contain;border-radius:16px;background:#000;padding:7px;border:1px solid rgba(212,175,55,0.28);" />
        <div style="width:118px;height:118px;margin:18px auto 0;border-radius:50%;padding:4px;background:linear-gradient(180deg,#e8c76a,#d4af37 55%,#a88420);">
          <img src="${photoSrc}" alt="${escapeHtml(ceoName)}" width="110" height="110" style="width:110px;height:110px;border-radius:50%;object-fit:cover;display:block;" />
        </div>
        <p style="margin:16px 0 0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#d4af37;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">From the office of the CEO</p>
        <h2 style="margin:8px 0 0;font-size:24px;line-height:1.25;color:#fff;font-family:Georgia,'Playfair Display',serif;font-weight:600;">${escapeHtml(ceoName)}</h2>
        <p style="margin:6px 0 0;color:#a0a8b4;font-size:13px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">${escapeHtml(ceoTitle)} · Blumen Technologies</p>
      </td>
    </tr>
    <tr><td style="padding:16px 32px 0;"><div style="height:1px;background:linear-gradient(90deg,transparent,#d4af37,transparent);"></div></td></tr>
    <tr>
      <td style="padding:20px 32px 6px;">
        <p style="margin:0 0 16px;font-size:18px;color:#fff;font-weight:600;font-family:Georgia,'Playfair Display',serif;text-align:left;">${escapeHtml(greeting)}</p>
        ${paras}
        <p style="margin:24px 0 0;font-size:13px;color:#a0a8b4;text-align:right;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5;">
          Warm regards,<br/>
          <span style="display:inline-block;margin-top:6px;font-size:16px;font-weight:700;color:#fff;font-family:Georgia,serif;">${escapeHtml(ceoName)}</span><br/>
          ${escapeHtml(ceoTitle)}<br/>Blumen Technologies
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:18px 32px 24px;text-align:center;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#d4af37;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">FCT Abuja, Nigeria</td>
    </tr>
  </table>
</body>
</html>`
  }

  return `<!doctype html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:28px 12px;background:#0b1220;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto;background:${t.bg};border-radius:28px;overflow:hidden;">
    <tr>
      <td style="padding:22px 28px 8px;text-align:${logoAlign};">
        <img src="${logoSrc}" alt="Blumen Technologies" width="32" height="32" style="width:32px;height:32px;object-fit:contain;border-radius:8px;background:#0b1220;padding:3px;vertical-align:middle;" />
        <span style="display:inline-block;vertical-align:middle;margin-left:8px;font-size:11px;letter-spacing:0.14em;font-weight:700;color:${t.text};font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">BLUMEN TECHNOLOGIES</span>
      </td>
    </tr>
    <tr>
      <td style="padding:12px 28px 8px;">
        <p style="margin:0;font-size:28px;line-height:1.2;font-family:Georgia,'Playfair Display',serif;color:${t.text};font-weight:600;text-align:left;">${escapeHtml(greeting || 'Greetings')}</p>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 28px 6px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="vertical-align:top;padding-right:${t.photo === 'aside' || t.photo === 'inside' ? '14px' : '0'};">
            ${paras}
            <p style="margin:22px 0 0;font-size:13px;color:${t.muted};font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;text-align:left;">
              Warm regards,<br/>
              <span style="display:inline-block;margin-top:6px;font-size:15px;font-weight:700;color:${t.text};font-family:Georgia,serif;">${escapeHtml(ceoName)}</span><br/>
              ${escapeHtml(ceoTitle)}<br/>Blumen Technologies
            </p>
          </td>
          ${t.photo === 'aside' || t.photo === 'inside' ? `<td style="vertical-align:top;width:72px;">${photoHtml}</td>` : ''}
        </tr></table>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 28px 22px;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:${t.muted};font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">FCT Abuja, Nigeria</td>
    </tr>
  </table>
</body>
</html>`
}

export function cardHtml({ occasionLabel, occasion, body, settings }) {
  const ceoName = settings?.ceoName || CEO.name
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return brandedEmailHtml({
    body,
    settings,
    occasion,
    logoSrc: `${origin}${ASSETS.logo}`,
    photoSrc: `${origin}${ASSETS.ceo}`,
  }).replace('<head><meta charset="utf-8" /></head>', `<head><meta charset="utf-8" /><title>${occasionLabel || 'Message'} from ${ceoName}</title></head>`)
}

export function plainMessage({ body, settings }) {
  const ceoName = settings?.ceoName || CEO.name
  const ceoTitle = settings?.ceoTitle || CEO.title
  return [
    'Blumen Technologies',
    `From the office of the CEO · ${ceoName}`,
    `${ceoTitle}`,
    '',
    body,
    '',
    'Warm regards,',
    ceoName,
    ceoTitle,
    'Blumen Technologies',
  ].join('\n')
}
