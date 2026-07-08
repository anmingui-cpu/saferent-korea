import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { riskScore, riskLevel, RISK_COLORS } from '../data'
import { exportProject } from '../transfer'
import BasicInfoTab from '../tabs/BasicInfoTab'
import VisitsTab from '../tabs/VisitsTab'
import PhotosTab from '../tabs/PhotosTab'
import ChecklistTab from '../tabs/ChecklistTab'
import LegalTab from '../tabs/LegalTab'
import DocsTab from '../tabs/DocsTab'
import RisksTab from '../tabs/RisksTab'
import ReportTab from '../tabs/ReportTab'
import StageBar from '../tabs/StageBar'

const TABS = ['기본정보', '방문', '사진', '체크리스트', '문서', '법률검수', '위험도', '리포트'] as const
type Tab = typeof TABS[number]

export default function ProjectPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const pid = Number(id)
  const [tab, setTab] = useState<Tab>('기본정보')
  const project = useLiveQuery(() => db.projects.get(pid), [pid])

  if (!project) return <div className="empty">불러오는 중…</div>

  const score = riskScore(project.risks)
  const level = riskLevel(score)

  return (
    <>
      <header className="app-header">
        <button className="back" onClick={() => nav('/')} aria-label="뒤로">←</button>
        <h1>{project.info.buildingName || project.info.address || '새 월세 검토'}</h1>
        <button className="btn ghost sm" onClick={() => exportProject(pid)} title="이 매물을 파일로 백업">💾 백업</button>
        <span className="badge" style={{ background: RISK_COLORS[level] }}>{level}</span>
      </header>
      <nav className="tabs">
        {TABS.map(t => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </nav>
      <div className="page">
        <StageBar project={project} />
        {tab === '기본정보' && <BasicInfoTab project={project} />}
        {tab === '방문' && <VisitsTab projectId={pid} />}
        {tab === '사진' && <PhotosTab projectId={pid} />}
        {tab === '체크리스트' && <ChecklistTab project={project} />}
        {tab === '문서' && <DocsTab projectId={pid} />}
        {tab === '법률검수' && <LegalTab project={project} />}
        {tab === '위험도' && <RisksTab project={project} />}
        {tab === '리포트' && <ReportTab project={project} />}
      </div>
    </>
  )
}
