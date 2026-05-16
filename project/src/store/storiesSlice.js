import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchItems, fetchNewStoryIds } from '../api/hnApi'

export const fetchStories = createAsyncThunk('stories/fetchStories', async () => {
  const ids = await fetchNewStoryIds(100)
  const items = await fetchItems(ids)
  return items
    .filter((item) => item?.type === 'story')
    .sort((left, right) => right.time - left.time)
})

const storiesSlice = createSlice({
  name: 'stories',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    lastUpdated: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStories.pending, (state) => {
        state.status = state.items.length > 0 ? 'refreshing' : 'loading'
        state.error = null
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
        state.lastUpdated = Date.now()
      })
      .addCase(fetchStories.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Не удалось загрузить новости'
      })
  },
})

export default storiesSlice.reducer
