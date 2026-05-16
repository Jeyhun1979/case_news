const BASE_URL = 'https://hacker-news.firebaseio.com/v0'

async function request(path) {
  const response = await fetch(`${BASE_URL}${path}`)
  if (!response.ok) {
    throw new Error(`Request failed: ${path}`)
  }
  return response.json()
}

export function fetchNewStoryIds(limit = 100) {
  return request('/newstories.json').then((ids) => ids.slice(0, limit))
}

export function fetchItem(id) {
  return request(`/item/${id}.json`)
}

export async function fetchItems(ids) {
  const chunkSize = 25
  const items = []

  for (let index = 0; index < ids.length; index += chunkSize) {
    const chunk = ids.slice(index, index + chunkSize)
    const batch = await Promise.all(chunk.map((id) => fetchItem(id)))
    items.push(...batch.filter(Boolean))
  }

  return items
}
