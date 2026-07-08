import { db, emptyInfo } from './db'

// 데모용 더미 매물: 겉은 멀쩡한데 서류가 위험한 집 시나리오
export async function seedDemo(): Promise<number> {
  const now = Date.now()
  const id = await db.projects.add({
    createdAt: now, updatedAt: now, stage: 4,
    info: {
      ...emptyInfo(),
      address: '서울시 관악구 신림로 123-45',
      buildingName: '신림 스카이빌 (데모)',
      unit: 'A동 302호',
      floor: '3층 / 5층',
      deposit: '1000', rent: '55', maintenanceFee: '7',
      contractPeriod: '2년', moveInDate: '2026-08-01',
      options: '에어컨, 냉장고, 세탁기, 인덕션',
      parking: '가능', pets: '불가',
      agencyName: '행복공인중개사', agentName: '김중개', agentPhone: '010-1234-5678',
      landlordName: '박소유', landlordPhone: '010-9876-5432',
      memo: '역세권. 채광 좋음. 등기부상 근저당 6억 확인 필요',
    },
    checklist: {
      mold: 'bad', leak: 'ok', condensation: 'bad', waterpressure: 'ok',
      hotwater: 'ok', lock: 'ok', sewersmell: 'ok',
      aircon: 'ok', doorlock: 'ok',
      cctv: 'ok', access: 'bad',
      nightlife: 'na', construction: 'ok',
    },
    checklistMemo: {
      mold: '북측 방 창틀 아래 곰팡이 흔적. 도배로 가린 자국 있음',
      access: '공동현관 자동잠금 고장 상태',
    },
    legal: {
      reg_address: 'ok', reg_owner: 'ok', reg_joint: 'na', reg_trust: 'ok',
      reg_mortgage: 'bad', reg_seizure: 'ok', reg_provisional: 'ok',
      reg_auction: 'ok', reg_leaseright: 'ok',
      ag_regno: 'ok', ag_cert: 'ok',
      ct_address: 'ok', ct_deposit: 'ok', ct_rent: 'ok', ct_special: 'bad',
    },
    legalMemo: {
      reg_mortgage: '채권최고액 6억. 시세 8억 추정 → 보증금 포함 시 70% 초과',
      ct_special: '"잔금일까지 등기 상태 유지" 특약을 집주인이 거부함',
    },
    risks: { r_mortgage: true, r_no_special: true },
  })
  await db.visits.add({
    projectId: id,
    date: new Date().toISOString().slice(0, 10),
    companions: '어머니',
    memo: '오후 3시 방문. 채광 좋으나 북측 방 곰팡이 흔적 발견. 공동현관 자동잠금 고장',
  })
  return id
}
