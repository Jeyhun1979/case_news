import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchItem, fetchItems } from '../api/hnApi'

export const fetchStoryPage = createAsyncThunk(
  'storyPage/fetchStoryPage',
  async (storyId) => {
    const story = await fetchItem(storyId)

    if (!story || story.type !== 'story') {
      throw new Error('Новость не найдена')
    }

    const rootIds = story.kids || []
    const rootComments = rootIds.length ? await fetchItems(rootIds) : []
    const commentsById = {}

    rootComments.forEach((comment) => {
      if (comment?.type === 'comment') {
        commentsById[comment.id] = comment
      }
    })

    return {
      storyId,
      story,
      rootIds,
      commentsById,
      expandedIds: [],
    }
  },
)

export const fetchCommentChildren = createAsyncThunk(
  'storyPage/fetchCommentChildren',
  async (parentId, { getState }) => {
    const { commentsById, expandedIds } = getState().storyPage

    if (expandedIds.includes(parentId)) {
      return { parentId, commentsById: {} }
    }

    const parent = commentsById[parentId]

    if (!parent?.kids?.length) {
      return { parentId, commentsById: {} }
    }

    const children = await fetchItems(parent.kids)
    const nextComments = {}

    children.forEach((comment) => {
      if (comment?.type === 'comment') {
        nextComments[comment.id] = comment
      }
    })

    return { parentId, commentsById: nextComments }
  },
)

const initialState = {
  storyId: null,
  story: null,
  rootIds: [],
  commentsById: {},
  expandedIds: [],
  loadingChildren: [],
  status: 'idle',
  error: null,
  lastUpdated: null,
}

const storyPageSlice = createSlice({
  name: 'storyPage',
  initialState,
  reducers: {
    resetStoryPage: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoryPage.pending, (state) => {
        state.status = state.story ? 'refreshing' : 'loading'
        state.error = null
      })
      .addCase(fetchStoryPage.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.storyId = action.payload.storyId
        state.story = action.payload.story
        state.rootIds = action.payload.rootIds
        state.commentsById = action.payload.commentsById
        state.expandedIds = action.payload.expandedIds
        state.loadingChildren = []
        state.lastUpdated = Date.now()
      })
      .addCase(fetchStoryPage.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Не удалось загрузить новость'
      })
      .addCase(fetchCommentChildren.pending, (state, action) => {
        state.loadingChildren.push(action.meta.arg)
      })
      .addCase(fetchCommentChildren.fulfilled, (state, action) => {
        const { parentId, commentsById } = action.payload
        state.loadingChildren = state.loadingChildren.filter((id) => id !== parentId)

        if (!state.expandedIds.includes(parentId)) {
          state.expandedIds.push(parentId)
        }

        Object.assign(state.commentsById, commentsById)
        state.lastUpdated = Date.now()
      })
      .addCase(fetchCommentChildren.rejected, (state, action) => {
        state.loadingChildren = state.loadingChildren.filter(
          (id) => id !== action.meta.arg,
        )
      })
  },
})

export const { resetStoryPage } = storyPageSlice.actions
export default storyPageSlice.reducer
