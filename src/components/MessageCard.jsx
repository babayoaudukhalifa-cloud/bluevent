import { ASSETS, CEO } from '../lib/constants'
import { splitLetter } from '../lib/messages'

export default function MessageCard({ body, settings }) {
  const name = settings?.ceoName || CEO.name
  const title = settings?.ceoTitle || CEO.title
  const { greeting, paragraphs } = splitLetter(body)

  return (
    <article className="message-card" id="ceo-message-card">
      <div className="card-frame">
        <header className="card-brand">
          <img className="brand-img" src={ASSETS.logo} alt="Blumen Technologies" crossOrigin="anonymous" />
          <div className="card-rule" />
          <img className="ceo-img" src={ASSETS.ceo} alt={name} crossOrigin="anonymous" />
          <p className="from">From the office of the CEO</p>
          <h3>{name}</h3>
          <p className="meta">{title} · Blumen Technologies</p>
        </header>

        <div className="card-rule wide" />

        <div className="letter">
          {greeting ? <p className="greet">{greeting}</p> : null}
          {(paragraphs.length ? paragraphs : []).map((para, i) => (
            <p className="para" key={i}>{para}</p>
          ))}
          <p className="sign">
            Warm regards,
            <br />
            <strong>{name}</strong>
            <br />
            {title}
            <br />
            Blumen Technologies
          </p>
        </div>

        <p className="card-foot">FCT Abuja, Nigeria</p>
      </div>
    </article>
  )
}
