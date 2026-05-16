import StoryRow from './StoryRow'

export default function StoryList({ stories }) {
  return (
    <ol className="story-list">
      {stories.map((story, index) => (
        <li key={story.id} className="story-list__item">
          <StoryRow story={story} rank={index + 1} />
        </li>
      ))}
    </ol>
  )
}
