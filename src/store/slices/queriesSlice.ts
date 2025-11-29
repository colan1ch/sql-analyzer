import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';

interface QueryCart {
  id?: number;
  indexes_count?: number;
  indexes?: any[];
  status?: string;
  creator_login?: string;
  date_create?: string;
  date_query?: string;
}

interface QueryIndex {
  id: number;
  name: string;
  description?: string;
  image?: string;
}

interface QueryDetail {
  id: number;
  count: number;
  queryIndexes?: QueryIndex[];
  indexes?: QueryIndex[];
  date_query?: string;
  [key: string]: any;
}

interface QueriesState {
  query_id?: number;
  indexes_count: number;
  loading: boolean;
  queryCart: QueryCart | null;
  error: string | null;
  queryDetail: QueryDetail | null;
  saveLoading: {
    date: boolean;
    indexes: { [key: number]: boolean };
  };
}

const initialState: QueriesState = {
  query_id: undefined,
  indexes_count: 0,
  loading: false,
  queryCart: null,
  queryDetail: null,
  error: null,
  saveLoading: {
    date: false,
    indexes: {}
  }
};

export const getQueryCart = createAsyncThunk(
  'queries/getQueryCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.queries.queryCartList();
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return { indexes_count: 0, indexes: [] };
      }
      return rejectWithValue(error.response?.data?.description || 'Ошибка загрузки корзины');
    }
  }
);

export const addToQuery = createAsyncThunk(
  'queries/addToQuery',
  async (indexId: number, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.indexes.addToQueryCreate(indexId);
      dispatch(getQueryCart());
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 409) {
        dispatch(getQueryCart());
        return { message: 'already_added' };
      }
      return rejectWithValue(error.response?.data?.description || 'Ошибка добавления');
    }
  }
);

export const removeFromQuery = createAsyncThunk(
  'queries/removeFromQuery',
  async ({ indexId, queryId }: { indexId: number; queryId: number }, { rejectWithValue }) => {
    try {
      const response = await api.indexesQuery.indexesQueryDelete(indexId, queryId);
      return { indexId, queryId, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка удаления');
    }
  }
);

export const getQueryDetail = createAsyncThunk(
  'queries/getQueryDetail',
  async (queryId: number, { rejectWithValue }) => {
    try {
      const response = await api.queries.queriesDetail(queryId);
      const data = response.data;
      const normalizedData: QueryDetail = {
        id: data.id,
        count: data.count || data.indexes_count || 0,
        queryIndexes: data.queryIndexes || data.indexes || [],
        date_query: data.date_query,
        ...data
      };
      return normalizedData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка загрузки запроса');
    }
  }
);

export const deleteQuery = createAsyncThunk(
  'queries/deleteQuery',
  async (queryId: number, { rejectWithValue }) => {
    try {
      const response = await api.queries.deleteQueryDelete(queryId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка удаления запроса');
    }
  }
);

export const updateQueryDate = createAsyncThunk(
  'queries/updateQueryDate',
  async ({ queryId, date }: { queryId: number; date: string }, { rejectWithValue }) => {
    try {
      const response = await api.queries.changeQueryUpdate(queryId, {
        date_query: date
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка обновления даты');
    }
  }
);

export const formQuery = createAsyncThunk(
  'queries/formQuery',
  async (queryId: number, { rejectWithValue }) => {
    try {
      const response = await api.queries.formUpdate(queryId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка подтверждения запроса');
    }
  }
);

const queriesSlice = createSlice({
  name: 'queries',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearQuery: (state) => {
      state.queryCart = null;
      state.indexes_count = 0;
      state.query_id = undefined;
    },
    removeIndexOptimistic: (state, action) => {
      const indexId = action.payload;
      if (state.queryDetail) {
        const indexes = state.queryDetail.queryIndexes || state.queryDetail.indexes || [];
        const updatedIndexes = indexes.filter(index => index.id !== indexId);
        
        if (state.queryDetail.queryIndexes) {
          state.queryDetail.queryIndexes = updatedIndexes;
        }
        if (state.queryDetail.indexes) {
          state.queryDetail.indexes = updatedIndexes;
        }
        state.queryDetail.count = updatedIndexes.length;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getQueryCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQueryCart.fulfilled, (state, action) => {
        state.loading = false;
        state.queryCart = action.payload;
        state.indexes_count = action.payload.indexes_count || 0;
        state.query_id = action.payload.id;
      })
      .addCase(getQueryCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.queryCart = null;
        state.indexes_count = 0;
        state.query_id = undefined;
      })
      
      .addCase(getQueryDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.queryDetail = null;
      })
      .addCase(getQueryDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.queryDetail = action.payload;
      })
      .addCase(getQueryDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.queryDetail = null;
      })
      
      .addCase(deleteQuery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuery.fulfilled, (state) => {
        state.loading = false;
        state.queryDetail = null;
        state.queryCart = null;
        state.indexes_count = 0;
        state.query_id = undefined;
      })
      .addCase(deleteQuery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(removeFromQuery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromQuery.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeFromQuery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(formQuery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(formQuery.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(formQuery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearQuery, removeIndexOptimistic } = queriesSlice.actions;
export default queriesSlice.reducer;