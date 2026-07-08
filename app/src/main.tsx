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

// 저장공간 부족 시 브라우저가 데이터를 임의로 지우지 않도록 영구 저장 요청
if (navigator.storage?.persist) {
  navigator.storage.persist()
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
