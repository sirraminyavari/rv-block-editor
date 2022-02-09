import './global.scss'
import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import { UiContextProvider } from './UiContext'


ReactDOM.render (
    <React.StrictMode>
        <UiContextProvider>
            <App />
        </UiContextProvider>
    </React.StrictMode>,
    document.getElementById ( 'root' )
)
