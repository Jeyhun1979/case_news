import { Link } from 'react-router-dom'
import { formatUnixTime, getHostname } from '../utils/formatDate'

export default function StoryRow({ story, rank }) {
  const hostname = story.url ? getHostname(story.url) : null
  const score = story.score ?? 0

  return (
    <article className="story-row">
      <span className="story-row__rank">{rank}.</span>
      <section className="story-row__content">
        <div className="story-row__head">
          <h2 className="story-row__title">
            <Link to={`/item/${story.id}`}>{story.title}</Link>
            {hostname ? <span className="story-row__host"> ({hostname})</span> : null}
          </h2>
          <span className="story-row__rating" title="Рейтинг новости">
            <span className="story-row__rating-label">рейтинг</span>
            <span className="story-row__rating-value">{score}</span>
          </span>
        </div>
        <p className="story-row__meta">
          <span>{story.by || 'anonymous'}</span>
          <span aria-hidden="true"> · </span>
          <time dateTime={new Date(story.time * 1000).toISOString()}>
            {formatUnixTime(story.time)}
          </time>
        </p>
      </section>
    </article>
  )
}
