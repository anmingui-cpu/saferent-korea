import type { Project, Visit, Photo, Doc, CheckState } from './db'
import { CHECKLIST_GROUPS, LEGAL_GROUPS, RISK_ITEMS, STAGES, riskScore, riskLevel } from './data'

const stateLabel = (s?: CheckState) =>
  s === 'ok' ? '✅ 양호' : s === 'bad' ? '⚠️ 문제' : s === 'na' ? '해당없음' : '미확인'

const legalLabel = (s?: CheckState) =>
  s === 'ok' ? '✅ 확인완료' : s === 'bad' ? '⚠️ 문제 발견' : s === 'na' ? '해당없음' : '미확인'

export function generateReport(p: Project, visits: Visit[], photos: Photo[], docs: Doc[]): string {
  const i = p.info
  const score = riskScore(p.risks)
  const level = riskLevel(score)
  const L: string[] = []

  L.push(`# 월세 계약 검수 리포트 — ${i.buildingName || i.address || '이름 없음'}`)
  L.push('')
  L.push(`> 생성일: ${new Date().toLocaleDateString('ko-KR')} · SafeRent Korea`)
  L.push(`> 진행단계: ${STAGES[p.stage] ?? STAGES[0]}`)
  L.push('')
  L.push(`## ⚠️ 위험도: ${level} (${score}점)`)
  L.push('')

  L.push('## 1. 기본정보')
  L.push('')
  const rows: [string, string][] = [
    ['주소', i.address], ['건물명', i.buildingName], ['동/호수', i.unit], ['층수', i.floor],
    ['보증금', i.deposit && `${i.deposit}만원`], ['월세', i.rent && `${i.rent}만원`],
    ['관리비', i.maintenanceFee && `${i.maintenanceFee}만원`],
    ['계약기간', i.contractPeriod], ['입주 가능일', i.moveInDate], ['옵션', i.options],
    ['주차', i.parking], ['반려동물', i.pets],
    ['부동산 상호', i.agencyName], ['공인중개사', i.agentName], ['담당자 연락처', i.agentPhone],
    ['집주인', i.landlordName], ['집주인 연락처', i.landlordPhone], ['메모', i.memo],
  ].filter(([, v]) => v) as [string, string][]
  L.push('| 항목 | 내용 |')
  L.push('|---|---|')
  rows.forEach(([k, v]) => L.push(`| ${k} | ${v.replace(/\n/g, ' ')} |`))
  L.push('')

  L.push('## 2. 위험요소')
  L.push('')
  const flagged = RISK_ITEMS.filter(r => p.risks[r.id])
  if (flagged.length === 0) L.push('발견된 위험요소 없음')
  else flagged.forEach(r => L.push(`- 🚨 **${r.label}** (+${r.score}점): ${r.desc}`))
  L.push('')

  L.push('## 3. 체크리스트 결과')
  L.push('')
  for (const g of CHECKLIST_GROUPS) {
    const checked = g.items.filter(it => p.checklist[it.id])
    if (checked.length === 0) continue
    L.push(`### ${g.name}`)
    for (const it of checked) {
      const memo = p.checklistMemo[it.id]
      L.push(`- ${it.label}: ${stateLabel(p.checklist[it.id])}${memo ? ` — ${memo}` : ''}`)
    }
    L.push('')
  }

  L.push('## 4. 법률 검수')
  L.push('')
  for (const g of LEGAL_GROUPS) {
    L.push(`### ${g.name}`)
    for (const it of g.items) {
      const memo = p.legalMemo[it.id]
      L.push(`- ${it.label}: ${legalLabel(p.legal[it.id])}${memo ? ` — ${memo}` : ''}`)
    }
    L.push('')
  }

  L.push('## 5. 방문 기록')
  L.push('')
  if (visits.length === 0) L.push('방문 기록 없음')
  else visits.forEach((v, n) => {
    L.push(`- ${n + 1}차 방문 (${v.date || '날짜 미입력'})${v.companions ? ` · 동행: ${v.companions}` : ''}${v.memo ? ` — ${v.memo}` : ''}`)
  })
  L.push('')

  L.push('## 6. 첨부문서 및 사진')
  L.push('')
  if (docs.length === 0) L.push('- 첨부문서: 없음')
  else {
    L.push(`- 첨부문서 ${docs.length}건:`)
    docs.forEach(d => L.push(`  - [${d.type}] ${d.name}${d.memo ? ` — ${d.memo}` : ''}`))
  }
  const byCat = new Map<string, number>()
  photos.forEach(ph => byCat.set(ph.category, (byCat.get(ph.category) ?? 0) + 1))
  L.push(`- 사진 총 ${photos.length}장${byCat.size ? ` (${[...byCat].map(([c, n]) => `${c} ${n}`).join(', ')})` : ''}`)
  L.push('')

  L.push('## 7. AI 검토 요청 (질문 템플릿)')
  L.push('')
  L.push('위 자료와 첨부한 문서(등기부등본·계약서 등)를 바탕으로 다음을 검토해 주세요:')
  L.push('')
  L.push('1. 등기부등본 기준으로 이 계약에서 보증금을 잃을 수 있는 위험이 있는지 분석해 주세요. (근저당 채권최고액, 압류, 신탁, 소유자 일치 여부)')
  L.push('2. 계약서의 특약사항 중 세입자에게 불리한 조항이 있는지, 추가해야 할 특약이 있는지 알려 주세요.')
  L.push('3. 위 위험요소 목록에 대해 각각 어떻게 대응해야 하는지 구체적으로 알려 주세요.')
  L.push('4. 보증금 보호를 위해 입주 전후에 반드시 해야 할 일(전입신고, 확정일자, 보증보험 등)을 순서대로 정리해 주세요.')
  L.push('5. 종합적으로 이 계약을 진행해도 되는지, 진행한다면 어떤 조건을 걸어야 하는지 의견을 주세요.')
  L.push('')
  L.push('---')
  L.push('*본 리포트는 사용자가 입력한 정보를 정리한 것으로 법률 자문이 아닙니다.*')

  return L.join('\n')
}
