import { CHECKLIST_GROUPS, type ChecklistItem } from '../data'
import { modifyProject, type Project, type CheckState } from '../db'

const STATES: { v: CheckState; label: string; cls: string }[] = [
  { v: 'ok', label: '양호', cls: 'on-ok' },
  { v: 'bad', label: '문제', cls: 'on-bad' },
  { v: 'na', label: '해당없음', cls: 'on-na' },
]

export default function ChecklistTab({ project }: { project: Project }) {
  const setState = (id: string, v: CheckState) =>
    modifyProject(project.id!, p => {
      if (p.checklist[id] === v) delete p.checklist[id]
      else p.checklist[id] = v
    })
  const setMemo = (id: string, memo: string) =>
    modifyProject(project.id!, p => { p.checklistMemo[id] = memo })

  const renderItem = (it: ChecklistItem) => (
    <div className="chk-item" key={it.id}>
      <div className="chk-label">
        <div className="name">{it.label}{it.important && <span className="star">＊</span>}</div>
        {it.hint && <div className="hint">{it.hint}</div>}
      </div>
      <div className="chk-states">
        {STATES.map(s => (
          <button key={s.v}
            className={project.checklist[it.id] === s.v ? s.cls : ''}
            onClick={() => setState(it.id, s.v)}>
            {s.label}
          </button>
        ))}
      </div>
      {project.checklist[it.id] === 'bad' && (
        <div className="chk-memo">
          <textarea defaultValue={project.checklistMemo[it.id] ?? ''} placeholder="어떤 문제가 있었는지 자세히 적어두렴"
            onChange={e => setMemo(it.id, e.target.value)} />
        </div>
      )}
    </div>
  )

  return (
    <>
      <p className="muted" style={{ marginBottom: 10 }}>
        <span style={{ color: 'var(--danger)' }}>＊</span> 표시는 아빠가 꼭 확인하라고 골라둔 핵심 항목이야. 나머지는 접어뒀으니 시간 되면 펼쳐서 보렴.
      </p>
      {CHECKLIST_GROUPS.map(g => {
        const important = g.items.filter(i => i.important)
        const rest = g.items.filter(i => !i.important)
        return (
          <div className="card" key={g.name}>
            <div className="group-title">{g.name}</div>
            {important.map(renderItem)}
            {rest.length > 0 && (
              <details className="fold">
                <summary>일반 항목 {rest.length}개 펼치기</summary>
                {rest.map(renderItem)}
              </details>
            )}
          </div>
        )
      })}
    </>
  )
}
