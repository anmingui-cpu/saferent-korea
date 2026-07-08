import { LEGAL_GROUPS } from '../data'
import { modifyProject, type Project, type CheckState } from '../db'

const STATES: { v: CheckState; label: string; cls: string }[] = [
  { v: 'ok', label: '확인', cls: 'on-ok' },
  { v: 'bad', label: '문제', cls: 'on-bad' },
  { v: 'na', label: '해당없음', cls: 'on-na' },
]

export default function LegalTab({ project }: { project: Project }) {
  const setState = (id: string, v: CheckState) =>
    modifyProject(project.id!, p => {
      if (p.legal[id] === v) delete p.legal[id]
      else p.legal[id] = v
    })
  const setMemo = (id: string, memo: string) =>
    modifyProject(project.id!, p => { p.legalMemo[id] = memo })

  return (
    <>
      <p className="muted" style={{ marginBottom: 10 }}>
        각 항목의 설명을 읽고 서류를 직접 대조하세요. 문제가 있으면 '위험도' 탭에서 해당 위험요소를 체크하세요.
      </p>
      {LEGAL_GROUPS.map(g => (
        <div className="card" key={g.name}>
          <div className="group-title">{g.name}</div>
          <div className="group-intro">{g.intro}</div>
          {g.items.map(it => (
            <div className="chk-item" key={it.id}>
              <div className="chk-label">
                <div className="name">{it.label}</div>
                <div className="hint">{it.desc}</div>
                {project.legal[it.id] === 'bad' && (
                  <div className="chk-memo">
                    <input defaultValue={project.legalMemo[it.id] ?? ''} placeholder="발견한 문제 메모"
                      onChange={e => setMemo(it.id, e.target.value)} />
                  </div>
                )}
              </div>
              <div className="chk-states">
                {STATES.map(s => (
                  <button key={s.v}
                    className={project.legal[it.id] === s.v ? s.cls : ''}
                    onClick={() => setState(it.id, s.v)}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  )
}
