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
        {project.checklist[it.id] === 'bad' && (
          <div className="chk-memo">
            <input defaultValue={project.checklistMemo[it.id] ?? ''} placeholder="문제 내용 메모"
              onChange={e => setMemo(it.id, e.target.value)} />
          </div>
        )}
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
    </div>
  )

  return (
    <>
      <p className="muted" style={{ marginBottom: 10 }}>
        <span style={{ color: 'var(--danger)' }}>＊</span> 표시는 핵심 항목입니다. 나머지는 접혀 있으며 필요할 때 펼쳐서 확인하세요.
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
