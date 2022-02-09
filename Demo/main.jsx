import './global.scss'
import ReactDOM from 'react-dom'

import App from './App'
import { UiContextProvider } from './App/UiContext'


ReactDOM.render (
    <React.StrictMode>
        <UiContextProvider>
            <App />
        </UiContextProvider>
    </React.StrictMode>,
    document.getElementById ( 'root' )
)
