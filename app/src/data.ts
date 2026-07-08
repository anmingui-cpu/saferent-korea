// ─── 진행단계 ───
export const STAGES = ['후보등록', '방문', '사진등록', '체크리스트', '서류등록', '위험도', 'AI 리포트', '계약', '입주']

// ─── 사진 분류 ───
export const PHOTO_CATEGORIES = ['건물 외관', '공동현관', '복도', '거실', '방', '화장실', '주방', '창문', '베란다', '천장', '바닥', '옵션', '주차장', '기타']

// ─── 첨부문서 종류 ───
export const DOC_TYPES = ['등기부등본', '건축물대장', '계약서', '중개대상물 확인설명서', '공인중개사 등록증', '신분증 확인자료', '영수증', '보증보험 자료', '기타']

// ─── 체크리스트 (important = 접지 않고 항상 표시) ───
export interface ChecklistItem { id: string; label: string; important: boolean; hint?: string }
export interface ChecklistGroup { name: string; items: ChecklistItem[] }

const c = (id: string, label: string, important = false, hint?: string): ChecklistItem => ({ id, label, important, hint })

export const CHECKLIST_GROUPS: ChecklistGroup[] = [
  {
    name: '실내',
    items: [
      c('mold', '곰팡이', true, '벽 모서리·창틀·옷장 뒤를 확인. 최근 도배로 가려진 곳이 없는지 냄새로도 확인'),
      c('leak', '누수', true, '천장·벽 얼룩, 화장실 아랫집 누수 이력 문의'),
      c('condensation', '결로', true, '창틀 주변 곰팡이·물자국 확인. 겨울철 결로는 곰팡이로 직결'),
      c('waterpressure', '수압', true, '샤워기·세면대 동시에 틀어보기'),
      c('hotwater', '온수', true, '온수가 나오기까지 시간과 온도 확인'),
      c('lock', '잠금장치', true, '현관 도어락·창문 잠금 상태. 방범창 여부'),
      c('sewersmell', '하수구 냄새', true, '화장실·싱크대 배수구 냄새 확인'),
      c('smell', '악취'),
      c('ventilation', '환기'),
      c('sunlight', '채광'),
      c('noise', '소음'),
      c('window', '창문'),
      c('screen', '방충망'),
      c('electric', '전기'),
      c('outlet', '콘센트'),
      c('internet', '인터넷'),
      c('cellsignal', '휴대폰 수신'),
      c('wallpaper', '도배'),
      c('flooring', '장판'),
      c('ceiling', '천장'),
    ],
  },
  {
    name: '옵션',
    items: [
      c('aircon', '에어컨', true, '작동 여부와 연식. 청소 이력 문의'),
      c('boilerfridge', '냉장고'),
      c('washer', '세탁기'),
      c('induction', '인덕션'),
      c('gasstove', '가스레인지'),
      c('bed', '침대'),
      c('desk', '책상'),
      c('closet', '옷장'),
      c('shoerack', '신발장'),
      c('doorlock', '도어락', true, '비밀번호 변경 가능 여부'),
      c('interphone', '인터폰'),
    ],
  },
  {
    name: '건물',
    items: [
      c('cctv', 'CCTV', true, '공동현관·복도·주차장 CCTV 유무'),
      c('access', '출입통제', true, '공동현관 잠금 방식'),
      c('elevator', '엘리베이터'),
      c('emergencystair', '비상계단'),
      c('extinguisher', '소화기'),
      c('firedetector', '화재감지기'),
      c('parcel', '택배'),
      c('recycle', '분리수거장'),
      c('parkinglot', '주차장'),
    ],
  },
  {
    name: '주변환경',
    items: [
      c('convenience', '편의점'),
      c('mart', '마트'),
      c('bus', '버스'),
      c('subway', '지하철'),
      c('hospital', '병원'),
      c('pharmacy', '약국'),
      c('police', '경찰서'),
      c('safewalk', '여성안심귀가'),
      c('nightlife', '유흥시설', true, '밤 시간대 소음·치안에 직접 영향'),
      c('construction', '공사장', true, '장기 공사면 계약기간 내내 소음'),
      c('odorfacility', '악취시설'),
    ],
  },
]

// ─── 법률 검수 (각 항목에 검수 방법 설명 포함) ───
export interface LegalItem { id: string; label: string; desc: string }
export interface LegalGroup { name: string; intro: string; items: LegalItem[] }

export const LEGAL_GROUPS: LegalGroup[] = [
  {
    name: '등기부등본',
    intro: '등기부등본은 이 건물의 "신분증"입니다. 인터넷등기소(iros.go.kr)에서 누구나 700원에 열람할 수 있습니다. 계약 당일에도 최신본을 다시 떼어 확인하세요.',
    items: [
      { id: 'reg_address', label: '주소 일치', desc: '등기부등본의 소재지와 계약서·실제 건물 주소가 완전히 일치하는지 확인. 동·호수까지 대조' },
      { id: 'reg_owner', label: '소유자 확인', desc: '등기부 갑구의 소유자 이름과 계약하러 나온 사람(집주인)의 신분증이 일치하는지 확인' },
      { id: 'reg_joint', label: '공동명의', desc: '소유자가 2인 이상이면 전원의 동의(위임장·인감증명서)가 필요. 한 명하고만 계약하면 무효 위험' },
      { id: 'reg_trust', label: '신탁 여부', desc: '갑구에 "신탁"이 있으면 소유권이 신탁회사에 있음. 신탁회사 동의 없는 계약은 보증금을 잃을 수 있음' },
      { id: 'reg_mortgage', label: '근저당', desc: '을구의 근저당 채권최고액 + 내 보증금이 집값의 70%를 넘으면 위험. 경매 시 보증금을 못 돌려받을 수 있음' },
      { id: 'reg_seizure', label: '압류', desc: '갑구에 압류가 있으면 소유자가 세금 체납 등 문제가 있다는 신호. 계약 비추천' },
      { id: 'reg_provisional', label: '가압류', desc: '가압류는 소송 중이라는 뜻. 결과에 따라 경매로 넘어갈 수 있음' },
      { id: 'reg_auction', label: '경매', desc: '경매개시결정 등기가 있으면 절대 계약 금지' },
      { id: 'reg_leaseright', label: '임차권등기', desc: '이전 세입자가 보증금을 못 받고 나갔다는 표시. 집주인의 보증금 반환 능력에 심각한 의심 신호' },
    ],
  },
  {
    name: '공인중개사',
    intro: '중개사고 발생 시 공제(보험)로 보호받으려면 정식 등록된 중개사와 거래해야 합니다. 국가공간정보포털에서 등록번호를 조회할 수 있습니다.',
    items: [
      { id: 'ag_regno', label: '등록번호 조회', desc: '사무실에 게시된 등록번호를 국가공간정보포털(nsdi.go.kr) 또는 시·군·구청에서 조회해 정상 등록 여부 확인' },
      { id: 'ag_cert', label: '등록증 게시', desc: '사무실 벽에 중개사무소 등록증·공인중개사 자격증·공제증서가 게시돼 있는지 확인' },
      { id: 'ag_rep', label: '대표자 일치', desc: '등록증의 대표자와 실제 계약을 진행하는 사람이 같은지 확인. 소속공인중개사라면 소속 여부 확인' },
      { id: 'ag_office', label: '사무실 실재', desc: '등록증 주소의 실제 사무실에서 계약하는지 확인. 카페 등 외부 계약 요구는 의심' },
      { id: 'ag_card', label: '명함 확인', desc: '명함의 상호·이름이 등록증과 일치하는지 확인' },
    ],
  },
  {
    name: '계약서',
    intro: '계약서의 모든 숫자와 조건은 구두 약속이 아니라 문서로 남겨야 효력이 있습니다. 특약사항을 적극 활용하세요.',
    items: [
      { id: 'ct_address', label: '주소', desc: '계약서 주소가 등기부등본과 완전히 일치하는지 확인 (지번·동·호수)' },
      { id: 'ct_deposit', label: '보증금', desc: '금액을 한글과 숫자로 병기. 입금 계좌가 등기부상 소유자 명의인지 확인' },
      { id: 'ct_rent', label: '월세', desc: '금액·납부일·선불/후불 여부 명시' },
      { id: 'ct_fee', label: '관리비', desc: '관리비 금액과 포함 항목(수도·인터넷·청소비 등)을 명시' },
      { id: 'ct_period', label: '계약기간', desc: '시작일과 종료일 명시. 주택임대차보호법상 2년 미만 계약도 세입자는 2년 주장 가능' },
      { id: 'ct_downpay', label: '계약금', desc: '통상 보증금의 10%. 반드시 소유자 명의 계좌로 이체하고 영수증 수령' },
      { id: 'ct_balance', label: '잔금', desc: '잔금일에 등기부등본을 다시 떼어 새 근저당이 없는지 확인 후 이체' },
      { id: 'ct_movein', label: '입주일', desc: '입주일 = 잔금일이 일반적. 입주 즉시 전입신고 + 확정일자 받기' },
      { id: 'ct_special', label: '특약', desc: '"잔금일까지 현재 등기 상태 유지", "보증보험 가입 협조", "수리 책임" 등 필요한 특약 기재' },
      { id: 'ct_cancel', label: '중도해지', desc: '중도 퇴거 시 위약금·새 세입자 중개보수 부담 조건 확인' },
      { id: 'ct_restore', label: '원상복구', desc: '원상복구 범위를 구체적으로. 입주 전 사진이 증거가 됨' },
      { id: 'ct_repair', label: '수리 책임', desc: '보일러·누수 등 주요 설비는 임대인 수리 원칙. 특약으로 명확히' },
    ],
  },
]

// ─── 위험요소 (점수제) ───
export interface RiskItem { id: string; label: string; score: number; desc: string }

export const RISK_ITEMS: RiskItem[] = [
  { id: 'r_owner_mismatch', label: '등기부 소유자와 계약자 불일치', score: 80, desc: '명의자가 아닌 사람과의 계약은 전세사기의 대표 수법' },
  { id: 'r_prepay', label: '계약금 선입금 요구', score: 60, desc: '집을 보기도 전에, 또는 계약서 작성 전에 입금을 요구하면 사기 의심' },
  { id: 'r_seizure', label: '압류', score: 50, desc: '등기부에 압류 등기 존재' },
  { id: 'r_trust', label: '신탁 (동의서 미확인)', score: 50, desc: '신탁 부동산인데 신탁회사 동의를 확인하지 못함' },
  { id: 'r_provisional', label: '가압류', score: 45, desc: '등기부에 가압류 등기 존재' },
  { id: 'r_auction', label: '경매 진행', score: 90, desc: '경매개시결정 등기 존재 — 계약 금지 수준' },
  { id: 'r_mortgage', label: '근저당 과다', score: 40, desc: '채권최고액 + 보증금이 시세의 70% 초과' },
  { id: 'r_leaseright', label: '임차권등기 존재', score: 45, desc: '이전 세입자가 보증금을 돌려받지 못한 이력' },
  { id: 'r_cash_only', label: '현금만 요구', score: 40, desc: '계좌이체를 거부하고 현금을 요구 — 증거를 남기지 않으려는 신호' },
  { id: 'r_rush', label: '계약 재촉', score: 30, desc: '"오늘 아니면 나간다"며 검토 시간을 주지 않음' },
  { id: 'r_too_cheap', label: '시세보다 지나치게 저렴', score: 35, desc: '주변 시세 대비 크게 저렴하면 이유를 반드시 확인' },
  { id: 'r_proxy', label: '대리 계약', score: 40, desc: '위임장·인감증명서·소유자 신분증 사본 없이 대리인과 계약' },
  { id: 'r_no_landlord', label: '집주인 미확인', score: 40, desc: '소유자 본인 확인(신분증 대조)을 하지 못함' },
  { id: 'r_no_receipt', label: '영수증 미발급', score: 25, desc: '계약금·잔금 영수증 발급을 거부' },
  { id: 'r_edit_contract', label: '계약서 수정 요구', score: 30, desc: '작성 후 임의 수정을 요구하거나 사본을 주지 않음' },
  { id: 'r_no_special', label: '특약 거부', score: 30, desc: '정당한 특약(등기 상태 유지 등) 기재를 거부' },
]

export type RiskLevel = '안전' | '주의' | '위험' | '매우 위험'

export function riskScore(risks: Record<string, boolean>): number {
  return RISK_ITEMS.reduce((sum, r) => sum + (risks[r.id] ? r.score : 0), 0)
}

export function riskLevel(score: number): RiskLevel {
  if (score === 0) return '안전'
  if (score < 50) return '주의'
  if (score < 100) return '위험'
  return '매우 위험'
}

export const RISK_COLORS: Record<RiskLevel, string> = {
  '안전': '#16a34a',
  '주의': '#d97706',
  '위험': '#dc2626',
  '매우 위험': '#7f1d1d',
}
