import { ASSETS, CEO } from '../lib/constants'

export default function MessageCard({ body, settings }) {
  const name = settings?.ceoName || CEO.name
  const title = settings?.ceoTitle || CEO.title

  return (
    <article className="message-card" id="ceo-message-card">
      <img className="brand-img" src={ASSETS.logo} alt="Blumen Technologies" />
      <img className="ceo-img" src={ASSETS.ceo} alt={name} />
      <p className="from">From the office of the CEO</p>
      <h3>{name}</h3>
      <p className="meta">{title} · Blumen Technologies</p>
      <div className="body">{body}</div>
      <p className="sign">
        Warm regards,
        <br />
        {name}
        <br />
        {title}
        <br />
        Blumen Technologies
      </p>
    </article>
  )
}
