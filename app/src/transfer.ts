import { db, type Project } from './db'

// 매물 1건을 사진·문서 포함 JSON 파일로 내보내기 / 가져오기 (기기 간 공유용)

const FORMAT = 'saferent-korea-project'
const VERSION = 1

interface BlobJson { mime: string; dataB64: string }

const blobToJson = (blob: Blob): Promise<BlobJson> =>
  new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => {
      const dataUrl = r.result as string
      resolve({ mime: blob.type, dataB64: dataUrl.slice(dataUrl.indexOf(',') + 1) })
    }
    r.onerror = () => reject(r.error)
    r.readAsDataURL(blob)
  })

const jsonToBlob = (b: BlobJson): Blob => {
  const bin = atob(b.dataB64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return new Blob([bytes], { type: b.mime })
}

export async function buildExportPayload(id: number) {
  const project = await db.projects.get(id)
  if (!project) throw new Error('매물을 찾을 수 없습니다')
  const [visits, photos, docs] = await Promise.all([
    db.visits.where('projectId').equals(id).toArray(),
    db.photos.where('projectId').equals(id).toArray(),
    db.docs.where('projectId').equals(id).toArray(),
  ])
  return {
    format: FORMAT,
    version: VERSION,
    exportedAt: new Date().toISOString(),
    project: { ...project, id: undefined },
    visits: visits.map(v => ({ ...v, id: undefined, projectId: undefined })),
    photos: await Promise.all(photos.map(async p => ({
      category: p.category, memo: p.memo, createdAt: p.createdAt,
      file: await blobToJson(p.blob),
    }))),
    docs: await Promise.all(docs.map(async d => ({
      type: d.type, name: d.name, memo: d.memo, createdAt: d.createdAt,
      file: await blobToJson(d.blob),
    }))),
  }
}

export async function exportProject(id: number) {
  const payload = await buildExportPayload(id)
  const name = payload.project.info.buildingName || payload.project.info.address || `매물${id}`
  const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `SafeRent_${name}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

export async function importProject(file: File): Promise<number> {
  const data = JSON.parse(await file.text())
  if (data.format !== FORMAT) throw new Error('SafeRent 매물 파일이 아닙니다')
  const now = Date.now()
  const p = data.project as Project
  const newId = await db.projects.add({
    ...p, id: undefined, createdAt: now, updatedAt: now,
    checklist: p.checklist ?? {}, checklistMemo: p.checklistMemo ?? {},
    legal: p.legal ?? {}, legalMemo: p.legalMemo ?? {},
    risks: p.risks ?? {},
  })
  for (const v of data.visits ?? []) {
    await db.visits.add({ ...v, id: undefined, projectId: newId })
  }
  for (const ph of data.photos ?? []) {
    await db.photos.add({
      projectId: newId, category: ph.category, memo: ph.memo,
      createdAt: ph.createdAt, blob: jsonToBlob(ph.file),
    })
  }
  for (const d of data.docs ?? []) {
    await db.docs.add({
      projectId: newId, type: d.type, name: d.name, memo: d.memo,
      createdAt: d.createdAt, blob: jsonToBlob(d.file),
    })
  }
  return newId
}
