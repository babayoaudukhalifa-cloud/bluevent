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
    greeting: chunks[0] || '',
    paragraphs: chunks.slice(1).map((part) => part.replace(/\s+/g, ' ').trim()).filter(Boolean),
  }
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function brandedEmailHtml({ body, settings, logoSrc, photoSrc }) {
  const ceoName = settings?.ceoName || CEO.name
  const ceoTitle = settings?.ceoTitle || CEO.title
  const { greeting, paragraphs } = splitLetter(body)
  const paras = (paragraphs.length ? paragraphs : [String(body || '').replace(greeting, '').trim()]).filter(Boolean)
    .map((p) => `<p style="margin:0 0 16px;text-align:justify;text-justify:inter-word;line-height:1.8;font-size:15px;color:#e8eef4;">${escapeHtml(p)}</p>`)
    .join('')

  return `<!doctype html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:28px 12px;background:#07080c;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#0c121c;border:1px solid #c9a44a;border-radius:22px;overflow:hidden;">
    <tr>
      <td style="padding:32px 36px 18px;text-align:center;background:linear-gradient(180deg,#141c2c 0%,#0c121c 100%);">
        <img src="${logoSrc}" alt="Blumen Technologies" width="86" height="86" style="width:86px;height:86px;object-fit:contain;background:#000;border-radius:20px;padding:8px;border:1px solid rgba(228,193,90,0.35);" />
        <div style="width:64px;height:1px;margin:18px auto;background:linear-gradient(90deg,transparent,#e4c15a,transparent);"></div>
        <img src="${photoSrc}" alt="${escapeHtml(ceoName)}" width="132" height="132" style="width:132px;height:132px;border-radius:50%;object-fit:cover;border:3px solid #e4c15a;" />
        <p style="margin:16px 0 0;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#e4c15a;font-family:Georgia,serif;">From the office of the CEO</p>
        <h2 style="margin:8px 0 0;font-size:24px;line-height:1.25;color:#fff;font-family:Georgia,serif;font-weight:normal;">${escapeHtml(ceoName)}</h2>
        <p style="margin:6px 0 0;color:#b7c6d6;font-size:13px;">${escapeHtml(ceoTitle)} · Blumen Technologies</p>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 40px 6px;">
        <div style="width:100%;height:1px;background:linear-gradient(90deg,transparent,#e4c15a,transparent);"></div>
      </td>
    </tr>
    <tr>
      <td style="padding:22px 40px 8px;font-family:Georgia,serif;color:#f4f7fb;">
        <p style="margin:0 0 16px;text-align:left;font-size:18px;color:#fff;">${escapeHtml(greeting)}</p>
        ${paras}
        <p style="margin:28px 0 0;text-align:right;line-height:1.65;color:#d5deea;font-size:14px;">
          Warm regards,<br/>
          <span style="display:inline-block;margin-top:8px;font-size:17px;color:#fff;">${escapeHtml(ceoName)}</span><br/>
          ${escapeHtml(ceoTitle)}<br/>
          Blumen Technologies
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 40px 28px;text-align:center;">
        <p style="margin:0;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#e4c15a;">FCT Abuja, Nigeria</p>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function cardHtml({ occasionLabel, body, settings }) {
  const ceoName = settings?.ceoName || CEO.name
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return brandedEmailHtml({
    body,
    settings,
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
