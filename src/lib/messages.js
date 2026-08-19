import { ASSETS, CEO, COMPANY } from './constants'

export function occasionCopy(occasion, staff, extra = '') {
  const first = (staff?.name || 'colleague').split(' ')[0]
  const company = COMPANY.name
  const extras = extra ? `\n\n${extra}` : ''

  const map = {
    birthday: `Dear ${first},\n\nOn behalf of everyone at ${company}, I wish you a joyful birthday. Thank you for the energy, care, and excellence you bring to our team. May the year ahead bring you good health, growth, and every success you are working toward.${extras}`,
    wedding: `Dear ${first},\n\nWarm congratulations on your wedding. May your new home be filled with peace, laughter, and lasting love. The entire ${company} family celebrates this beautiful season with you.${extras}`,
    promotion: `Dear ${first},\n\nCongratulations on your well-deserved promotion. Your work, leadership, and consistency continue to raise the standard at ${company}. We are proud of you and excited for this next chapter.${extras}`,
    new_home: `Dear ${first},\n\nCongratulations on your new home. May it be a place of rest, welcome, and blessing for you and your family. We celebrate this milestone with you.${extras}`,
    new_car: `Dear ${first},\n\nCongratulations on your new car. Wishing you safe journeys and many good miles ahead. The team at ${company} shares in your joy.${extras}`,
    new_baby: `Dear ${first},\n\nHeartfelt congratulations on the arrival of your baby. May your family be blessed with health, peace, and overflowing joy. We celebrate with you.${extras}`,
    bereavement: `Dear ${first},\n\nI am deeply sorry for your loss. Please know that you and your family are in our thoughts, and that ${company} stands with you during this time. May you find comfort and strength in the days ahead.${extras}`,
    work_anniversary: `Dear ${first},\n\nThank you for your years of service to ${company}. Your contribution has helped shape the company we are becoming. We are grateful for you and look forward to many more years together.${extras}`,
  }

  return map[occasion] || `Dear ${first},\n\nWith warm regards from ${company}.${extras}`
}

export function cardHtml({ occasionLabel, body, settings }) {
  const ceoName = settings?.ceoName || CEO.name
  const ceoTitle = settings?.ceoTitle || CEO.title
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const logo = `${origin}${ASSETS.logo}`
  const photo = `${origin}${ASSETS.ceo}`
  const text = (body || '').replace(/\n/g, '<br/>')

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${occasionLabel || 'Message'} from ${ceoName}</title>
</head>
<body style="margin:0;padding:24px;background:#070f1c;font-family:Georgia,serif;color:#f4f7fb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#0d1b2a;border:1px solid #234;border-radius:18px;overflow:hidden;">
    <tr>
      <td style="padding:28px 28px 12px;text-align:center;background:#070f1c;">
        <img src="${logo}" alt="Blumen Technologies" width="96" height="96" style="width:96px;height:96px;object-fit:contain;background:#000;border-radius:20px;padding:8px;display:block;margin:0 auto;" />
      </td>
    </tr>
    <tr>
      <td style="padding:8px 28px 0;text-align:center;">
        <img src="${photo}" alt="${ceoName}" width="148" height="148" style="width:148px;height:148px;border-radius:50%;object-fit:cover;border:3px solid #e4c15a;" />
        <p style="margin:12px 0 0;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#e4c15a;">From the office of the CEO</p>
        <h2 style="margin:6px 0 0;font-size:22px;color:#fff;">${ceoName}</h2>
        <p style="margin:4px 0 0;color:#9bb4c8;font-size:13px;">${ceoTitle}</p>
      </td>
    </tr>
    <tr>
      <td style="padding:22px 32px 12px;font-size:15px;line-height:1.7;color:#e8eef4;">
        ${text}
      </td>
    </tr>
    <tr>
      <td style="padding:8px 32px 28px;color:#c9d6e0;font-size:14px;line-height:1.6;">
        Warm regards,<br/>
        <strong style="color:#fff;">${ceoName}</strong><br/>
        ${ceoTitle}<br/>
        Blumen Technologies
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function plainMessage({ body, settings }) {
  const ceoName = settings?.ceoName || CEO.name
  const ceoTitle = settings?.ceoTitle || CEO.title
  return [
    `Blumen Technologies`,
    `From the office of ${ceoName}`,
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
