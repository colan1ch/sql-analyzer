import { createSlice } from '@reduxjs/toolkit'
import type { ApitypesIndexJSON } from '../../api/Api'

interface IndexesState {
  indexes: ApitypesIndexJSON[]
  loading: boolean
  error: string | null
}

const initialState: IndexesState = {
  indexes: [],
  loading: false,
  error: null
}

const indexesSlice = createSlice({
  name: 'indexes',
  initialState,
  reducers: {
    setIndexes: (state, action) => {
      state.indexes = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    }
  }
})

export const { setIndexes, setLoading, setError, clearError } = indexesSlice.actions
export default indexesSlice.reducer