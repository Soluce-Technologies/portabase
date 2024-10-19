import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {BrowserRouter} from "react-router-dom"
import {Suspense} from 'react'


ReactDOM.createRoot(document.getElementById('root')!).render(
    <Suspense fallback="loading">
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Suspense>
)
