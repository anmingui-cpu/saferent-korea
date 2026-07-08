import { useEffect, useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { PHOTO_CATEGORIES } from '../data'

function PhotoImg({ blob }: { blob: Blob }) {
  const [url, setUrl] = useState('')
  useEffect(() => {
    const u = URL.createObjectURL(blob)
    setUrl(u)
    return () => URL.revokeObjectURL(u)
  }, [blob])
  return url ? <img src={url} alt="" loading="lazy" /> : null
}

export default function PhotosTab({ projectId }: { projectId: number }) {
  const [category, setCategory] = useState(PHOTO_CATEGORIES[0])
  const [savedCount, setSavedCount] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)
  const photos = useLiveQuery(
    () => db.photos.where('projectId').equals(projectId).reverse().sortBy('createdAt'),
    [projectId],
  )

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    for (const f of Array.from(files)) {
      await db.photos.add({ projectId, category, memo: '', blob: f, createdAt: Date.now() })
    }
    setSavedCount(c => c + files.length)
    if (fileRef.current) fileRef.current.value = ''
    if (cameraRef.current) cameraRef.current.value = ''
  }

  const remove = (id: number) => {
    if (confirm('사진을 삭제할까요?')) db.photos.delete(id)
  }

  const grouped = PHOTO_CATEGORIES.map(cat => ({
    cat,
    items: (photos ?? []).filter(p => p.category === cat),
  })).filter(g => g.items.length > 0)

  return (
    <>
      <div className="card">
        <div className="field">
          <label>① 분류 먼저 고르고 → ② 카메라로 찍거나 앨범에서 선택</label>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {PHOTO_CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" hidden
          onChange={e => onFiles(e.target.files)} />
        <input ref={fileRef} type="file" accept="image/*" multiple hidden
          onChange={e => onFiles(e.target.files)} />
        <button className="btn full" style={{ marginBottom: 8 }} onClick={() => cameraRef.current?.click()}>
          📷 지금 바로 찍어서 등록
        </button>
        <button className="btn ghost full" onClick={() => fileRef.current?.click()}>
          🖼 앨범에서 골라서 등록
        </button>
        {savedCount > 0 && (
          <p style={{ marginTop: 8, color: 'var(--ok)', fontWeight: 600, fontSize: 13 }}>
            ✅ [{category}]로 총 {savedCount}장 저장됐단다!
          </p>
        )}
        <p className="muted" style={{ marginTop: 6 }}>분류를 먼저 고른 뒤 찍으면 바로 저장된단다.</p>
      </div>

      {photos?.length === 0 && <div className="empty">아직 사진이 없구나.<br />많이 찍어둘수록 나중에 비교할 때 큰 도움이 된단다.</div>}

      {grouped.map(g => (
        <div className="card" key={g.cat}>
          <div className="group-title">{g.cat} ({g.items.length})</div>
          <div className="photo-grid">
            {g.items.map(p => (
              <div className="photo-cell" key={p.id}>
                <PhotoImg blob={p.blob} />
                <span className="cat">{p.category}</span>
                <button className="del" onClick={() => remove(p.id!)}>✕</button>
              </div>
            ))}
          </div>
          {g.items.map(p => (
            <div className="chk-memo" key={p.id}>
              <input defaultValue={p.memo} placeholder={`사진 메모 (#${p.id})`}
                onChange={e => db.photos.update(p.id!, { memo: e.target.value })} />
            </div>
          ))}
        </div>
      ))}
    </>
  )
}
