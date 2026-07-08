import { RISK_ITEMS, riskScore, riskLevel, RISK_COLORS } from '../data'
import { modifyProject, type Project } from '../db'

export default function RisksTab({ project }: { project: Project }) {
  const score = riskScore(project.risks)
  const level = riskLevel(score)

  const toggle = (id: string) =>
    modifyProject(project.id!, p => { p.risks[id] = !p.risks[id] })

  return (
    <>
      <div className="card risk-summary">
        <div className="score-big" style={{ color: RISK_COLORS[level] }}>{score}점</div>
        <div className="level" style={{ color: RISK_COLORS[level] }}>{level}</div>
        <p className="muted" style={{ marginTop: 6 }}>
          0점 안전 · 1~49점 주의 · 50~99점 위험 · 100점 이상 매우 위험
        </p>
        {level === '매우 위험' && (
          <p style={{ color: 'var(--danger)', fontWeight: 700, marginTop: 8 }}>
            이 매물은 계약을 중단하고 전문가와 상담하세요.
          </p>
        )}
      </div>

      <div className="card">
        <div className="group-title">위험요소 점검</div>
        <p className="muted" style={{ marginBottom: 6 }}>해당하는 항목을 모두 체크하세요. 점수가 자동 합산됩니다.</p>
        {RISK_ITEMS.map(r => (
          <label className="risk-item" key={r.id}>
            <input type="checkbox" checked={!!project.risks[r.id]} onChange={() => toggle(r.id)} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{r.label}</div>
              <div className="desc">{r.desc}</div>
            </div>
            <span className="score">+{r.score}</span>
          </label>
        ))}
      </div>
    </>
  )
}
