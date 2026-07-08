import type { Project, Visit, Photo, Doc, CheckState } from './db'
import { CHECKLIST_GROUPS, LEGAL_GROUPS, RISK_ITEMS, STAGES, riskScore, riskLevel } from './data'

function toDataUrl(blob: Blob): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader()
    r.onload = () => res(r.result as string)
    r.onerror = rej
    r.readAsDataURL(blob)
  })
}

export async function generateHtmlReport(p: Project, visits: Visit[], photos: Photo[], docs: Doc[]): Promise<string> {
  const i = p.info
  const score = riskScore(p.risks)
  const level = riskLevel(score)
  const levelColor = level === '안전' ? '#16a34a' : level === '주의' ? '#d97706' : level === '위험' ? '#dc2626' : '#7f1d1d'

  const photoWithUrl = await Promise.all(
    photos.map(async ph => ({ ...ph, dataUrl: await toDataUrl(ph.blob) }))
  )
  const byCat = new Map<string, typeof photoWithUrl>()
  for (const ph of photoWithUrl) {
    if (!byCat.has(ph.category)) byCat.set(ph.category, [])
    byCat.get(ph.category)!.push(ph)
  }

  const flagged = RISK_ITEMS.filter(r => p.risks[r.id])

  const infoRows = [
    ['주소', i.address], ['건물명', i.buildingName], ['동/호수', i.unit], ['층수', i.floor],
    ['보증금', i.deposit ? `${i.deposit}만원` : ''], ['월세', i.rent ? `${i.rent}만원` : ''],
    ['관리비', i.maintenanceFee ? `${i.maintenanceFee}만원` : ''],
    ['계약기간', i.contractPeriod], ['입주 가능일', i.moveInDate],
    ['부동산', i.agencyName], ['공인중개사', i.agentName], ['담당자 연락처', i.agentPhone],
    ['집주인', i.landlordName], ['집주인 연락처', i.landlordPhone], ['메모', i.memo],
  ].filter(([, v]) => v) as [string, string][]

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>SafeRent 리포트 — ${i.buildingName || i.address || '검토 매물'}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Malgun Gothic',sans-serif;font-size:15px;line-height:1.6;color:#1b2430;background:#f4f6fa;padding:20px}
.wrap{max-width:820px;margin:0 auto;background:#fff;border-radius:12px;padding:28px;box-shadow:0 2px 10px rgba(0,0,0,.08)}
h1{font-size:22px;font-weight:800;margin-bottom:4px}
h2{font-size:17px;font-weight:700;margin:28px 0 10px;padding-bottom:6px;border-bottom:2px solid #e3e8ef}
h3{font-size:14px;font-weight:700;margin:14px 0 6px;color:#374151}
.meta{color:#6b7686;font-size:13px;margin-bottom:14px}
.badge{display:inline-block;padding:4px 16px;border-radius:999px;font-size:14px;font-weight:700;color:#fff;background:${levelColor}}
table{width:100%;border-collapse:collapse;font-size:14px;margin-bottom:6px}
td{padding:7px 10px;border-bottom:1px solid #e3e8ef}
td:first-child{font-weight:600;color:#6b7686;width:110px;white-space:nowrap}
.risk-box{background:#fee2e2;border-left:3px solid #dc2626;border-radius:6px;padding:8px 12px;margin-bottom:6px}
.risk-label{font-weight:700;color:#dc2626;font-size:14px}
.risk-desc{font-size:12.5px;color:#7f1d1d;margin-top:2px}
.chk-row{display:flex;justify-content:space-between;align-items:flex-start;padding:6px 0;border-bottom:1px solid #f0f0f0;font-size:14px;gap:8px}
.chk-row span:first-child{flex:1}
.ok{color:#16a34a;font-weight:600;white-space:nowrap}
.bad{color:#dc2626;font-weight:600;white-space:nowrap}
.na{color:#6b7686;white-space:nowrap}
.photo-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin:8px 0 16px}
.photo-cell{border-radius:8px;overflow:hidden;background:#e3e8ef;break-inside:avoid}
.photo-cell img{width:100%;aspect-ratio:1;object-fit:cover;display:block}
.photo-memo{font-size:11.5px;padding:4px 8px;color:#6b7686;background:#f9fafb}
.doc-item{padding:6px 0;font-size:14px;border-bottom:1px solid #f0f0f0}
.doc-type{color:#6b7686;font-size:12px;margin-right:4px}
.ai-box{background:#eff6ff;border-radius:8px;padding:16px;margin-top:8px}
.ai-box ol{padding-left:20px}
.ai-box li{margin-bottom:8px;font-size:14px}
.note{color:#9ca3af;font-size:12px;margin-top:20px;text-align:center}
.ok-msg{color:#16a34a;font-weight:600}
@media print{body{background:#fff;padding:0}.wrap{box-shadow:none}}
</style>
</head>
<body>
<div class="wrap">
<h1>${i.buildingName || i.address || '월세 검수 리포트'}</h1>
<p class="meta">생성일: ${new Date().toLocaleDateString('ko-KR')} · SafeRent Korea · 진행단계: ${STAGES[p.stage] ?? STAGES[0]}</p>
<span class="badge">${level} (${score}점)</span>

<h2>1. 기본정보</h2>
<table>${infoRows.map(([k, v]) => `<tr><td>${k}</td><td>${v.replace(/\n/g, '<br>')}</td></tr>`).join('')}</table>

<h2>2. 위험요소</h2>
${flagged.length === 0
  ? '<p class="ok-msg">발견된 위험요소 없음 ✅</p>'
  : flagged.map(r => `<div class="risk-box"><div class="risk-label">🚨 ${r.label} (+${r.score}점)</div><div class="risk-desc">${r.desc}</div></div>`).join('')}

<h2>3. 체크리스트</h2>
${CHECKLIST_GROUPS.map(g => {
  const checked = g.items.filter(it => p.checklist[it.id])
  if (!checked.length) return ''
  return `<h3>${g.name}</h3>${checked.map(it => {
    const s = p.checklist[it.id]
    const cls = s === 'ok' ? 'ok' : s === 'bad' ? 'bad' : 'na'
    const lbl = s === 'ok' ? '✅ 양호' : s === 'bad' ? '⚠️ 문제' : '해당없음'
    const memo = p.checklistMemo[it.id]
    return `<div class="chk-row"><span>${it.label}</span><span class="${cls}">${lbl}${memo ? ` — ${memo}` : ''}</span></div>`
  }).join('')}`
}).join('')}

<h2>4. 법률 검수</h2>
${LEGAL_GROUPS.map(g => `<h3>${g.name}</h3>${g.items.map(it => {
  const s = p.legal[it.id]
  const cls = s === 'ok' ? 'ok' : s === 'bad' ? 'bad' : s === 'na' ? 'na' : ''
  const lbl = s === 'ok' ? '✅ 확인완료' : s === 'bad' ? '⚠️ 문제' : s === 'na' ? '해당없음' : '미확인'
  const memo = p.legalMemo[it.id]
  return `<div class="chk-row"><span>${it.label}</span><span class="${cls}">${lbl}${memo ? ` — ${memo}` : ''}</span></div>`
}).join('')}`).join('')}

<h2>5. 방문 기록</h2>
${visits.length === 0
  ? '<p style="color:#6b7686">방문 기록 없음</p>'
  : visits.map((v, n) => `<p style="margin-bottom:4px">${n + 1}차 방문 (${v.date || '날짜 미입력'})${v.companions ? ` · 동행: ${v.companions}` : ''}${v.memo ? ` — ${v.memo}` : ''}</p>`).join('')}

<h2>6. 첨부문서 (${docs.length}건)</h2>
${docs.length === 0
  ? '<p style="color:#6b7686">첨부문서 없음</p>'
  : docs.map(d => `<div class="doc-item"><span class="doc-type">[${d.type}]</span>${d.name}${d.memo ? ` — ${d.memo}` : ''}</div>`).join('')}

<h2>7. 현장 사진 (${photos.length}장)</h2>
${photos.length === 0
  ? '<p style="color:#6b7686">사진 없음</p>'
  : [...byCat.entries()].map(([cat, items]) => `
<h3>${cat} (${items.length}장)</h3>
<div class="photo-grid">
${items.map(ph => `<div class="photo-cell"><img src="${ph.dataUrl}" alt="${ph.category}" loading="lazy">${ph.memo ? `<div class="photo-memo">${ph.memo}</div>` : ''}</div>`).join('')}
</div>`).join('')}

<h2>8. AI 검토 요청</h2>
<div class="ai-box">
<p style="margin-bottom:10px;font-size:14px">이 HTML 파일과 등기부등본·계약서 PDF를 AI에 첨부하고 아래 내용을 물어보세요:</p>
<ol>
<li>등기부등본 기준으로 이 계약에서 보증금을 잃을 수 있는 위험이 있는지 분석해 주세요. (근저당 채권최고액, 압류, 신탁, 소유자 일치 여부)</li>
<li>계약서의 특약사항 중 세입자에게 불리한 조항이 있는지, 추가해야 할 특약이 있는지 알려 주세요.</li>
<li>위 위험요소 목록에 대해 각각 어떻게 대응해야 하는지 구체적으로 알려 주세요.</li>
<li>보증금 보호를 위해 입주 전후에 반드시 해야 할 일(전입신고, 확정일자, 보증보험 등)을 순서대로 정리해 주세요.</li>
<li>종합적으로 이 계약을 진행해도 되는지, 진행한다면 어떤 조건을 걸어야 하는지 의견을 주세요.</li>
</ol>
</div>
<p class="note">본 리포트는 사용자가 입력한 정보를 정리한 것으로 법률 자문이 아닙니다.</p>
</div>
</body>
</html>`
}

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
