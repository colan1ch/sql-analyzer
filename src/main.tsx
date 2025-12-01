import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './APP.tsx'
import { store } from './store'
import { checkAuth } from './store/slices/authSlice'
import './index.css'

// ✅ Проверяем авторизацию при загрузке приложения
store.dispatch(checkAuth() as any)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)