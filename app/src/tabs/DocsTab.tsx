import { useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { DOC_TYPES, DOC_TYPE_DESCS, REQUIRED_DOC_TYPES } from '../data'

export default function DocsTab({ projectId }: { projectId: number }) {
  const [type, setType] = useState(() => DOC_TYPES.find(t => !(REQUIRED_DOC_TYPES as readonly string[]).includes(t)) ?? DOC_TYPES[0])
  const fileRef = useRef<HTMLInputElement>(null)
  const reqFileRef = useRef<HTMLInputElement>(null)
  const pendingTypeRef = useRef<string | null>(null)
  const docs = useLiveQuery(() => db.docs.where('projectId').equals(projectId).toArray(), [projectId])

  const addFiles = async (files: FileList | null, docType: string) => {
    if (!files) return
    for (const f of Array.from(files)) {
      await db.docs.add({ projectId, type: docType, name: f.name, memo: '', blob: f, createdAt: Date.now() })
    }
    if (fileRef.current) fileRef.current.value = ''
    if (reqFileRef.current) reqFileRef.current.value = ''
  }

  const download = (name: string, blob: Blob) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = name; a.click()
    URL.revokeObjectURL(url)
  }

  const remove = (id: number) => {
    if (confirm('문서를 삭제할까요?')) db.docs.delete(id)
  }

  const docsFor = (docType: string) => (docs ?? []).filter(d => d.type === docType)

  const reqDone = REQUIRED_DOC_TYPES.filter(t => docsFor(t).length > 0).length

  const optionalGroups = DOC_TYPES
    .filter(t => !(REQUIRED_DOC_TYPES as readonly string[]).includes(t))
    .map(t => ({ type: t, items: docsFor(t) }))
    .filter(g => g.items.length > 0)

  const renderDocItems = (items: ReturnType<typeof docsFor>) =>
    items.map(d => (
      <div className="doc-item" key={d.id}>
        <div className="meta">
          <div className="name">{d.name}</div>
          <div className="muted">{new Date(d.createdAt).toLocaleDateString('ko-KR')}</div>
        </div>
        <button className="btn ghost sm" onClick={() => download(d.name, d.blob)}>열기</button>
        <button className="btn danger sm" onClick={() => remove(d.id!)}>삭제</button>
      </div>
    ))

  return (
    <>
      {/* 필수 서류 hidden input */}
      <input ref={reqFileRef} type="file" multiple hidden
        onChange={e => { if (pendingTypeRef.current) addFiles(e.target.files, pendingTypeRef.current) }} />

      {/* 필수 서류 */}
      <div className="card">
        <div className="group-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          필수 서류
          <span className={`req-progress${reqDone >= REQUIRED_DOC_TYPES.length ? ' done' : ''}`}>
            {reqDone}/{REQUIRED_DOC_TYPES.length}
          </span>
        </div>
        <p className="muted" style={{ marginBottom: 10 }}>4개 서류 모두 확보해두면 완료야.</p>
        {REQUIRED_DOC_TYPES.map(docType => {
          const items = docsFor(docType)
          return (
            <div className="req-cat" key={docType}>
              <div className="req-cat-header">
                <span className="req-cat-name">{docType}</span>
                <span className={`req-cat-count${items.length > 0 ? ' done' : ''}`}>
                  {items.length > 0 ? `${items.length}개` : '없음'}
                </span>
                <button className="btn ghost sm" onClick={() => { pendingTypeRef.current = docType; reqFileRef.current?.click() }}>
                  + 추가
                </button>
              </div>
              {DOC_TYPE_DESCS[docType] && (
                <div className="doc-req-why">{DOC_TYPE_DESCS[docType].why}</div>
              )}
              {items.length > 0 ? renderDocItems(items) : (
                <div className="req-cat-empty">아직 파일이 없어</div>
              )}
            </div>
          )
        })}
      </div>

      {/* 선택 서류 (있는 것만) */}
      {optionalGroups.map(g => (
        <div className="card" key={g.type}>
          <div className="group-title">{g.type} ({g.items.length})</div>
          {renderDocItems(g.items)}
        </div>
      ))}

      {/* 기타 서류 추가 */}
      <div className="card">
        <div className="group-title">기타 서류 추가</div>
        <div className="field">
          <label>문서 종류 선택 후 추가</label>
          <select value={type} onChange={e => setType(e.target.value)}>
            {DOC_TYPES.filter(t => !(REQUIRED_DOC_TYPES as readonly string[]).includes(t)).map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        {DOC_TYPE_DESCS[type] && (
          <div className="doc-desc">
            <div className="doc-desc-why">📌 {DOC_TYPE_DESCS[type].why}</div>
            <div className="doc-desc-role">{DOC_TYPE_DESCS[type].role}</div>
          </div>
        )}
        <input ref={fileRef} type="file" multiple hidden onChange={e => addFiles(e.target.files, type)} />
        <button className="btn full" onClick={() => fileRef.current?.click()}>📄 [{type}] 파일 추가</button>
        <p className="muted" style={{ marginTop: 8 }}>PDF든 사진이든 다 넣어둬. 이 기기에만 저장되니까 걱정 없어.</p>
      </div>
    </>
  )
}
