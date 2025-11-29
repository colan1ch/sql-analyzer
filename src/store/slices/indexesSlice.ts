import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { ApitypesIndexJSON } from '../../api/Api'
import { api } from '../../api'

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

export const fetchIndexes = createAsyncThunk(
  'indexes/fetchIndexes',
  async (searchName: string | undefined, { rejectWithValue }) => {
    try {
      const response = await api.indexes.indexesList({ 
        index_name: searchName 
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка загрузки индексов');
    }
  }
);

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIndexes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIndexes.fulfilled, (state, action) => {
        state.loading = false;
        state.indexes = action.payload as ApitypesIndexJSON[]; 
      })
      .addCase(fetchIndexes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  }
})

export const { setIndexes, setLoading, setError, clearError } = indexesSlice.actions
export default indexesSlice.reducer