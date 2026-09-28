import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { App } from './app/App'
import { PortfolioProvider } from './data/PortfolioProvider'
import './styles/tokens.css'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><BrowserRouter><PortfolioProvider><App /></PortfolioProvider></BrowserRouter></React.StrictMode>,
)
