import { useState } from 'react'
import { db, type Project } from '../db'
import { generateReport } from '../report'

export default function ReportTab({ project }: { project: Project }) {
  const [md, setMd] = useState('')
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    const pid = project.id!
    const [visits, photos, docs] = await Promise.all([
      db.visits.where('projectId').equals(pid).toArray(),
      db.photos.where('projectId').equals(pid).toArray(),
      db.docs.where('projectId').equals(pid).toArray(),
    ])
    setMd(generateReport(project, visits, photos, docs))
    setCopied(false)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(md)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const download = () => {
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `SafeRent_리포트_${project.info.buildingName || project.id}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div className="card">
        <div className="group-title">AI 검토용 리포트</div>
        <p className="muted" style={{ marginBottom: 10 }}>
          지금까지 입력한 모든 자료를 Markdown 하나로 정리합니다. 생성된 리포트를 등기부등본·계약서 파일과 함께
          AI(Claude 등)에 붙여넣으면 계약 위험 검토를 받을 수 있습니다. 리포트는 버튼을 눌렀을 때만 생성됩니다.
        </p>
        <button className="btn full" onClick={generate}>📋 리포트 생성</button>
      </div>

      {md && (
        <div className="card">
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <button className="btn ghost sm" style={{ flex: 1 }} onClick={copy}>
              {copied ? '✅ 복사됨' : '클립보드 복사'}
            </button>
            <button className="btn ghost sm" style={{ flex: 1 }} onClick={download}>.md 다운로드</button>
          </div>
          <pre className="report-pre">{md}</pre>
        </div>
      )}
    </>
  )
}
