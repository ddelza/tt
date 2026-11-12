// 2026-10-31 에듀테크 과학수업 연수 — 선생님 공동 실습 페이지 공용 설정
// 2026-11-13 광남고 STEAM 클럽 바이브코딩 특강 — 학생 실습 페이지 공용 설정 (tt/261031을 개인 탐구용으로 고친 것)
const WS = { key: 'ws261113', title: '바이브코딩 실습실', date: '2026. 11. 13.', mineLabel: '우리 학년' };

firebase.initializeApp({ databaseURL: 'https://gwangsu-on-default-rtdb.firebaseio.com' });
const db = firebase.database();
const ROOT = db.ref('years/' + WS.key);

// 모둠 대신 학년으로 나눈다 (로그인할 때 고름, 선착순 없음)
const GROUP_SIZE = 99;
const GROUPS = [
  { id: 'g1', name: '고1', c: '#0b63c1', bg: '#e5effb' },
  { id: 'g2', name: '고2', c: '#23895a', bg: '#e5f5ec' },
];

// 활동 순서 = 강의 흐름 (기획 → 사이트 배포 → 탐구 앱 → 버그 헌터 → 검증 → 소감)
const ACTS = [
  { id: 'survey', no: 0, type: 'survey', title: '사전 설문 — 나는 어디쯤?',
    desc: '지금까지의 경험을 알려 주세요. 결과는 바로 아래와 화면에 함께 띄워 봅니다. (이름은 공개되지 않아요)' },
  { id: 'plan', no: 1, type: 'submit', title: '내 탐구 네 줄 정리',
    desc: '오늘 만들 사이트의 재료입니다. 아직 탐구가 없다면 궁금한 과학 질문 하나로 시작해도 돼요. 여기 쓴 내용을 그대로 복사해 Gemini에 붙여넣게 됩니다.',
    fields: [
      { k: 'title', label: '탐구 제목', ph: '예: 온도에 따른 효소 반응 속도', req: true },
      { k: 'field', label: '분야', ph: '예: 생명과학' },
      { k: 'question', label: '① 탐구 질문', type: 'area', ph: '무엇이 궁금했나요?' },
      { k: 'method', label: '② 방법', type: 'area', ph: '어떤 변인을 어떻게 측정했나요? (계획 단계면 계획)' },
      { k: 'result', label: '③ 결과 또는 예상', type: 'area', ph: '숫자 표, 관찰 기록 등 (개인정보 금지)' },
      { k: 'audience', label: '④ 보는 사람', ph: '예: 탐구 발표회 관람객, 후배' },
    ] },
  { id: 'site', no: 2, type: 'submit', title: '내 탐구 사이트 공개 (GitHub Pages)',
    desc: 'Gemini Canvas로 탐구 홈페이지를 만들고, index.html로 저장해 GitHub에 올린 뒤 Pages를 켜세요. 휴대폰에서 열리는 주소를 올리면 완료입니다.',
    links: [{ href: 'https://github.com/new', label: '🗂 새 저장소 만들기' }],
    fields: [
      { k: 'title', label: '사이트 제목', ph: '예: 효소는 몇 도를 좋아할까?', req: true },
      { k: 'link', label: '내 사이트 주소', type: 'url', ph: 'https://아이디.github.io/저장소이름/', req: true },
      { k: 'prompt', label: '사용한 프롬프트', type: 'area' },
      { k: 'memo', label: '배포하며 막혔던 점 · 해결 방법', type: 'area', ph: '예: 파일 이름이 index.html.html로 저장돼 있었음' },
    ] },
  { id: 'app', no: 3, type: 'submit', title: '탐구 앱 만들고 붙이기',
    desc: '시뮬레이션은 이미 해 봤으니 이번엔 진짜 데이터를 다뤄 봅니다. 내 측정값을 분석하는 앱, 공개 API로 실제 데이터를 가져오는 앱, 판정 계산기, 탐구 퀴즈 중 하나를 골라 app.html로 올리고 홈페이지 버튼과 연결하세요.',
    links: [{ href: 'https://ddelza.github.io/tt/padlet.html#vision-ocr', label: '🔌 API 예시 프롬프트 (중급 탭)' }],
    fields: [
      { k: 'title', label: '앱 제목', ph: '예: 온도별 반응 속도 분석기', req: true },
      { k: 'kind', label: '앱 유형', ph: '데이터 분석기 / API 앱 / 계산기 / 퀴즈' },
      { k: 'link', label: '앱 주소', type: 'url', ph: 'https://아이디.github.io/저장소이름/app.html', req: true },
      { k: 'prompt', label: '사용한 프롬프트', type: 'area' },
      { k: 'memo', label: '대화로 고친 점', type: 'area' },
    ] },
  { id: 'bug', no: 4, type: 'submit', noVote: true, title: '버그 헌터 — AI가 만든 앱의 과학 오류 찾기',
    desc: 'AI가 만든 자유낙하 시뮬레이터에 과학적 오류가 숨어 있습니다. 화면은 그럴듯하지만 틀린 곳이 여러 군데예요. 손계산과 물리 지식으로 찾아내세요!',
    links: [{ href: 'bug.html', label: '🐞 문제의 시뮬레이터 열기' }],
    fields: [
      { k: 'title', label: '찾은 오류 개수', ph: '예: 3개', req: true },
      { k: 'e1', label: '오류 1 — 무엇이, 왜 틀렸나', type: 'area' },
      { k: 'e2', label: '오류 2', type: 'area' },
      { k: 'e3', label: '오류 3', type: 'area' },
      { k: 'how', label: '어떻게 확인했나 (손계산 등)', type: 'area' },
    ] },
  { id: 'verify', no: 5, type: 'submit', noVote: true, title: '내 앱 검증 기록',
    desc: '이번엔 내 앱 차례입니다. 값 세 개를 넣고 직접 계산한 결과와 비교하세요. 극단값(0, 음수, 아주 큰 값)과 단위도 확인합니다.',
    fields: [
      { k: 'title', label: '검증 결과 한 줄', ph: '예: 3개 중 2개 일치, 단위 오류 1개 수정', req: true },
      { k: 'calc', label: '손계산 비교 (입력값 → 앱 결과 / 내 계산)', type: 'area', ph: '예: 30℃ → 앱 0.42 / 계산 0.42 ✓' },
      { k: 'fix', label: '찾은 문제와 고친 방법', type: 'area' },
    ] },
  { id: 'reflect', no: 6, type: 'submit', noVote: true, title: '오늘을 마치며',
    desc: '오늘 만든 주소는 여러분의 것입니다. 끝나면 구글과 GitHub에서 꼭 로그아웃하세요.',
    fields: [
      { k: 'title', label: '한 줄 소감', req: true },
      { k: 'next', label: '이 사이트에 다음에 더하고 싶은 것', type: 'area' },
    ] },
];
// 0-2 사전 설문 문항
const SURVEY = [
  { k: 'made', label: '바이브코딩으로 만들어 본 것은? (여러 개 선택 가능)', type: 'multi',
    opts: ['과학 시뮬레이션', '게임', '퀴즈·문제', '웹페이지·홈페이지', '아직 없음'] },
  { k: 'ai', label: '평소에 써 본 AI는? (여러 개 선택 가능)', type: 'multi',
    opts: ['Gemini', 'ChatGPT', '뤼튼 등 국내 AI', '그 밖의 AI', '거의 안 써 봄'] },
  { k: 'github', label: 'GitHub 계정이 있나요?', type: 'one',
    opts: ['원래 있었어요', '오늘을 위해 만들었어요', '아직 없어요'] },
  { k: 'hope', label: '오늘 가장 해 보고 싶은 것 (선택)', type: 'text', ph: '예: 내 탐구를 인터넷에 올리기' },
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
