import React from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import ChatAssistant from './ChatAssistant.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'

export default function Layout({ children }) {
  const location = useLocation()

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-canvas">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto max-w-6xl">
            <ErrorBoundary key={location.pathname}>
              {children}
            </ErrorBoundary>
          </div>
        </main>
      </div>
      <ChatAssistant />
    </div>
  )
}
