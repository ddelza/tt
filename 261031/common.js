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
  { id: 'group', no: '0-1', type: 'group', title: '모둠 들어가기',
    desc: '선생님이 열면 선착순입니다. 같은 테이블 선생님들과 무슨 색을 고를지 먼저 상의하세요. 한 모둠은 5명까지, 먼저 다 차지한 색이 임자입니다!' },
  { id: 'survey', no: '0-2', type: 'survey', title: '사전 설문 — 우리는 어디쯤?',
    desc: '바이브코딩 경험과 지금 쓰고 있는 AI를 알려 주세요. 결과는 바로 아래와 화면에 함께 띄워 봅니다. (이름은 공개되지 않아요)' },
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
  { id: 'ocr', no: 3, type: 'submit', title: '실습②+ 내 OCR 도구 만들기 (Vision API)',
    desc: '① 예시 앱으로 사진 속 글자 읽기를 체험하고 → ② Google Cloud에서 내 Vision API 키를 발급받아 → ③ 제미나이 캔버스로 나만의 OCR 앱을 만들어 공유 링크를 올려 주세요. 발급 순서와 프롬프트는 안내 사이트 중급 탭에 있습니다. 키는 코드에 넣지 말고 앱 화면의 입력칸에 넣으세요. ※ 학생 이름 등 개인정보가 담긴 사진은 넣지 마세요.',
    links: [
      { href: 'https://ddelza.github.io/OCR/', label: '📷 예시 OCR 앱 체험' },
      { href: 'https://ddelza.github.io/tt/padlet.html#vision-ocr', label: '🔑 키 발급 순서 · 프롬프트' },
    ],
    fields: [
      { k: 'title', label: '앱 제목', ph: '예: 학습지 글자 뽑기', req: true },
      { k: 'link', label: '공유 링크', type: 'url', ph: 'Gemini Canvas 공유 링크 (https://...)' },
      { k: 'prompt', label: '사용한 프롬프트', type: 'area' },
      { k: 'memo', label: '키 발급·실행하며 막혔던 점', type: 'area', ph: '예: 체크카드 인증이 안 돼서 신용카드로 바꿈' },
      { k: 'idea', label: '수업·업무에 써 보고 싶은 곳', type: 'area', ph: '예: 학생 서술형 답안 모아서 정리하기' },
    ] },
  { id: 'quiz', no: 4, type: 'submit', title: '실습③ 데이터가 쌓이는 앱',
    desc: '구글 설문(퀴즈) 결과를 정리해 보여 주는 웹앱을 만들어 보세요. 지금 이 페이지도 같은 원리(입력 → 저장 → 모아 보기)로 만들어졌습니다.',
    fields: [
      { k: 'title', label: '앱 제목', ph: '예: 퀴즈 결과 반별 정리', req: true },
      { k: 'link', label: '공유 링크', type: 'url', ph: 'https://...' },
      { k: 'prompt', label: '사용한 프롬프트', type: 'area' },
      { k: 'memo', label: '수업에서 이렇게 쓰고 싶어요', type: 'area' },
    ] },
  { id: 'pick', no: 5, type: 'vote', title: '모둠 대표작 뽑기',
    desc: '우리 모둠 선생님들이 올린 작품 중 다른 모둠에 소개하고 싶은 것 하나에 투표하세요. 내 작품에는 투표할 수 없어요.' },
  { id: 'plan', no: 6, type: 'submit', title: '내 수업에 적용하기',
    desc: '오늘 배운 것을 내 수업에 어떻게 쓸지 적어 보세요. 연수 뒤 제출하는 "비정형 연수 실행 보고서"의 초안이 됩니다.',
    fields: [
      { k: 'title', label: '만들고 싶은 도구 (한 줄)', ph: '예: 화학 반응 속도 시뮬레이션', req: true },
      { k: 'unit', label: '적용할 학년 · 단원', ph: '예: 중3 화학 반응의 규칙과 에너지 변화' },
      { k: 'how', label: '수업에서 쓰는 장면', type: 'area', ph: '언제, 학생들이 무엇을 하게 되나요?' },
      { k: 'worry', label: '걱정되는 점 · 필요한 도움', type: 'area' },
    ] },
];
// 0-2 사전 설문 문항
const SURVEY = [
  { k: 'lecture', label: '바이브코딩 관련 연수를 들어 본 적이 있나요?', type: 'one',
    opts: ['오늘이 처음이에요', '1번 들어 봤어요', '2번 이상 들어 봤어요'] },
  { k: 'exp', label: '바이브코딩(AI에게 말로 시켜 앱 만들기)을 직접 해 본 적이 있나요?', type: 'one',
    opts: ['해 본 적 없어요', '한두 번 따라 해 봤어요', '수업·업무용으로 만들어 써 봤어요', '자주 만들어 써요'] },
  { k: 'paid', label: '지금 유료로 구독 중인 AI가 있나요? (여러 개 선택 가능)', type: 'multi',
    opts: ['없음', 'ChatGPT (Plus·Pro)', 'Gemini (Google AI Pro 등)', 'Claude (Pro·Max)', 'Perplexity', '뤼튼 등 국내 AI', '그 밖의 AI'] },
  { k: 'hope', label: '오늘 연수에서 가장 기대하는 것 (선택)', type: 'text', ph: '예: 수업에 바로 쓸 시뮬레이션 하나 만들기' },
];
function surveyResultsHTML(state) {
  const rows = Object.values((state && state.survey) || {});
  const n = rows.length;
  if (!n) return '<div class="empty-note">아직 응답이 없어요.</div>';
  let h = `<div class="sv-n">응답 <b>${n}</b>명</div>`;
  for (const q of SURVEY) {
    if (q.type === 'text') {
      const t = rows.map(r => r[q.k]).filter(Boolean);
      if (t.length) h += `<div class="sv-q"><h4>${esc(q.label.replace(' (선택)', ''))}</h4><div class="sv-words">${t.map(x => `<span>${esc(x)}</span>`).join('')}</div></div>`;
      continue;
    }
    const has = (r, o) => q.type === 'multi' ? Object.values(r[q.k] || {}).includes(o) : r[q.k] === o;
    const cnt = q.opts.map(o => rows.filter(r => has(r, o)).length);
    const max = Math.max(1, ...cnt);
    h += `<div class="sv-q"><h4>${esc(q.label.replace(' (여러 개 선택 가능)', ''))}</h4>` + q.opts.map((o, i) =>
      `<div class="sv-row"><span class="sv-l">${esc(o)}</span><span class="sv-bar"><i style="width:${cnt[i] / max * 100}%;--h:${200 + i * 28}"></i></span><b>${cnt[i]}명</b><small>${Math.round(cnt[i] / n * 100)}%</small></div>`).join('') + '</div>';
  }
  return h;
}
function isDone(state, act, uid) {
  if (act.type === 'group') return !!groupIdOf(state, uid);
  if (act.type === 'vote') return !!(state.votes && state.votes[uid]);
  if (act.type === 'survey') return !!(state.survey && state.survey[uid]);
  return !!(state.subs && state.subs[act.id] && state.subs[act.id][uid]);
}
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
