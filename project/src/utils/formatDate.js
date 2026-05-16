const formatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatUnixTime(seconds) {
  if (!seconds) {
    return '—'
  }
  return formatter.format(new Date(seconds * 1000))
}

export function getStoryUrl(story) {
  if (story.url) {
    return story.url
  }
  return `https://news.ycombinator.com/item?id=${story.id}`
}

export function formatTimestamp(ms) {
  if (!ms) {
    return '—'
  }
  return formatter.format(new Date(ms))
}

export function getHostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return 'news.ycombinator.com'
  }
}
