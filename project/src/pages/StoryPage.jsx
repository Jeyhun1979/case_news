import { useCallback, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import CommentTree from '../components/CommentTree'
import PageToolbar from '../components/PageToolbar'
import { useAutoRefresh } from '../hooks/useAutoRefresh'
import { fetchStoryPage, resetStoryPage } from '../store/storyPageSlice'
import { formatUnixTime, getHostname, getStoryUrl } from '../utils/formatDate'

export default function StoryPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { story, status, error, lastUpdated } = useSelector((state) => state.storyPage)

  const refresh = useCallback(() => {
    if (id) {
      dispatch(fetchStoryPage(id))
    }
  }, [dispatch, id])

  useEffect(() => {
    refresh()
    return () => {
      dispatch(resetStoryPage())
    }
  }, [dispatch, refresh])

  useAutoRefresh(refresh)

  const isRefreshing = status === 'loading' || status === 'refreshing'

  if (status === 'failed' && !story) {
    return (
      <main className="page">
        <p className="error">{error}</p>
        <Link to="/" className="button button--ghost">
          К списку новостей
        </Link>
      </main>
    )
  }

  if (!story) {
    return (
      <main className="page">
        <p className="status">Загрузка новости…</p>
      </main>
    )
  }

  const storyUrl = getStoryUrl(story)
  const hostname = story.url ? getHostname(story.url) : null

  return (
    <main className="page">
      <PageToolbar
        onRefresh={refresh}
        isRefreshing={isRefreshing}
        lastUpdated={lastUpdated}
      >
        <Link to="/" className="button button--ghost">
          К списку новостей
        </Link>
      </PageToolbar>

      <article className="story-detail">
        <h1 className="story-detail__title">{story.title}</h1>
        <p className="story-detail__meta">
          <span>{story.score ?? 0} points</span>
          <span aria-hidden="true"> · </span>
          <span>{story.by || 'anonymous'}</span>
          <span aria-hidden="true"> · </span>
          <time dateTime={new Date(story.time * 1000).toISOString()}>
            {formatUnixTime(story.time)}
          </time>
          <span aria-hidden="true"> · </span>
          <span>{story.descendants ?? 0} comments</span>
        </p>
        <p className="story-detail__link">
          <a href={storyUrl} target="_blank" rel="noreferrer">
            {hostname || storyUrl}
          </a>
        </p>
      </article>

      <section className="comments-section">
        <h2 className="comments-section__title">Комментарии</h2>
        <CommentTree />
      </section>
    </main>
  )
}
