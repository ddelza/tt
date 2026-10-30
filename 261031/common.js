// 2026-10-31 에듀테크 과학수업 연수 — 선생님 공동 실습 페이지 공용 설정
const WS = { key: 'ws261031', title: '바이브코딩 실습실', date: '2026. 10. 31.' };

firebase.initializeApp({ databaseURL: 'https://gwangsu-on-default-rtdb.firebaseio.com' });
const db = firebase.database();
const ROOT = db.ref('years/' + WS.key);

const GROUP_SIZE = 5;
const GROUPS = [
  { id: 'red',    name: '빨강', c: '#d93d42', bg: '#fdecec' },
  { id: 'orange', name: '주황', c: '#e2620f', bg: '#fff0e4' },
  { id: 'yellow', name: '노랑', c: '#b98900', bg: '#fff7d6' },
  { id: 'green',  name: '초록', c: '#23895a', bg: '#e5f5ec' },
  { id: 'blue',   name: '파랑', c: '#0b63c1', bg: '#e5effb' },
];

// 활동 순서 = 강의 흐름 (도입 → 실습①②③ → 대표작 → 수업 적용)
const ACTS = [
  { id: 'group', no: 0, type: 'group', title: '모둠 들어가기',
    desc: '선생님이 열면 선착순입니다. 같은 테이블 선생님들과 무슨 색을 고를지 먼저 상의하세요. 한 모둠은 5명까지, 먼저 다 차지한 색이 임자입니다!' },
  { id: 'sim', no: 1, type: 'submit', title: '실습① 내 수업용 시뮬레이션',
    desc: '4요소(무엇을·누구를·어떻게 조작·무엇을 보여줄지)를 넣어 만들고, 두 번 이상 대화로 고친 뒤 공유 링크를 올려 주세요.',
    fields: [
      { k: 'title', label: '앱 제목', ph: '예: 옴의 법칙 시뮬레이터', req: true },
      { k: 'unit', label: '학년 · 단원', ph: '예: 중2 전기와 자기' },
      { k: 'link', label: '공유 링크', type: 'url', ph: 'Gemini Canvas 공유 링크 (https://...)' },
      { k: 'prompt', label: '처음 쓴 프롬프트', type: 'area', ph: '복사해서 붙여넣기' },
      { k: 'memo', label: '대화로 고친 점 · 한 줄 소감', type: 'area', ph: '예: 그래프 축에 단위를 붙여 달라고 했더니...' },
    ] },
  { id: 'api', no: 2, type: 'submit', title: '실습② API로 진짜 데이터 가져오기',
    desc: '[API 이름] · [보여줄 내용] · [화면 모양] 빈칸 3개를 채워 만들어 보세요. 실제로 작동하는 Open-Meteo, PubChem부터 추천합니다.',
    fields: [
      { k: 'title', label: '앱 제목', ph: '예: 우리 학교 오늘 날씨', req: true },
      { k: 'apiName', label: '사용한 API', ph: '예: Open-Meteo' },
      { k: 'link', label: '공유 링크', type: 'url', ph: 'https://...' },
      { k: 'prompt', label: '사용한 프롬프트', type: 'area' },
      { k: 'memo', label: '막혔던 점 · 해결한 방법', type: 'area' },
    ] },
  { id: 'quiz', no: 3, type: 'submit', title: '실습③ 데이터가 쌓이는 앱',
    desc: '구글 설문(퀴즈) 결과를 정리해 보여 주는 웹앱을 만들어 보세요. 지금 이 페이지도 같은 원리(입력 → 저장 → 모아 보기)로 만들어졌습니다.',
    fields: [
      { k: 'title', label: '앱 제목', ph: '예: 퀴즈 결과 반별 정리', req: true },
      { k: 'link', label: '공유 링크', type: 'url', ph: 'https://...' },
      { k: 'prompt', label: '사용한 프롬프트', type: 'area' },
      { k: 'memo', label: '수업에서 이렇게 쓰고 싶어요', type: 'area' },
    ] },
  { id: 'pick', no: 4, type: 'vote', title: '모둠 대표작 뽑기',
    desc: '우리 모둠 선생님들이 올린 작품 중 다른 모둠에 소개하고 싶은 것 하나에 투표하세요. 내 작품에는 투표할 수 없어요.' },
  { id: 'plan', no: 5, type: 'submit', title: '내 수업에 적용하기',
    desc: '오늘 배운 것을 내 수업에 어떻게 쓸지 적어 보세요. 연수 뒤 제출하는 "비정형 연수 실행 보고서"의 초안이 됩니다.',
    fields: [
      { k: 'title', label: '만들고 싶은 도구 (한 줄)', ph: '예: 화학 반응 속도 시뮬레이션', req: true },
      { k: 'unit', label: '적용할 학년 · 단원', ph: '예: 중3 화학 반응의 규칙과 에너지 변화' },
      { k: 'how', label: '수업에서 쓰는 장면', type: 'area', ph: '언제, 학생들이 무엇을 하게 되나요?' },
      { k: 'worry', label: '걱정되는 점 · 필요한 도움', type: 'area' },
    ] },
];
const actById = id => ACTS.find(a => a.id === id);
const groupById = id => GROUPS.find(g => g.id === id);

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
function safeUrl(u) {
  try { const x = new URL(String(u).trim()); return /^https?:$/.test(x.protocol) ? x.href : ''; }
  catch (e) { return ''; }
}
function groupIdOf(state, uid) {
  const gs = (state && state.groups) || {};
  for (const g of GROUPS) if (gs[g.id] && gs[g.id][uid]) return g.id;
  return null;
}
function membersOf(state, gid) {
  const m = (state && state.groups && state.groups[gid]) || {};
  return Object.entries(m).map(([uid, v]) => ({ uid, ...v })).sort((a, b) => a.t - b.t);
}
function fmtTime(t) {
  if (!t) return '';
  const d = new Date(t);
  return d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0');
}
function groupBadge(gid) {
  const g = groupById(gid);
  return g ? `<span class="gbadge" style="--gc:${g.c};--gbg:${g.bg}">${g.name}</span>` : '<span class="gbadge none">모둠 없음</span>';
}
