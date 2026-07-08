import { Fragment } from 'react'
import { STAGES } from '../data'
import { updateProject, type Project } from '../db'

export default function StageBar({ project }: { project: Project }) {
  return (
    <div className="card">
      <div className="group-title">진행단계</div>
      <p className="muted" style={{ marginBottom: 8 }}>지금 어디까지 왔는지 단계를 눌러서 표시해두렴.</p>
      <div className="stage-flow">
        {STAGES.map((s, i) => (
          <Fragment key={s}>
            <button
              className={`stage-card ${i < project.stage ? 'done' : ''} ${i === project.stage ? 'current' : ''}`}
              onClick={() => updateProject(project.id!, { stage: i })}
            >
              <span className="stage-num">{i < project.stage ? '✓' : i + 1}</span>
              {s}
            </button>
            {i < STAGES.length - 1 && <span className="stage-arrow">➜</span>}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
