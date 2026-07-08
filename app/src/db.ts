import Dexie, { type Table } from 'dexie'

export type CheckState = 'ok' | 'bad' | 'na'

export interface BasicInfo {
  address: string
  buildingName: string
  unit: string // 동/호수
  floor: string
  deposit: string // 보증금(만원)
  rent: string // 월세(만원)
  maintenanceFee: string // 관리비(만원)
  contractPeriod: string
  moveInDate: string
  options: string
  parking: string // '' | '가능' | '불가'
  pets: string
  agencyName: string // 부동산 상호
  agentName: string // 공인중개사명
  agentPhone: string
  landlordName: string
  landlordPhone: string
  memo: string
}

export const emptyInfo = (): BasicInfo => ({
  address: '', buildingName: '', unit: '', floor: '',
  deposit: '', rent: '', maintenanceFee: '',
  contractPeriod: '', moveInDate: '', options: '',
  parking: '', pets: '',
  agencyName: '', agentName: '', agentPhone: '',
  landlordName: '', landlordPhone: '', memo: '',
})

export interface Project {
  id?: number
  createdAt: number
  updatedAt: number
  stage: number // STAGES index
  info: BasicInfo
  checklist: Record<string, CheckState>
  checklistMemo: Record<string, string>
  legal: Record<string, CheckState>
  legalMemo: Record<string, string>
  risks: Record<string, boolean>
}

export interface Visit {
  id?: number
  projectId: number
  date: string
  companions: string
  memo: string
}

export interface Photo {
  id?: number
  projectId: number
  visitId?: number
  category: string
  memo: string
  blob: Blob
  createdAt: number
}

export interface Doc {
  id?: number
  projectId: number
  type: string
  name: string
  memo: string
  blob: Blob
  createdAt: number
}

class SafeRentDB extends Dexie {
  projects!: Table<Project, number>
  visits!: Table<Visit, number>
  photos!: Table<Photo, number>
  docs!: Table<Doc, number>

  constructor() {
    super('saferent-korea')
    this.version(1).stores({
      projects: '++id, updatedAt',
      visits: '++id, projectId',
      photos: '++id, projectId, category',
      docs: '++id, projectId, type',
    })
  }
}

export const db = new SafeRentDB()

export async function createProject(): Promise<number> {
  const now = Date.now()
  return db.projects.add({
    createdAt: now, updatedAt: now, stage: 0,
    info: emptyInfo(),
    checklist: {}, checklistMemo: {},
    legal: {}, legalMemo: {},
    risks: {},
  })
}

export async function updateProject(id: number, changes: Partial<Project>) {
  await db.projects.update(id, { ...changes, updatedAt: Date.now() })
}

// 연속 업데이트가 서로 덮어쓰지 않도록 DB 안에서 read-modify-write
export async function modifyProject(id: number, fn: (p: Project) => void) {
  await db.projects.where(':id').equals(id).modify(p => {
    fn(p)
    p.updatedAt = Date.now()
  })
}

export async function deleteProject(id: number) {
  await db.transaction('rw', [db.projects, db.visits, db.photos, db.docs], async () => {
    await db.visits.where('projectId').equals(id).delete()
    await db.photos.where('projectId').equals(id).delete()
    await db.docs.where('projectId').equals(id).delete()
    await db.projects.delete(id)
  })
}
