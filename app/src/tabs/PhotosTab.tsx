import { useEffect, useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import { PHOTO_CATEGORIES, REQUIRED_PHOTO_CATS } from '../data'

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
  const reqFileRef = useRef<HTMLInputElement>(null)
  const reqCameraRef = useRef<HTMLInputElement>(null)
  const pendingCatRef = useRef<string | null>(null)

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

  const onReqFiles = async (files: FileList | null) => {
    if (!files || !pendingCatRef.current) return
    const cat = pendingCatRef.current
    for (const f of Array.from(files)) {
      await db.photos.add({ projectId, category: cat, memo: '', blob: f, createdAt: Date.now() })
    }
    setSavedCount(c => c + files.length)
    if (reqFileRef.current) reqFileRef.current.value = ''
    if (reqCameraRef.current) reqCameraRef.current.value = ''
    pendingCatRef.current = null
  }

  const remove = (id: number) => {
    if (confirm('사진을 삭제할까요?')) db.photos.delete(id)
  }

  const photosFor = (cat: string) => (photos ?? []).filter(p => p.category === cat)

  const reqDone = REQUIRED_PHOTO_CATS.reduce((sum, cat) => sum + Math.min(photosFor(cat).length, 2), 0)
  const reqTotal = REQUIRED_PHOTO_CATS.length * 2

  const optionalGroups = PHOTO_CATEGORIES
    .filter(c => !(REQUIRED_PHOTO_CATS as readonly string[]).includes(c))
    .map(cat => ({ cat, items: photosFor(cat) }))
    .filter(g => g.items.length > 0)

  return (
    <>
      {/* 필수 사진 — hidden inputs */}
      <input ref={reqCameraRef} type="file" accept="image/*" capture="environment" hidden
        onChange={e => onReqFiles(e.target.files)} />
      <input ref={reqFileRef} type="file" accept="image/*" multiple hidden
        onChange={e => onReqFiles(e.target.files)} />

      <div className="card">
        <div className="group-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          필수 사진
          <span className={`req-progress${reqDone >= reqTotal ? ' done' : ''}`}>{reqDone}/{reqTotal}</span>
        </div>
        <p className="muted" style={{ marginBottom: 10 }}>각 장소 2장씩 찍어두면 100% 달성이야.</p>
        {REQUIRED_PHOTO_CATS.map(cat => {
          const items = photosFor(cat)
          const isComplete = items.length >= 2
          return (
            <div className="req-cat" key={cat}>
              <div className="req-cat-header">
                <span className="req-cat-name">{cat}</span>
                <span className={`req-cat-count${isComplete ? ' done' : ''}`}>{items.length}/2</span>
                <button className="btn ghost sm" onClick={() => { pendingCatRef.current = cat; reqCameraRef.current?.click() }}>📷</button>
                <button className="btn ghost sm" onClick={() => { pendingCatRef.current = cat; reqFileRef.current?.click() }}>🖼</button>
              </div>
              {items.length > 0 ? (
                <div className="photo-grid" style={{ marginTop: 8 }}>
                  {items.map(p => (
                    <div className="photo-cell" key={p.id}>
                      <PhotoImg blob={p.blob} />
                      <button className="del" onClick={() => remove(p.id!)}>✕</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="req-cat-empty">아직 사진이 없어</div>
              )}
            </div>
          )
        })}
      </div>

      {/* 선택 사진 */}
      {optionalGroups.map(g => (
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

      {/* 선택 사진 추가 */}
      <div className="card">
        <div className="group-title">선택 사진 추가</div>
        <div className="field">
          <label>분류 선택</label>
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
            ✅ [{category}]로 총 {savedCount}장 저장됐어!
          </p>
        )}
        <p className="muted" style={{ marginTop: 6 }}>분류 먼저 고르고 찍으면 바로 저장돼.</p>
      </div>
    </>
  )
}
