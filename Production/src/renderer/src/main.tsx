import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { VesperDashboard } from './components/VesperDashboard'
import './styles/hud.css'
import './styles/dashboard.css'

function RootRouter(): JSX.Element {
  const [route, setRoute] = useState<'dashboard' | 'capsule'>(() => {
    return window.location.hash.includes('dashboard') ? 'dashboard' : 'capsule'
  })

  useEffect(() => {
    const handleHashChange = (): void => {
      const isDash = window.location.hash.includes('dashboard')
      setRoute(isDash ? 'dashboard' : 'capsule')
      if (isDash) {
        document.body.classList.add('is-dashboard-mode')
      } else {
        document.body.classList.remove('is-dashboard-mode')
      }
    }

    if (window.location.hash.includes('dashboard')) {
      document.body.classList.add('is-dashboard-mode')
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  if (route === 'dashboard') {
    return <VesperDashboard standalone={true} />
  }

  return <App />
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RootRouter />
  </React.StrictMode>
)
