import { modifyProject, type Project, type BasicInfo } from '../db'

interface FieldDef { key: keyof BasicInfo; label: string; type?: 'text' | 'number' | 'date' | 'textarea' | 'select'; options?: string[]; placeholder?: string }

const FIELDS: FieldDef[][] = [
  [{ key: 'address', label: '주소', placeholder: '도로명 주소' }],
  [{ key: 'buildingName', label: '건물명' }, { key: 'unit', label: '동/호수' }],
  [{ key: 'floor', label: '층수' }, { key: 'moveInDate', label: '입주 가능일', type: 'date' }],
  [{ key: 'deposit', label: '보증금 (만원)', type: 'number' }, { key: 'rent', label: '월세 (만원)', type: 'number' }],
  [{ key: 'maintenanceFee', label: '관리비 (만원)', type: 'number' }, { key: 'contractPeriod', label: '계약기간', placeholder: '예: 2년' }],
  [{ key: 'parking', label: '주차', type: 'select', options: ['', '가능', '불가', '확인필요'] },
   { key: 'pets', label: '반려동물', type: 'select', options: ['', '가능', '불가', '협의'] }],
  [{ key: 'options', label: '옵션', placeholder: '예: 에어컨, 냉장고, 세탁기', type: 'textarea' }],
  [{ key: 'agencyName', label: '부동산 상호' }, { key: 'agentName', label: '공인중개사명' }],
  [{ key: 'agentPhone', label: '담당자 연락처' }],
  [{ key: 'landlordName', label: '집주인 이름' }, { key: 'landlordPhone', label: '집주인 연락처' }],
  [{ key: 'memo', label: '메모', type: 'textarea' }],
]

export default function BasicInfoTab({ project }: { project: Project }) {
  const set = (key: keyof BasicInfo, value: string) =>
    modifyProject(project.id!, p => { p.info[key] = value })

  return (
    <div className="card">
      <div className="group-title">기본정보</div>
      <p className="muted" style={{ marginBottom: 12 }}>입력 즉시 자동 저장됩니다.</p>
      {FIELDS.map((row, ri) => (
        <div key={ri} className={row.length === 2 ? 'field-row' : undefined}>
          {row.map(f => (
            <div className="field" key={f.key}>
              <label>{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea key={project.id} defaultValue={project.info[f.key]} placeholder={f.placeholder}
                  onChange={e => set(f.key, e.target.value)} />
              ) : f.type === 'select' ? (
                <select value={project.info[f.key]} onChange={e => set(f.key, e.target.value)}>
                  {f.options!.map(o => <option key={o} value={o}>{o || '선택'}</option>)}
                </select>
              ) : (
                <input key={project.id} type={f.type ?? 'text'} defaultValue={project.info[f.key]} placeholder={f.placeholder}
                  onChange={e => set(f.key, e.target.value)} />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
