import { useRef, type MouseEvent } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate } from 'react-router-dom'
import { db, createProject, deleteProject } from '../db'
import { seedDemo } from '../demo'
import { exportProject, importProject } from '../transfer'
import { STAGES, riskScore, riskLevel, RISK_COLORS } from '../data'

export default function Home() {
  const nav = useNavigate()
  const importRef = useRef<HTMLInputElement>(null)
  const projects = useLiveQuery(() => db.projects.orderBy('updatedAt').reverse().toArray(), [])

  const onImport = async (files: FileList | null) => {
    if (!files?.[0]) return
    try {
      await importProject(files[0])
    } catch (err) {
      alert(err instanceof Error ? err.message : '가져오기에 실패했습니다')
    } finally {
      if (importRef.current) importRef.current.value = ''
    }
  }

  const onNew = async () => {
    const id = await createProject()
    nav(`/p/${id}`)
  }

  const onDelete = async (e: MouseEvent, id: number, name: string) => {
    e.stopPropagation()
    if (confirm(`'${name || '이름 없음'}' 검토를 삭제할까요? 사진·문서도 함께 삭제됩니다.`)) {
      await deleteProject(id)
    }
  }

  return (
    <>
      <header className="app-header">
        <h1>🐸 SafeRent Korea — 개구리 가족의 월세 검토</h1>
      </header>
      <div className="page">
        <button className="btn full" onClick={onNew}>＋ 새 월세 검토 시작</button>
        <div style={{ height: 16 }} />
        <div style={{ height: 8 }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn ghost" style={{ flex: 1 }} onClick={async () => nav(`/p/${await seedDemo()}`)}>
            🧪 데모 둘러보기
          </button>
          <button className="btn ghost" style={{ flex: 1 }} onClick={() => importRef.current?.click()}>
            📥 매물 가져오기
          </button>
          <input ref={importRef} type="file" accept=".json,application/json" hidden
            onChange={e => onImport(e.target.files)} />
        </div>
        <div style={{ height: 16 }} />
        {projects && projects.length === 0 && (
          <div className="empty">
            아직 등록된 집이 없어.<br />
            후보 집 추가하고 같이 꼼꼼히 살펴보자.
          </div>
        )}
        {projects?.map(p => {
          const score = riskScore(p.risks)
          const level = riskLevel(score)
          const title = p.info.buildingName || p.info.address || '이름 없음'
          return (
            <div key={p.id} className="card proj-card" onClick={() => nav(`/p/${p.id}`)}>
              <div className="title">{title}</div>
              <div className="sub">
                {p.info.address && p.info.buildingName ? `${p.info.address} · ` : ''}
                {p.info.deposit && `보증금 ${p.info.deposit}만`}
                {p.info.rent && ` / 월세 ${p.info.rent}만`}
              </div>
              <div className="row">
                <span className="badge stage">{STAGES[p.stage] ?? STAGES[0]}</span>
                <span className="badge" style={{ background: RISK_COLORS[level] }}>
                  {level}{score > 0 && ` ${score}점`}
                </span>
                <span style={{ flex: 1 }} />
                <button className="btn ghost sm" onClick={e => { e.stopPropagation(); exportProject(p.id!) }}>내보내기</button>
                <button className="btn danger sm" onClick={e => onDelete(e, p.id!, title)}>삭제</button>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
