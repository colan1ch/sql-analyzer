import { Api } from './Api';

export const api = new Api({
  baseURL: '/api/v1',
});

// Перехватчик запроса - добавляет токен из localStorage
api.instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Перехватчик ответа - сохраняет токен если пришёл в ответе
api.instance.interceptors.response.use(
  (response) => {
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);