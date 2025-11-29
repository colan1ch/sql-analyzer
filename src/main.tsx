import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './APP.tsx'
import './index.css'
// import { registerSW } from "virtual:pwa-register";


// В самом начале
const redirect = sessionStorage.redirect;
delete sessionStorage.redirect;
if (redirect && redirect != location.pathname) {
  history.replaceState(null, '', redirect);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)

// if ("serviceWorker" in navigator) {
//   registerSW()
// }