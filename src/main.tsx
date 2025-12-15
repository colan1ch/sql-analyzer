import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './APP.tsx'
import { store } from './store'
import { checkAuth } from './store/slices/authSlice'
import './index.css'
// import { clearAuth } from './store/slices/authSlice'


store.dispatch(checkAuth() as any)

// localStorage.removeItem('token')
// localStorage.removeItem('username')
// store.dispatch(clearAuth())


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)