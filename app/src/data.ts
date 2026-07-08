// ─── 진행단계 ───
export const STAGES = ['후보등록', '방문', '사진등록', '체크리스트', '서류등록', '법률검수', '위험도', 'AI 리포트', '계약', '입주']

// ─── 사진 분류 ───
export const PHOTO_CATEGORIES = ['건물 외관', '공동현관', '복도', '거실', '방', '화장실', '주방', '창문', '베란다', '천장', '바닥', '옵션', '주차장', '기타']

// ─── 첨부문서 종류 ───
export const DOC_TYPES = ['등기부등본', '건축물대장', '계약서', '중개대상물 확인설명서', '공인중개사 등록증', '신분증 확인자료', '영수증', '보증보험 자료', '기타']

export const DOC_TYPE_DESCS: Record<string, { why: string; role: string }> = {
  '등기부등본': {
    why: '계약 전 가장 먼저 확보해야 할 핵심 서류',
    role: '건물 소유자·근저당·압류·신탁 등 법적 상태를 전부 담고 있어. 인터넷등기소(iros.go.kr)에서 700원이면 누구나 뗄 수 있단다. 계약 당일에도 반드시 최신본을 다시 떼서 확인하렴.',
  },
  '건축물대장': {
    why: '불법 건축·용도 위반 여부를 확인하는 서류',
    role: '건물이 합법적으로 지어졌는지, 실제 면적·구조가 등기부와 일치하는지 체크한다. 정부24(gov.kr)에서 무료로 발급받을 수 있어.',
  },
  '계약서': {
    why: '모든 약속이 법적으로 남는 유일한 증거',
    role: '보증금·월세·관리비·계약기간·특약 등 모든 조건을 담는 문서야. 구두 약속은 나중에 증거가 안 되니, 중요한 내용은 전부 특약에 넣어두렴. 원본을 반드시 받아 보관해야 해.',
  },
  '중개대상물 확인설명서': {
    why: '중개사가 집 상태를 공식으로 설명하는 의무 서류',
    role: '건물의 권리관계·관리비·옵션·결함 등을 중개사가 직접 확인하고 서명해 작성해. 분쟁이 생겼을 때 중개사 책임의 핵심 근거가 된단다.',
  },
  '공인중개사 등록증': {
    why: '중개사가 정식 면허를 가진 사람인지 확인하는 증거',
    role: '정식 등록 중개사를 통해야만 중개사고 발생 시 공제보험으로 피해 보상을 받을 수 있어. 사무실 벽에 걸린 등록증·자격증·공제증서를 사진 찍어두렴.',
  },
  '신분증 확인자료': {
    why: '계약 상대방이 실제 소유자인지 대조하는 증거',
    role: '등기부등본 소유자 이름과 계약자의 신분증이 같은 사람인지 직접 확인하는 과정이야. 동의 후 신분증 앞면 사진을 찍어두면 분쟁 시 증거가 된단다.',
  },
  '영수증': {
    why: '돈을 줬다는 법적 증거로 반드시 받아야 해',
    role: '계약금·잔금 등 돈을 낼 때마다 영수증을 받거나 계좌이체 확인증을 캡처해 보관하렴. 현금으로 낸 경우엔 영수증이 유일한 증거가 돼.',
  },
  '보증보험 자료': {
    why: '보증금을 국가가 대신 지켜주는 보험 관련 서류',
    role: '주택도시보증공사(HUG)나 SGI서울보증의 전세보증보험에 가입하면 집주인이 보증금을 안 돌려줘도 보험사가 대신 지급해줘. 가입 조건과 서류를 여기 보관하렴.',
  },
  '기타': {
    why: '계약 관련 그 밖의 참고 자료 보관용',
    role: '위 항목에 해당하지 않는 메모·사진·서류 등을 모아두는 공간이야. 나중에 찾을 수 있도록 파일명을 구체적으로 붙여두렴.',
  },
}

// ─── 체크리스트 (important = 접지 않고 항상 표시) ───
export interface ChecklistItem { id: string; label: string; important: boolean; hint?: string }
export interface ChecklistGroup { name: string; items: ChecklistItem[] }

const c = (id: string, label: string, important = false, hint?: string): ChecklistItem => ({ id, label, important, hint })

export const CHECKLIST_GROUPS: ChecklistGroup[] = [
  {
    name: '실내',
    items: [
      c('mold', '곰팡이', true, '벽 모서리랑 창틀, 옷장 뒤쪽을 꼭 들여다보렴. 최근에 도배한 집이면 곰팡이를 가려놨을 수 있으니 퀴퀴한 냄새가 나는지도 맡아봐야 해'),
      c('leak', '누수', true, '천장이랑 벽에 얼룩이 있으면 누수 흔적이야. 화장실은 아랫집에 물 샌 적 없는지 중개사한테 꼭 물어보자'),
      c('condensation', '결로', true, '창틀 주변에 곰팡이나 물자국이 있는지 보렴. 겨울에 결로 생기는 집은 곰팡이로 바로 이어진단다'),
      c('waterpressure', '수압', true, '샤워기랑 세면대를 동시에 틀어보렴. 부끄러워하지 말고 꼭 틀어봐야 해'),
      c('hotwater', '온수', true, '온수가 나올 때까지 얼마나 걸리는지, 온도는 충분한지 직접 확인해보자'),
      c('lock', '잠금장치', true, '현관 도어락이랑 창문 잠금장치 상태를 봐야 해. 낮은 층이면 방범창이 있는지도 꼭 확인하렴'),
      c('sewersmell', '하수구 냄새', true, '화장실이랑 싱크대 배수구에 코를 대보렴. 냄새 나는 집은 살면서 계속 고생한단다'),
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
      c('aircon', '에어컨', true, '켜서 찬바람 나오는지 직접 확인하고, 연식이랑 청소는 언제 했는지 물어보렴'),
      c('boilerfridge', '냉장고'),
      c('washer', '세탁기'),
      c('induction', '인덕션'),
      c('gasstove', '가스레인지'),
      c('bed', '침대'),
      c('desk', '책상'),
      c('closet', '옷장'),
      c('shoerack', '신발장'),
      c('doorlock', '도어락', true, '입주할 때 비밀번호를 바꿀 수 있는지 꼭 물어보자. 이전 세입자가 알고 있으면 안 되니까'),
      c('interphone', '인터폰'),
    ],
  },
  {
    name: '건물',
    items: [
      c('cctv', 'CCTV', true, '공동현관, 복도, 주차장에 CCTV가 있는지 봐두렴. 안전이랑 직결된단다'),
      c('access', '출입통제', true, '공동현관이 어떻게 잠기는지 확인해보자. 아무나 들어올 수 있는 건물은 곤란해'),
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
      c('nightlife', '유흥시설', true, '밤에 시끄럽고 치안에도 영향이 있으니, 저녁 시간에 한 번 더 와보는 게 좋아'),
      c('construction', '공사장', true, '근처에 공사장이 있으면 언제 끝나는지 물어보렴. 오래 걸리는 공사면 사는 내내 시달린단다'),
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
    intro: '등기부등본은 이 집의 신분증이란다. 인터넷등기소(iros.go.kr)에서 700원이면 누구나 뗄 수 있어. 계약하는 날에도 최신본을 다시 떼서 확인하는 거, 잊지 말자.',
    items: [
      { id: 'reg_address', label: '주소 일치', desc: '등기부에 적힌 주소랑 계약서, 실제 건물 주소가 완전히 같은지 보렴. 동·호수까지 하나하나 맞춰봐야 해' },
      { id: 'reg_owner', label: '소유자 확인', desc: '등기부 갑구에 있는 소유자 이름이랑 계약하러 나온 집주인의 신분증이 같은 사람인지 꼭 대조해보자' },
      { id: 'reg_joint', label: '공동명의', desc: '소유자가 두 명 이상이면 전원의 동의(위임장·인감증명서)가 있어야 해. 한 명하고만 계약하면 나중에 무효가 될 수 있단다' },
      { id: 'reg_trust', label: '신탁 여부', desc: '갑구에 "신탁"이라고 적혀 있으면 집 소유권이 신탁회사에 있다는 뜻이야. 신탁회사 동의 없이 계약하면 보증금을 통째로 잃을 수 있으니 정말 조심하렴' },
      { id: 'reg_mortgage', label: '근저당', desc: '을구의 근저당 채권최고액에 네 보증금을 더한 금액이 집값의 70%를 넘으면 위험해. 집이 경매로 넘어가면 보증금을 못 돌려받을 수 있거든' },
      { id: 'reg_seizure', label: '압류', desc: '갑구에 압류가 있으면 집주인이 세금을 체납했다는 신호야. 이런 집은 계약하지 않는 게 좋겠구나' },
      { id: 'reg_provisional', label: '가압류', desc: '가압류는 집주인이 소송에 걸려 있다는 뜻이야. 재판 결과에 따라 집이 경매로 넘어갈 수도 있단다' },
      { id: 'reg_auction', label: '경매', desc: '경매개시결정 등기가 보이면 뒤도 돌아보지 말고 나오렴. 절대 계약하면 안 되는 집이야' },
      { id: 'reg_leaseright', label: '임차권등기', desc: '이전 세입자가 보증금을 못 받고 나갔다는 표시야. 집주인이 보증금 돌려줄 능력이 없다는 뜻이니 심각하게 봐야 해' },
    ],
  },
  {
    name: '공인중개사',
    intro: '중개사고가 나면 공제(보험)로 보호받을 수 있는데, 그건 정식 등록된 중개사와 거래했을 때 얘기야. 등록번호는 국가공간정보포털에서 조회할 수 있단다.',
    items: [
      { id: 'ag_regno', label: '등록번호 조회', desc: '사무실에 걸려 있는 등록번호를 국가공간정보포털(nsdi.go.kr)이나 구청에 조회해서 진짜 등록된 중개사인지 확인해보렴' },
      { id: 'ag_cert', label: '등록증 게시', desc: '사무실 벽에 중개사무소 등록증, 공인중개사 자격증, 공제증서가 걸려 있는지 둘러보자. 정상적인 사무실이면 다 걸려 있어야 해' },
      { id: 'ag_rep', label: '대표자 일치', desc: '등록증의 대표자와 실제로 계약을 진행하는 사람이 같은지 보렴. 다른 사람이면 소속공인중개사가 맞는지 물어봐야 해' },
      { id: 'ag_office', label: '사무실 실재', desc: '계약은 등록증에 적힌 주소의 사무실에서 해야 한단다. 카페 같은 데서 계약하자고 하면 일단 의심하렴' },
      { id: 'ag_card', label: '명함 확인', desc: '명함에 적힌 상호랑 이름이 등록증과 같은지 확인해두자' },
    ],
  },
  {
    name: '계약서',
    intro: '말로 한 약속은 나중에 아무 소용이 없어. 모든 숫자와 조건은 반드시 계약서에 글자로 남겨야 한단다. 특약사항을 아끼지 말고 적극 활용하렴.',
    items: [
      { id: 'ct_address', label: '주소', desc: '계약서의 주소가 등기부등본과 완전히 같은지 보렴. 지번, 동, 호수까지 전부 다' },
      { id: 'ct_deposit', label: '보증금', desc: '금액은 한글과 숫자로 같이 적고, 입금 계좌가 등기부상 소유자 명의인지 꼭 확인해야 해. 다른 사람 계좌로 보내라고 하면 절대 안 된다' },
      { id: 'ct_rent', label: '월세', desc: '금액이랑 매달 며칠에 내는지, 선불인지 후불인지 확실히 적어두자' },
      { id: 'ct_fee', label: '관리비', desc: '관리비가 얼마인지, 수도·인터넷·청소비 중 뭐가 포함인지 명확히 적으렴. 나중에 딴소리 못 하게' },
      { id: 'ct_period', label: '계약기간', desc: '시작일과 종료일을 적어두렴. 참고로 2년 미만으로 계약해도 세입자는 법으로 2년까지 살 권리가 있단다' },
      { id: 'ct_downpay', label: '계약금', desc: '보통 보증금의 10%야. 반드시 소유자 명의 계좌로 이체하고 영수증을 받아두렴' },
      { id: 'ct_balance', label: '잔금', desc: '잔금 치르는 날 등기부등본을 다시 떼보렴. 그 사이에 새 근저당이 잡혔을 수도 있거든. 확인하고 나서 이체하는 거야' },
      { id: 'ct_movein', label: '입주일', desc: '보통 입주일이 잔금일이야. 입주하면 그날 바로 전입신고하고 확정일자 받으렴. 이게 보증금 지키는 제일 중요한 절차란다' },
      { id: 'ct_special', label: '특약', desc: '"잔금일까지 현재 등기 상태 유지", "보증보험 가입 협조" 같은 특약을 꼭 넣자. 정당한 요구니까 망설일 필요 없어' },
      { id: 'ct_cancel', label: '중도해지', desc: '중간에 이사 가게 되면 위약금이 있는지, 새 세입자 중개보수는 누가 내는지 미리 정해두렴' },
      { id: 'ct_restore', label: '원상복구', desc: '나갈 때 어디까지 원래대로 해놔야 하는지 구체적으로 적어두자. 입주 전에 찍은 사진이 나중에 증거가 된단다' },
      { id: 'ct_repair', label: '수리 책임', desc: '보일러나 누수 같은 큰 설비는 집주인이 고치는 게 원칙이야. 특약으로 명확하게 적어두면 안심이지' },
    ],
  },
]

// ─── 위험요소 (점수제) ───
export interface RiskItem { id: string; label: string; score: number; desc: string }

export const RISK_ITEMS: RiskItem[] = [
  { id: 'r_owner_mismatch', label: '등기부 소유자와 계약자 불일치', score: 80, desc: '명의자가 아닌 사람과 계약하는 건 전세사기의 단골 수법이야. 절대로 하면 안 된다' },
  { id: 'r_prepay', label: '계약금 선입금 요구', score: 60, desc: '집을 보기도 전에, 계약서 쓰기도 전에 돈부터 보내라고 하면 사기라고 봐야 해' },
  { id: 'r_seizure', label: '압류', score: 50, desc: '등기부에 압류가 있는 집이야. 집주인 재정에 문제가 있다는 뜻이란다' },
  { id: 'r_trust', label: '신탁 (동의서 미확인)', score: 50, desc: '신탁 부동산인데 신탁회사 동의를 확인 못 했어. 이대로 계약하면 보증금이 위험해' },
  { id: 'r_provisional', label: '가압류', score: 45, desc: '등기부에 가압류가 있어. 소송 결과에 따라 경매로 갈 수 있는 집이야' },
  { id: 'r_auction', label: '경매 진행', score: 90, desc: '경매가 시작된 집이야. 여기는 계약하면 안 된다. 뒤도 돌아보지 말자' },
  { id: 'r_mortgage', label: '근저당 과다', score: 40, desc: '빚(채권최고액)에 네 보증금을 더하면 시세의 70%가 넘는 집이야. 경매 가면 보증금 회수가 어려워' },
  { id: 'r_leaseright', label: '임차권등기 존재', score: 45, desc: '앞 세입자가 보증금을 못 받고 나간 집이야. 너라고 다를 거라 생각하면 안 돼' },
  { id: 'r_cash_only', label: '현금만 요구', score: 40, desc: '계좌이체를 거부하고 현금만 달라는 건 증거를 안 남기려는 거야. 조심하렴' },
  { id: 'r_rush', label: '계약 재촉', score: 30, desc: '"오늘 아니면 나간다"면서 재촉하면 일단 의심해. 좋은 집은 하루 이틀 생각할 시간을 줘도 안 도망간단다' },
  { id: 'r_too_cheap', label: '시세보다 지나치게 저렴', score: 35, desc: '주변보다 눈에 띄게 싸면 반드시 이유가 있어. 그 이유를 확인하기 전엔 좋아하지 말자' },
  { id: 'r_proxy', label: '대리 계약', score: 40, desc: '위임장, 인감증명서, 소유자 신분증 사본 없이 대리인과 계약하는 건 위험해' },
  { id: 'r_no_landlord', label: '집주인 미확인', score: 40, desc: '집주인 본인 확인(신분증 대조)을 못 했어. 확인 전까지는 돈을 보내면 안 된다' },
  { id: 'r_no_receipt', label: '영수증 미발급', score: 25, desc: '계약금이든 잔금이든 영수증을 안 주려고 하면 이상한 거야' },
  { id: 'r_edit_contract', label: '계약서 수정 요구', score: 30, desc: '계약서를 쓴 다음에 고치자고 하거나 사본을 안 주면 문제가 있는 거란다' },
  { id: 'r_no_special', label: '특약 거부', score: 30, desc: '정당한 특약(등기 상태 유지 등)을 못 넣게 하면 뭔가 숨기는 게 있다는 뜻이야' },
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
