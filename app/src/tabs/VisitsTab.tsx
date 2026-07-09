import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Visit } from '../db'

export default function VisitsTab({ projectId }: { projectId: number }) {
  const visits = useLiveQuery(() => db.visits.where('projectId').equals(projectId).toArray(), [projectId])

  const addVisit = () =>
    db.visits.add({ projectId, date: new Date().toISOString().slice(0, 10), companions: '', memo: '' })

  const update = (id: number, changes: Partial<Visit>) => db.visits.update(id, changes)

  const remove = (id: number) => {
    if (confirm('이 방문 기록을 삭제할까요?')) db.visits.delete(id)
  }

  return (
    <>
      <button className="btn full ghost" onClick={addVisit}>＋ 방문 기록 추가</button>
      <div style={{ height: 12 }} />
      {visits?.length === 0 && <div className="empty">아직 방문 기록이 없어.<br />집은 여러 번 가볼수록 보이는 게 많아. 갈 때마다 기록해둬.</div>}
      {visits?.map((v, i) => (
        <div className="card" key={v.id}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <div className="group-title" style={{ margin: 0, flex: 1 }}>{i + 1}차 방문</div>
            <button className="btn danger sm" onClick={() => remove(v.id!)}>삭제</button>
          </div>
          <div className="field-row">
            <div className="field">
              <label>방문일</label>
              <input type="date" value={v.date} onChange={e => update(v.id!, { date: e.target.value })} />
            </div>
            <div className="field">
              <label>동행인</label>
              <input defaultValue={v.companions} placeholder="예: 부모님, 친구" onChange={e => update(v.id!, { companions: e.target.value })} />
            </div>
          </div>
          <div className="field">
            <label>메모</label>
            <textarea defaultValue={v.memo} placeholder="방문 시 느낀 점, 확인한 내용" onChange={e => update(v.id!, { memo: e.target.value })} />
          </div>
          <p className="muted">사진은 '사진' 탭에서 분류별로 정리해두자.</p>
        </div>
      ))}
    </>
  )
}
