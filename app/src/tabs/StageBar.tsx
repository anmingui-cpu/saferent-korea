import { STAGES } from '../data'
import { updateProject, type Project } from '../db'

export default function StageBar({ project }: { project: Project }) {
  return (
    <div className="card">
      <div className="group-title">진행단계</div>
      <div className="stage-flow">
        {STAGES.map((s, i) => (
          <button
            key={s}
            className={`stage-chip ${i < project.stage ? 'done' : ''} ${i === project.stage ? 'current' : ''}`}
            onClick={() => updateProject(project.id!, { stage: i })}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
