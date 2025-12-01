import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';

interface AuthState {
  username: string;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  username: localStorage.getItem('username') || '',
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { login: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.users.signInCreate(credentials);
      localStorage.setItem('username', credentials.login);
      return response.data;
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

// ✅ НОВАЯ ФУНКЦИЯ - проверка валидности токена при загрузке
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    
    // Если токена нет - пользователь не авторизован
    if (!token) {
      return null;
    }

    try {
      // Пытаемся получить профиль пользователя
      // Используем любой защищённый endpoint для проверки токена
      const response = await api.queries.queriesList();
      response;
      // Если успешно получили ответ - токен валидный
      return { success: true };
    } catch (error: any) {
      // Если ошибка 401 или другая - токен невалидный
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
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
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.username = '';
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // ✅ ОБРАБОТЧИКИ для checkAuth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload) {
          // Токен невалидный
          state.isAuthenticated = false;
          state.username = '';
        }
        // Если валидный - ничего не меняем, оставляем текущее состояние
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.username = '';
        localStorage.removeItem('token');
        localStorage.removeItem('username');
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
