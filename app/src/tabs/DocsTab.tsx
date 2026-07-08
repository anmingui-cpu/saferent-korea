import { useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { DOC_TYPES } from '../data'

export default function DocsTab({ projectId }: { projectId: number }) {
  const [type, setType] = useState(DOC_TYPES[0])
  const fileRef = useRef<HTMLInputElement>(null)
  const docs = useLiveQuery(() => db.docs.where('projectId').equals(projectId).toArray(), [projectId])

  const onFiles = async (files: FileList | null) => {
    if (!files) return
    for (const f of Array.from(files)) {
      await db.docs.add({ projectId, type, name: f.name, memo: '', blob: f, createdAt: Date.now() })
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  const download = (name: string, blob: Blob) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    URL.revokeObjectURL(url)
  }

  const remove = (id: number) => {
    if (confirm('문서를 삭제할까요?')) db.docs.delete(id)
  }

  return (
    <>
      <div className="card">
        <div className="field">
          <label>문서 종류 선택 후 추가</label>
          <select value={type} onChange={e => setType(e.target.value)}>
            {DOC_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <input ref={fileRef} type="file" multiple hidden onChange={e => onFiles(e.target.files)} />
        <button className="btn full" onClick={() => fileRef.current?.click()}>📄 [{type}] 파일 추가</button>
        <p className="muted" style={{ marginTop: 8 }}>PDF·이미지 등 모든 파일 형식을 이 기기 안에만 저장합니다.</p>
      </div>

      {docs?.length === 0 && <div className="empty">첨부된 문서가 없습니다.</div>}

      {DOC_TYPES.map(t => {
        const items = (docs ?? []).filter(d => d.type === t)
        if (items.length === 0) return null
        return (
          <div className="card" key={t}>
            <div className="group-title">{t} ({items.length})</div>
            {items.map(d => (
              <div className="doc-item" key={d.id}>
                <div className="meta">
                  <div className="name">{d.name}</div>
                  <div className="muted">{new Date(d.createdAt).toLocaleDateString('ko-KR')}</div>
                </div>
                <button className="btn ghost sm" onClick={() => download(d.name, d.blob)}>열기</button>
                <button className="btn danger sm" onClick={() => remove(d.id!)}>삭제</button>
              </div>
            ))}
          </div>
        )
      })}
    </>
  )
}
