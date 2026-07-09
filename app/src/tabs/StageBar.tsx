import { Fragment } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { CHECKLIST_GROUPS, LEGAL_GROUPS, REQUIRED_PHOTO_CATS, REQUIRED_DOC_TYPES } from '../data'
import { db, updateProject, type Project } from '../db'

const IMPORTANT_ITEMS = CHECKLIST_GROUPS.flatMap(g => g.items.filter(i => i.important))
const LEGAL_ITEMS = LEGAL_GROUPS.flatMap(g => g.items)
// 수동 완료 단계 시작 인덱스 (위험도 = 6번째)
const MANUAL_START = 6

export default function StageBar({ project }: { project: Project }) {
  const visitCount = useLiveQuery(
    () => db.visits.where('projectId').equals(project.id!).count(), [project.id]
  ) ?? 0
  const photos = useLiveQuery(
    () => db.photos.where('projectId').equals(project.id!).toArray(), [project.id]
  ) ?? []
  const docs = useLiveQuery(
    () => db.docs.where('projectId').equals(project.id!).toArray(), [project.id]
  ) ?? []

  const docTypes = new Set(docs.map(d => d.type))
  const checklistDone = IMPORTANT_ITEMS.filter(it => project.checklist[it.id]).length
  const legalDone = LEGAL_ITEMS.filter(it => project.legal[it.id]).length
  const keyDocsDone = REQUIRED_DOC_TYPES.filter(t => docTypes.has(t)).length
  const hasInfo = !!(project.info.address || project.info.buildingName)

  const stages = [
    { label: '후보등록', pct: hasInfo ? 100 : 0, manual: false },
    { label: '방문', pct: visitCount > 0 ? 100 : 0, manual: false },
    { label: '사진등록', pct: Math.round(REQUIRED_PHOTO_CATS.reduce((sum, cat) => sum + Math.min(photos.filter(p => p.category === cat).length, 2), 0) / (REQUIRED_PHOTO_CATS.length * 2) * 100), manual: false },
    { label: '체크리스트', pct: Math.round(checklistDone / IMPORTANT_ITEMS.length * 100), manual: false },
    { label: '서류등록', pct: Math.round(keyDocsDone / REQUIRED_DOC_TYPES.length * 100), manual: false },
    { label: '법률검수', pct: Math.round(legalDone / LEGAL_ITEMS.length * 100), manual: false },
    { label: '위험도', pct: project.stage > MANUAL_START ? 100 : 0, manual: true },
    { label: 'AI검토', pct: project.stage > MANUAL_START + 1 ? 100 : 0, manual: true },
    { label: '계약', pct: project.stage > MANUAL_START + 2 ? 100 : 0, manual: true },
    { label: '입주', pct: project.stage > MANUAL_START + 3 ? 100 : 0, manual: true },
  ]

  const toggle = (i: number) => {
    if (!stages[i].manual) return
    const newStage = project.stage > i ? i : i + 1
    updateProject(project.id!, { stage: newStage })
  }

  return (
    <div className="card">
      <div className="group-title">진행단계</div>
      <div className="stage-flow">
        {stages.map((s, i) => {
          const color = s.pct === 100 ? 'var(--ok)' : s.pct > 0 ? 'var(--primary)' : 'var(--muted)'
          return (
            <Fragment key={s.label}>
              <div
                className={`stage-card2${s.manual ? ' manual' : ''}`}
                onClick={() => toggle(i)}
                title={s.manual ? '탭해서 완료 표시' : undefined}
              >
                <div className="sc-label">{s.label}</div>
                <div className="sc-pct" style={{ color }}>{s.pct}%</div>
                <div className="sc-bar">
                  <div className="sc-fill" style={{ width: `${s.pct}%`, background: color }} />
                </div>
              </div>
              {i < stages.length - 1 && <span className="stage-arrow">›</span>}
            </Fragment>
          )
        })}
      </div>
      <p className="muted" style={{ marginTop: 8, fontSize: 11.5 }}>
        자동 집계 · 위험도·AI검토·계약·입주는 탭해서 완료 표시
      </p>
    </div>
  )
}
