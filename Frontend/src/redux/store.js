import {configureStore} from "@reduxjs/toolkit"
import userSlice from './userSlice'
import storySlice from './storySlice'
import postSlice from './postSlice'
import loopSlice from './loopSlice'

export const store = configureStore({
    reducer:{
      user:userSlice,
      story: storySlice,
      post: postSlice,
      loop: loopSlice
    }
})

export default store