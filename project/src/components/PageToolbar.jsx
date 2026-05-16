import { formatTimestamp } from '../utils/formatDate'

export default function PageToolbar({
  onRefresh,
  isRefreshing,
  lastUpdated,
  children,
}) {
  return (
    <section className="toolbar">
      <button
        type="button"
        className="button"
        onClick={onRefresh}
        disabled={isRefreshing}
      >
        {isRefreshing ? 'Обновление…' : 'Обновить'}
      </button>
      {children}
      {lastUpdated ? (
        <p className="toolbar__meta">
          Обновлено: {formatTimestamp(lastUpdated)}
        </p>
      ) : null}
    </section>
  )
}
