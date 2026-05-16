import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PageToolbar from '../components/PageToolbar'
import StoryList from '../components/StoryList'
import { useAutoRefresh } from '../hooks/useAutoRefresh'
import { fetchStories } from '../store/storiesSlice'

export default function HomePage() {
  const dispatch = useDispatch()
  const { items, status, error, lastUpdated } = useSelector((state) => state.stories)

  const refresh = useCallback(() => {
    dispatch(fetchStories())
  }, [dispatch])

  useEffect(() => {
    refresh()
  }, [refresh])

  useAutoRefresh(refresh)

  const isRefreshing = status === 'loading' || status === 'refreshing'

  return (
    <main className="page">
      <PageToolbar
        onRefresh={refresh}
        isRefreshing={isRefreshing}
        lastUpdated={lastUpdated}
      />

      {status === 'failed' ? <p className="error">{error}</p> : null}

      {isRefreshing && !items.length ? (
        <p className="status">Загрузка новостей…</p>
      ) : (
        <StoryList stories={items} />
      )}
    </main>
  )
}
