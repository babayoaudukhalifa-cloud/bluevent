import { ASSETS, CEO, COMPANY } from '../lib/constants'
import { splitLetter } from '../lib/messages'

/**
 * Layout families from the design brief:
 *  corner  — logo top-left, small CEO portrait bottom-right
 *  aside   — logo top-right, portrait beside the letter
 *  minimal — logo top-left small, discreet portrait inside
 *  elegant — logo top-center, small portrait inside
 *  flow    — logo top-left, portrait bottom-right, flowing aqua art
 *  corp    — logo top-right, portrait beside the letter, tech lines
 */
const THEMES = {
  birthday: {
    layout: 'corner', logo: 'left', photo: 'aside', tone: 'light', deco: 'confetti',
    headline: 'Happy Birthday',
    accent: '#0ea5e9', accent2: '#14b8a6', gold: '#c9a227',
    bg: '#ffffff', text: '#0f1b2d', muted: '#5b6b80',
  },
  promotion: {
    layout: 'executive', logo: 'center', photo: 'hero', tone: 'exec', deco: 'none',
    headline: 'Congratulations on Your Promotion',
    accent: '#d4af37', accent2: '#1a2233', gold: '#d4af37',
    bg: '#0a0e17', text: '#ffffff', muted: '#a0a8b4',
  },
  confirmation: {
    layout: 'aside', logo: 'right', photo: 'aside', tone: 'navy', deco: 'stairs',
    headline: 'Appointment Confirmed',
    accent: '#14b8a6', accent2: '#1e3a5f', gold: '#c9a227',
    bg: '#eef1f5', text: '#0f1b2d', muted: '#5b6b80',
  },
  recognition: {
    layout: 'corp', logo: 'right', photo: 'aside', tone: 'navy', deco: 'circuit',
    headline: 'Outstanding Achievement',
    accent: '#38bdf8', accent2: '#1e3a5f', gold: '#c9a227',
    bg: '#f4f6f9', text: '#0f1b2d', muted: '#5b6b80',
  },
  work_anniversary: {
    layout: 'executive', logo: 'center', photo: 'hero', tone: 'exec', deco: 'none',
    headline: 'Years of Excellence',
    accent: '#d4af37', accent2: '#1a2233', gold: '#d4af37',
    bg: '#0a0e17', text: '#ffffff', muted: '#a0a8b4',
  },
  project_success: {
    layout: 'executive', logo: 'center', photo: 'hero', tone: 'exec', deco: 'none',
    headline: 'Mission Accomplished',
    accent: '#d4af37', accent2: '#1a2233', gold: '#d4af37',
    bg: '#0a0e17', text: '#ffffff', muted: '#a0a8b4',
  },
  qualification: {
    layout: 'corp', logo: 'right', photo: 'aside', tone: 'navy', deco: 'circuit',
    headline: 'Professional Achievement',
    accent: '#38bdf8', accent2: '#1e3a5f', gold: '#c9a227',
    bg: '#f4f6f9', text: '#0f1b2d', muted: '#5b6b80',
  },
  graduation: {
    layout: 'corp', logo: 'right', photo: 'aside', tone: 'navy', deco: 'circuit',
    headline: 'Congratulations, Graduate',
    accent: '#6366f1', accent2: '#1e3a5f', gold: '#c9a227',
    bg: '#f4f6f9', text: '#0f1b2d', muted: '#5b6b80',
  },
  welcome: {
    layout: 'executive', logo: 'center', photo: 'hero', tone: 'exec', deco: 'none',
    headline: 'Welcome to the Team',
    accent: '#d4af37', accent2: '#1a2233', gold: '#d4af37',
    bg: '#0a0e17', text: '#ffffff', muted: '#a0a8b4',
  },
  farewell: {
    layout: 'minimal', logo: 'left', photo: 'inside', tone: 'dark', deco: 'branch',
    headline: 'With Appreciation',
    accent: '#94a3b8', accent2: '#64748b', gold: '#c9a227',
    bg: '#152033', text: '#eef2f7', muted: '#9aa8b8',
  },
  retirement: {
    layout: 'minimal', logo: 'left', photo: 'inside', tone: 'dark', deco: 'branch',
    headline: 'A Legacy of Service',
    accent: '#c9a227', accent2: '#94a3b8', gold: '#c9a227',
    bg: '#152033', text: '#eef2f7', muted: '#9aa8b8',
  },
  engagement: {
    layout: 'elegant', logo: 'center', photo: 'inside', tone: 'light', deco: 'rings',
    headline: 'Congratulations on Your Engagement',
    accent: '#14b8a6', accent2: '#94a3b8', gold: '#c0c7d1',
    bg: '#ffffff', text: '#0f1b2d', muted: '#5b6b80',
  },
  traditional_marriage: {
    layout: 'elegant', logo: 'center', photo: 'inside', tone: 'light', deco: 'rings',
    headline: 'Congratulations on Your Union',
    accent: '#14b8a6', accent2: '#c9a227', gold: '#c0c7d1',
    bg: '#fffdf8', text: '#0f1b2d', muted: '#5b6b80',
  },
  wedding: {
    layout: 'elegant', logo: 'center', photo: 'inside', tone: 'light', deco: 'rings',
    headline: 'Congratulations on Your Wedding',
    accent: '#14b8a6', accent2: '#94a3b8', gold: '#c0c7d1',
    bg: '#ffffff', text: '#0f1b2d', muted: '#5b6b80',
  },
  wedding_anniversary: {
    layout: 'elegant', logo: 'center', photo: 'inside', tone: 'light', deco: 'rings',
    headline: 'Celebrating Your Love Story',
    accent: '#c9a227', accent2: '#14b8a6', gold: '#c9a227',
    bg: '#fffdf8', text: '#0f1b2d', muted: '#5b6b80',
  },
  new_baby: {
    layout: 'corner', logo: 'left', photo: 'aside', tone: 'light', deco: 'confetti',
    headline: 'A New Blessing',
    accent: '#14b8a6', accent2: '#0ea5e9', gold: '#c9a227',
    bg: '#f4fffb', text: '#0f1b2d', muted: '#5b6b80',
  },
  naming_ceremony: {
    layout: 'corner', logo: 'left', photo: 'aside', tone: 'light', deco: 'confetti',
    headline: 'May the Name Be a Blessing',
    accent: '#14b8a6', accent2: '#0ea5e9', gold: '#c9a227',
    bg: '#f4fffb', text: '#0f1b2d', muted: '#5b6b80',
  },
  new_home: {
    layout: 'corner', logo: 'left', photo: 'aside', tone: 'light', deco: 'circuit',
    headline: 'Welcome Home',
    accent: '#14b8a6', accent2: '#0ea5e9', gold: '#c9a227',
    bg: '#f7fbf8', text: '#0f1b2d', muted: '#5b6b80',
  },
  new_car: {
    layout: 'corner', logo: 'left', photo: 'aside', tone: 'light', deco: 'circuit',
    headline: 'Safe Journeys Ahead',
    accent: '#0ea5e9', accent2: '#14b8a6', gold: '#c9a227',
    bg: '#f4f9ff', text: '#0f1b2d', muted: '#5b6b80',
  },
  get_well: {
    layout: 'flow', logo: 'left', photo: 'aside', tone: 'aqua', deco: 'heart',
    headline: 'Wishing You a Speedy Recovery',
    accent: '#2dd4bf', accent2: '#0ea5e9', gold: '#ffffff',
    bg: '#0d9488', text: '#ffffff', muted: 'rgba(255,255,255,0.78)',
  },
  illness: {
    layout: 'flow', logo: 'left', photo: 'aside', tone: 'aqua', deco: 'heart',
    headline: 'You Are in Our Thoughts',
    accent: '#67e8f9', accent2: '#2dd4bf', gold: '#ffffff',
    bg: '#0e7490', text: '#ffffff', muted: 'rgba(255,255,255,0.78)',
  },
  bereavement: {
    layout: 'minimal', logo: 'left', photo: 'inside', tone: 'dark', deco: 'branch',
    headline: 'With Deepest Sympathy',
    accent: '#7dd3fc', accent2: '#64748b', gold: '#94a3b8',
    bg: '#152033', text: '#eef2f7', muted: '#9aa8b8',
  },
  eid: {
    layout: 'elegant', logo: 'center', photo: 'inside', tone: 'dark', deco: 'circuit',
    headline: 'Eid Mubarak',
    accent: '#c9a227', accent2: '#14b8a6', gold: '#c9a227',
    bg: '#10261a', text: '#f7fee7', muted: '#a3b8a8',
  },
  christmas: {
    layout: 'corner', logo: 'left', photo: 'aside', tone: 'light', deco: 'confetti',
    headline: 'Merry Christmas',
    accent: '#0d9488', accent2: '#dc2626', gold: '#c9a227',
    bg: '#fffaf5', text: '#0f1b2d', muted: '#5b6b80',
  },
  new_year: {
    layout: 'corner', logo: 'left', photo: 'aside', tone: 'navy', deco: 'confetti',
    headline: 'Happy New Year',
    accent: '#c9a227', accent2: '#0ea5e9', gold: '#c9a227',
    bg: '#152033', text: '#eef2f7', muted: '#9aa8b8',
  },
  hajj: {
    layout: 'elegant', logo: 'center', photo: 'inside', tone: 'dark', deco: 'circuit',
    headline: 'Hajj Mabrour',
    accent: '#c9a227', accent2: '#14b8a6', gold: '#c9a227',
    bg: '#10261a', text: '#f7fee7', muted: '#a3b8a8',
  },
  traditional_title: {
    layout: 'aside', logo: 'right', photo: 'aside', tone: 'navy', deco: 'stairs',
    headline: 'Congratulations on Your Title',
    accent: '#c9a227', accent2: '#1e3a5f', gold: '#c9a227',
    bg: '#eef1f5', text: '#0f1b2d', muted: '#5b6b80',
  },
}

const DEFAULT_THEME = {
  layout: 'corner', logo: 'left', photo: 'aside', tone: 'light', deco: 'circuit',
  headline: 'Greetings from Blumen',
  accent: '#0ea5e9', accent2: '#14b8a6', gold: '#c9a227',
  bg: '#ffffff', text: '#0f1b2d', muted: '#5b6b80',
}

function Confetti({ a, b, g }) {
  const bits = [
    [28, 90, 10, 10, a, 18], [70, 150, 8, 8, b, -12], [320, 70, 12, 12, a, 24],
    [360, 180, 7, 7, b, 8], [40, 280, 9, 9, a, -20], [300, 260, 11, 8, g, 16],
    [90, 380, 8, 8, b, 10], [340, 420, 10, 10, a, -14], [50, 500, 7, 7, b, 22],
    [250, 80, 6, 14, a, 40], [180, 520, 12, 6, b, -8], [370, 540, 8, 8, a, 6],
    [140, 60, 5, 5, g, 0], [220, 200, 9, 5, a, 30], [16, 430, 6, 11, b, -25],
  ]
  return (
    <svg className="mc-art-svg" viewBox="0 0 400 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="burst" cx="88%" cy="8%" r="42%">
          <stop offset="0%" stopColor={a} stopOpacity="0.22" />
          <stop offset="100%" stopColor={a} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="640" fill="url(#burst)" />
      {bits.map(([x, y, w, h, fill, rot], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="2" fill={fill} opacity="0.72" transform={`rotate(${rot} ${x + w / 2} ${y + h / 2})`} />
      ))}
    </svg>
  )
}

function Stairs({ a, b, g }) {
  const steps = [
    [20, 520, 70, 90, b],
    [92, 460, 74, 150, a],
    [168, 390, 78, 220, b],
    [248, 310, 82, 300, '#1e3a5f'],
    [332, 230, 86, 380, g],
  ]
  return (
    <svg className="mc-art-svg" viewBox="0 0 400 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {steps.map(([x, y, w, h, fill], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="8" fill={fill} opacity={i === steps.length - 1 ? 0.95 : 0.82} />
      ))}
      <path d="M90 500 L130 470 L170 430 L250 350 L340 270" fill="none" stroke={a} strokeWidth="1.4" opacity="0.55" />
      <circle cx="340" cy="270" r="4" fill={g} />
    </svg>
  )
}

function Branch({ a }) {
  return (
    <svg className="mc-art-svg" viewBox="0 0 400 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none" stroke={a} strokeWidth="1.15" opacity="0.45" strokeLinecap="round">
        <path d="M250 640 C270 560, 300 500, 340 430 C360 390, 380 360, 400 330" />
        <path d="M300 520 C320 500, 350 490, 380 470" />
        <path d="M320 470 C340 450, 360 430, 385 400" />
        <path d="M280 570 C300 555, 330 548, 360 530" />
      </g>
      <g fill={a} opacity="0.28">
        <ellipse cx="372" cy="468" rx="7" ry="12" transform="rotate(28 372 468)" />
        <ellipse cx="348" cy="432" rx="6" ry="11" transform="rotate(-18 348 432)" />
        <ellipse cx="386" cy="398" rx="6" ry="10" transform="rotate(40 386 398)" />
        <ellipse cx="338" cy="548" rx="7" ry="12" transform="rotate(12 338 548)" />
      </g>
    </svg>
  )
}

function Rings({ a, s }) {
  return (
    <svg className="mc-art-svg" viewBox="0 0 400 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="silk" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={a} stopOpacity="0.12" />
          <stop offset="100%" stopColor={s} stopOpacity="0.06" />
        </linearGradient>
      </defs>
      <path d="M-40 180 C80 80, 220 260, 460 120" fill="none" stroke={a} strokeWidth="48" opacity="0.08" />
      <path d="M-20 340 C140 240, 260 420, 460 280" fill="none" stroke={s} strokeWidth="64" opacity="0.07" />
      <circle cx="292" cy="430" r="78" fill="none" stroke={s} strokeWidth="10" opacity="0.85" />
      <circle cx="348" cy="448" r="78" fill="none" stroke={a} strokeWidth="10" opacity="0.9" />
      <circle cx="348" cy="448" r="68" fill="none" stroke={a} strokeWidth="1" opacity="0.35" strokeDasharray="4 6" />
    </svg>
  )
}

function Heart({ a }) {
  return (
    <svg className="mc-art-svg" viewBox="0 0 400 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path d="M-30 80 C80 20, 200 180, 460 40" fill="none" stroke="#fff" strokeWidth="90" opacity="0.08" />
      <path d="M-20 260 C120 160, 240 340, 460 220" fill="none" stroke="#fff" strokeWidth="70" opacity="0.07" />
      <g transform="translate(250 340)" opacity="0.9">
        <path
          d="M60 28 C60 8, 88 -8, 110 12 C132 -8, 160 8, 160 28 C160 62, 110 98, 110 98 C110 98, 60 62, 60 28 Z"
          fill="none"
          stroke={a}
          strokeWidth="2.2"
        />
        <circle cx="92" cy="30" r="2.2" fill={a} />
        <circle cx="128" cy="26" r="2.2" fill={a} />
        <circle cx="110" cy="58" r="2.2" fill={a} />
        <path d="M92 30 L110 42 L128 26 M110 42 L110 72" fill="none" stroke={a} strokeWidth="1.1" opacity="0.7" />
      </g>
      <circle cx="80" cy="200" r="5" fill="#fff" opacity="0.25" />
      <circle cx="340" cy="160" r="7" fill="#fff" opacity="0.18" />
      <circle cx="60" cy="480" r="4" fill="#fff" opacity="0.22" />
    </svg>
  )
}

function Circuit({ a }) {
  return (
    <svg className="mc-art-svg" viewBox="0 0 400 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none" stroke={a} strokeWidth="1" opacity="0.22">
        <path d="M0 80 H400 M0 200 H400 M0 360 H400 M0 520 H400" />
        <path d="M70 0 V640 M210 0 V640 M330 0 V640" />
        <path d="M70 200 H210 V360 H330" />
        <path d="M210 80 H330 V200" />
      </g>
      <g fill={a} opacity="0.35">
        <circle cx="70" cy="80" r="3" />
        <circle cx="210" cy="200" r="3" />
        <circle cx="330" cy="360" r="3" />
        <circle cx="210" cy="360" r="3" />
      </g>
    </svg>
  )
}

const DECO = { confetti: Confetti, stairs: Stairs, branch: Branch, rings: Rings, heart: Heart, circuit: Circuit }

function Portrait({ src, alt, className, accent }) {
  return (
    <div className={className} style={{ boxShadow: `0 0 0 3px ${accent}` }}>
      <img src={src} alt={alt} crossOrigin="anonymous" />
    </div>
  )
}

export default function MessageCard({ body, settings, occasion }) {
  const name = settings?.ceoName || CEO.name
  const title = settings?.ceoTitle || CEO.title
  const theme = THEMES[occasion] || DEFAULT_THEME
  const { greeting, paragraphs } = splitLetter(body)
  const Art = DECO[theme.deco] || Circuit
  const vars = {
    '--c-bg': theme.bg,
    '--c-text': theme.text,
    '--c-muted': theme.muted,
    '--c-accent': theme.accent,
    '--c-accent2': theme.accent2,
    '--c-gold': theme.gold,
  }

  const photo = (
    <Portrait
      src={ASSETS.ceo}
      alt={name}
      accent={theme.gold || theme.accent}
      className={`mc-photo mc-photo--${theme.photo}`}
    />
  )

  if (theme.layout === 'executive') {
    return (
      <article className="mc mc--executive" id="ceo-message-card" style={vars}>
        <img className="mc-exec-logo" src={ASSETS.logo} alt="Blumen Technologies" crossOrigin="anonymous" />
        <div className="mc-exec-photo">
          <img src={ASSETS.ceo} alt={name} crossOrigin="anonymous" />
        </div>
        <p className="mc-exec-kicker">From the office of the CEO</p>
        <h2 className="mc-exec-name">{name}</h2>
        <p className="mc-exec-role">{title} · Blumen Technologies</p>
        <div className="mc-exec-rule" />
        <section className="mc-letter">
          {greeting ? <p className="mc-greeting">{greeting}</p> : null}
          {paragraphs.map((para, i) => (
            <p className="mc-para" key={i}>{para}</p>
          ))}
          <p className="mc-sign mc-sign--right">
            Warm regards,
            <strong>{name}</strong>
            <span>{title}</span>
            <span>Blumen Technologies</span>
          </p>
        </section>
        <p className="mc-foot mc-foot--center">{COMPANY.location}</p>
      </article>
    )
  }

  return (
    <article
      className={`mc mc--${theme.layout} mc--${theme.tone} mc-logo--${theme.logo}`}
      id="ceo-message-card"
      style={vars}
    >
      <div className="mc-art" aria-hidden="true">
        <Art a={theme.accent} b={theme.accent2} g={theme.gold} s={theme.gold} />
      </div>

      <header className="mc-top">
        <div className="mc-brand">
          <img className="mc-logo" src={ASSETS.logo} alt="" crossOrigin="anonymous" />
          <div>
            <strong>BLUMEN</strong>
            <span>TECHNOLOGIES</span>
          </div>
        </div>
      </header>

      <h2 className="mc-headline">{theme.headline}</h2>

      <div className="mc-main">
        <section className="mc-letter">
          {greeting ? <p className="mc-greeting">{greeting}</p> : null}
          {paragraphs.map((para, i) => (
            <p className="mc-para" key={i}>{para}</p>
          ))}
          <p className="mc-sign">
            Warm regards,
            <strong>{name}</strong>
            <span>{title}</span>
            <span>Blumen Technologies</span>
          </p>
        </section>
        {(theme.photo === 'aside' || theme.photo === 'inside') && photo}
      </div>

      <p className="mc-foot">{COMPANY.location}</p>
    </article>
  )
}
