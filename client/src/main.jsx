import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {Provider} from 'react-redux'
import {store, persistor} from './features/store'
import {PersistGate} from 'redux-persist/integration/react'



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <Provider store={store}>
  <ToastContainer
    position="top-right"
    autoClose={3000}
    closeOnClick
    pauseOnHover
    theme="dark"
    >
    </ToastContainer>
    <PersistGate loading={null} persistor={persistor}>
    <App />
    </PersistGate>
   
  </Provider>
    
  </React.StrictMode>,
)
