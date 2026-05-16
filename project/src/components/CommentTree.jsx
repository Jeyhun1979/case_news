import { useSelector } from 'react-redux'
import CommentItem from './CommentItem'

export default function CommentTree() {
  const rootIds = useSelector((state) => state.storyPage.rootIds)
  const status = useSelector((state) => state.storyPage.status)

  if (status === 'loading') {
    return <p className="status">Загрузка комментариев…</p>
  }

  if (!rootIds.length) {
    return <p className="status">Комментариев пока нет.</p>
  }

  return (
    <ul className="comment-tree">
      {rootIds.map((commentId) => (
        <li key={commentId} className="comment-tree__item">
          <CommentItem commentId={commentId} depth={0} />
        </li>
      ))}
    </ul>
  )
}
