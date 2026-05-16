import { configureStore } from '@reduxjs/toolkit'
import storiesReducer from './storiesSlice'
import storyPageReducer from './storyPageSlice'

export const store = configureStore({
  reducer: {
    stories: storiesReducer,
    storyPage: storyPageReducer,
  },
})
