import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';

interface AuthState {
  username: string;
  isAuthenticated: boolean;
  isModerator: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  username: localStorage.getItem('username') || '',
  isAuthenticated: !!localStorage.getItem('token'),
  isModerator: localStorage.getItem('isModerator') === 'true',
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { login: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.users.signInCreate(credentials);
      localStorage.setItem('username', credentials.login);
      
      const profileResponse = await api.users.profileList(credentials.login);
      const isModerator = profileResponse.data?.is_moderator || false;
      localStorage.setItem('isModerator', String(isModerator));
      
      return { ...response.data, is_moderator: isModerator };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка авторизации');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { login: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.users.signUpCreate({
        login: userData.login,
        password: userData.password,
        is_moderator: false,
      });
      localStorage.setItem('username', userData.login);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка регистрации');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.users.signOutCreate();
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка при выходе');
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (!token || !username) {
      return null;
    }

    try {
      const profileResponse = await api.users.profileList(username);
      const isModerator = profileResponse.data?.is_moderator || false;
      localStorage.setItem('isModerator', String(isModerator));
      
      return { success: true, is_moderator: isModerator };
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('isModerator');
        return null;
      }
      return rejectWithValue('Ошибка проверки авторизации');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.username = '';
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.username = action.payload.login || action.meta.arg.login;
        state.isModerator = action.payload.is_moderator || false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.username = action.payload.login || action.meta.arg.login;
        state.isModerator = false;
        localStorage.setItem('isModerator', 'false');
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.username = '';
        state.isModerator = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.isAuthenticated = true;
          state.isModerator = action.payload.is_moderator || false;
        } else {
          state.isAuthenticated = false;
          state.username = '';
          state.isModerator = false;
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.username = '';
        state.isModerator = false;
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('isModerator');
      });
  },
});

export const { clearError, clearAuth } = authSlice.actions;
export default authSlice.reducer;
