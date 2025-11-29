import { configureStore } from '@reduxjs/toolkit'
import indexesReducer from './slices/indexesSlice.ts'
import searchReducer from './slices/filtersSlice.ts'
import authReducer from './slices/authSlice'
import queriesReducer from './slices/queriesSlice.ts'

export const store = configureStore({
  reducer: {
    indexes: indexesReducer,
    search: searchReducer,
    auth: authReducer,
    queries: queriesReducer,
  },
  devTools: true
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch