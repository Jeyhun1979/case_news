import { useDispatch, useSelector } from 'react-redux'
import { fetchCommentChildren } from '../store/storyPageSlice'
import { formatUnixTime } from '../utils/formatDate'

export default function CommentItem({ commentId, depth = 0 }) {
  const dispatch = useDispatch()
  const comment = useSelector((state) => state.storyPage.commentsById[commentId])
  const expandedIds = useSelector((state) => state.storyPage.expandedIds)
  const loadingChildren = useSelector((state) => state.storyPage.loadingChildren)

  if (!comment) {
    return null
  }

  const isExpanded = expandedIds.includes(comment.id)
  const hasKids = Boolean(comment.kids?.length)
  const isLoading = loadingChildren.includes(comment.id)
  const canExpand = depth === 0 && hasKids && !isExpanded

  const handleToggle = () => {
    if (!canExpand) {
      return
    }
    dispatch(fetchCommentChildren(comment.id))
  }

  const childIds = isExpanded ? comment.kids || [] : []

  return (
    <article className="comment" style={{ '--comment-depth': depth }}>
      <header className="comment__header">
        <span className="comment__author">{comment.by || 'anonymous'}</span>
        <time
          className="comment__time"
          dateTime={new Date(comment.time * 1000).toISOString()}
        >
          {formatUnixTime(comment.time)}
        </time>
      </header>

      {comment.deleted ? (
        <p className="comment__deleted">[удалено]</p>
      ) : (
        <p
          className="comment__text"
          dangerouslySetInnerHTML={{ __html: comment.text || '' }}
        />
      )}

      {canExpand ? (
        <button
          type="button"
          className="comment__toggle"
          onClick={handleToggle}
          disabled={isLoading}
        >
          {isLoading
            ? 'Загрузка ответов…'
            : `Показать ${comment.kids.length} ответов`}
        </button>
      ) : null}

      {childIds.length > 0 ? (
        <ul className="comment__children">
          {childIds.map((childId) => (
            <li key={childId}>
              <CommentItem commentId={childId} depth={depth + 1} />
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  )
}
