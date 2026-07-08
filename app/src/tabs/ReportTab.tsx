import { useState } from 'react'
import { db, type Project } from '../db'
import { generateReport, generateHtmlReport } from '../report'

export default function ReportTab({ project }: { project: Project }) {
  const [md, setMd] = useState('')
  const [copied, setCopied] = useState(false)
  const [htmlLoading, setHtmlLoading] = useState(false)

  const loadData = async () => {
    const pid = project.id!
    return Promise.all([
      db.visits.where('projectId').equals(pid).toArray(),
      db.photos.where('projectId').equals(pid).toArray(),
      db.docs.where('projectId').equals(pid).toArray(),
    ])
  }

  const generate = async () => {
    const [visits, photos, docs] = await loadData()
    setMd(generateReport(project, visits, photos, docs))
    setCopied(false)
  }

  const downloadHtml = async () => {
    setHtmlLoading(true)
    try {
      const [visits, photos, docs] = await loadData()
      const html = await generateHtmlReport(project, visits, photos, docs)
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `SafeRent_리포트_${project.info.buildingName || project.id}.html`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setHtmlLoading(false)
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(md)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadMd = () => {
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
        <p className="muted" style={{ marginBottom: 12 }}>
          지금까지 입력한 자료를 하나로 묶어준단다. AI(Claude 같은 것)에 넘길 때 두 가지 방법이 있어.
        </p>
        <button className="btn full" style={{ marginBottom: 8 }} onClick={downloadHtml} disabled={htmlLoading}>
          {htmlLoading ? '⏳ 사진 변환 중…' : '📦 HTML 내보내기 (사진 포함)'}
        </button>
        <p className="muted" style={{ marginBottom: 12 }}>
          HTML 파일 하나에 현장 사진이 전부 포함돼. 이 파일을 등기부등본·계약서 PDF와 함께 AI에 첨부하렴.
        </p>
        <button className="btn ghost full" onClick={generate}>📋 텍스트 리포트 생성 (복사용)</button>
      </div>

      {md && (
        <div className="card">
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <button className="btn ghost sm" style={{ flex: 1 }} onClick={copy}>
              {copied ? '✅ 복사됨' : '클립보드 복사'}
            </button>
            <button className="btn ghost sm" style={{ flex: 1 }} onClick={downloadMd}>.md 다운로드</button>
          </div>
          <pre className="report-pre">{md}</pre>
        </div>
      )}
    </>
  )
}
