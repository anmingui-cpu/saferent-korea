import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ProjectPage from './pages/ProjectPage'
import './styles.css'
import { db } from './db'
import { buildExportPayload, importProject } from './transfer'

if (import.meta.env.DEV) {
  Object.assign(window, { __sr: { db, buildExportPayload, importProject } })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/p/:id" element={<ProjectPage />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>,
)
