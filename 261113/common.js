// 2026-10-31 에듀테크 과학수업 연수 — 선생님 공동 실습 페이지 공용 설정
// 2026-11-13 광남고 STEAM 클럽 바이브코딩 특강 — 학생 실습 페이지 공용 설정 (tt/261031을 개인 탐구용으로 고친 것)
// 2026-11-13 광남고 STEAM 클럽 바이브코딩 특강 — 학생 실습 페이지 공용 설정 (tt/261031 구조를 그대로 씀)
const WS = { key: 'ws261113', title: '바이브코딩 실습실', date: '2026. 11. 13.' };

firebase.initializeApp({ databaseURL: 'https://gwangsu-on-default-rtdb.firebaseio.com' });
const db = firebase.database();
const ROOT = db.ref('years/' + WS.key);

const GROUP_SIZE = 3;
const GROUPS = [
  { id: 'red',    name: '빨강', c: '#d93d42', bg: '#fdecec' },
  { id: 'orange', name: '주황', c: '#e2620f', bg: '#fff0e4' },
  { id: 'yellow', name: '노랑', c: '#b98900', bg: '#fff7d6' },
  { id: 'green',  name: '초록', c: '#23895a', bg: '#e5f5ec' },
  { id: 'blue',   name: '파랑', c: '#0b63c1', bg: '#e5effb' },
];

const GUIDE = 'https://ddelza.github.io/tt/padlet.html';
// 활동 순서 = 강의 흐름 (모둠·설문 → API 앱 → Apps Script 설문 → GitHub 배포 → 탐구 기록 페이지 → 소감)
const ACTS = [
  { id: 'group', no: '0-1', type: 'group', title: '모둠 들어가기',
    desc: '선생님이 열면 선착순입니다. 같이 앉은 친구들과 무슨 색을 고를지 먼저 상의하세요. 한 모둠은 3명까지, 먼저 다 차지한 색이 임자입니다!' },
  { id: 'survey', no: '0-2', type: 'survey', title: '사전 설문 — 나는 어디쯤?',
    desc: '지금까지의 경험을 알려 주세요. 결과는 바로 아래와 화면에 함께 띄워 봅니다. (이름은 공개되지 않아요)' },
  { id: 'sim', no: '0.5', type: 'submit', title: '과학 시뮬레이션 · 자유 앱 만들기',
    desc: '몸풀기입니다! 만들고 싶은 과학 시뮬레이션이나 자유 주제 앱을 Gemini Canvas로 만들어 보세요. [무엇을] [누가 쓸지] [어떻게 조작] [무엇을 보여줄지]를 넣어 요청하고, 두 번 이상 대화로 고친 뒤 공유 링크를 올려 주세요.',
    prompts: [
      { label: '예시 프롬프트 ([ ] 부분을 바꾸세요)', text: '[주제: 예) 포물선 운동] 시뮬레이션을 만들어줘.\n사용자: [예) 고등학생]\n조작: [예) 발사 각도와 처음 속력을 슬라이더로 바꾸기]\n보여줄 것: [예) 날아가는 궤적 애니메이션, 최고 높이와 수평 도달 거리]\n과학적으로 정확한 식을 쓰고, 화면에 식도 함께 보여줘. 한국어로, html 파일 하나로 만들어줘.' },
    ],
    fields: [
      { k: 'title', label: '앱 제목', ph: '예: 포물선 운동 시뮬레이터', req: true },
      { k: 'link', label: '공유 링크', type: 'url', ph: 'Gemini Canvas 공유 링크 (https://...)' },
      { k: 'prompt', label: '처음 쓴 프롬프트', type: 'area', ph: '복사해서 붙여넣기' },
      { k: 'memo', label: '대화로 고친 점 · 과학적으로 맞는지 확인한 방법', type: 'area', ph: '예: 각도 45°일 때 거리가 최대인지 확인함' },
    ] },
  { id: 'api', no: 1, type: 'submit', title: 'API로 진짜 데이터 가져오는 앱',
    desc: '시뮬레이션은 해 봤으니, 이번엔 기관이 실시간으로 내놓는 진짜 데이터를 가져옵니다. 아래 예시로 시작해 내 관심 주제로 바꿔 보세요. Gemini Canvas에서 만들고 공유 링크를 올립니다.',
    links: [{ href: GUIDE + '#panel-inter', label: '🔌 API 예시 더 보기 (중급 탭)' }],
    prompts: [
      { label: '날씨 (Open-Meteo, 인증키 필요 없음)', text: 'Open-Meteo API(https://api.open-meteo.com/v1/forecast)를 fetch로 불러와서, 위도·경도를 입력하면 그 지역의 현재 기온과 앞으로 24시간 기온 그래프를 보여주는 html을 만들어줘. 예시로 경기도 광주시(위도 37.4, 경도 127.26)를 넣어줘. 인증키는 필요 없어. 한국어로, html 파일 하나로 만들어줘.' },
      { label: '화합물 (PubChem, 인증키 필요 없음)', text: 'PubChem API(https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/)를 fetch로 불러와서, 화합물 영어 이름을 입력하면 분자식, 분자량, IUPAC 이름과 구조 그림을 보여주는 html을 만들어줘. 예시로 caffeine을 검색해줘. 인증키는 필요 없어. 한국어로, html 파일 하나로 만들어줘.' },
    ],
    fields: [
      { k: 'title', label: '앱 제목', ph: '예: 우리 동네 기온 그래프', req: true },
      { k: 'apiName', label: '사용한 API', ph: '예: Open-Meteo' },
      { k: 'link', label: '공유 링크', type: 'url', ph: 'Gemini Canvas 공유 링크 (https://...)' },
      { k: 'prompt', label: '사용한 프롬프트', type: 'area' },
      { k: 'memo', label: '막혔던 점 · 해결한 방법', type: 'area' },
    ] },
  { id: 'gas', no: 2, type: 'submit', title: 'Apps Script로 설문 앱 배포하기',
    desc: '이번엔 데이터가 쌓이는 앱입니다. 구글 시트에 응답이 저장되는 설문 페이지를 만들어 Apps Script 웹 앱으로 배포하세요. Canvas 말고 Gemini 일반 채팅에서 Code.gs와 Index.html을 받습니다. 다 되면 친구 설문에도 응답해 보세요! ※ 설문에 이름·연락처는 묻지 마세요.',
    prompts: [
      { label: 'Gemini 일반 채팅에 붙여넣기 ([ ] 부분을 바꾸세요)', text: '구글 Apps Script로 [설문 주제: 예) 우리 반 수면 시간과 집중력] 설문 웹앱을 만들어줘.\n파일은 Code.gs와 Index.html 두 개로 만들어줘.\n질문: [질문 3~5개. 예) 평균 수면 시간(객관식), 오후 집중도 1~5점, 하고 싶은 말(주관식)]\n제출하면 이 스크립트가 연결된 구글 시트에 시간과 응답이 한 줄씩 저장되고, 화면 아래에 문항별 응답 수 요약이 보이게 해줘.\n이름이나 연락처는 묻지 마.\n처음 하는 사람도 따라 할 수 있게, 구글 시트에서 [확장 프로그램 → Apps Script] 여는 것부터 [배포 → 새 배포 → 웹 앱, 액세스: 모든 사용자]까지 순서대로 알려줘.' },
    ],
    fields: [
      { k: 'title', label: '설문 주제', ph: '예: 수면 시간과 집중력', req: true },
      { k: 'link', label: '웹 앱 주소 (…/exec)', type: 'url', ph: 'https://script.google.com/macros/s/…/exec', req: true },
      { k: 'prompt', label: '사용한 프롬프트', type: 'area' },
      { k: 'memo', label: '배포하며 막혔던 점 · 해결 방법', type: 'area', ph: '예: "확인되지 않은 앱" 경고 → 고급 → 이동' },
    ] },
  { id: 'github', no: 3, type: 'submit', title: '같은 설문을 GitHub Pages로도 배포하기',
    desc: 'GitHub Pages는 화면 파일만 보여 줄 뿐 Code.gs를 실행하지 못합니다. 그래서 Apps Script는 데이터를 저장하는 서버로 남기고, GitHub에 올린 index.html이 그 서버 주소(/exec)를 부르게 바꿉니다. 화면(프론트엔드)과 서버(백엔드)가 나뉘는 구조예요. GitHub에는 index.html 하나만 올리면 됩니다.',
    links: [{ href: 'https://github.com/new', label: '🗂 GitHub 새 저장소 만들기' }],
    prompts: [
      { label: '같은 Gemini 대화에 이어서 붙여넣기', text: '방금 만든 Apps Script 설문을 GitHub Pages에서도 열리게 하고 싶어.\nGitHub Pages는 Code.gs를 실행할 수 없으니 이렇게 바꿔줘.\n1) Code.gs에 doPost(응답을 시트에 저장)와 doGet(문항별 응답 수를 JSON으로 돌려주기)을 추가해줘.\n2) GitHub에 올릴 index.html은 google.script.run 대신 fetch로 웹 앱 주소를 부르게 해줘. POST는 Content-Type을 text/plain으로 보내줘.\n웹 앱 주소: [내 …/exec 주소 붙여넣기]\n바뀐 Code.gs 전체와 index.html 전체를 줘. 그리고 Apps Script를 [배포 관리 → 연필 → 새 버전]으로 다시 배포하는 방법도 알려줘.' },
    ],
    fields: [
      { k: 'title', label: '저장소 이름', ph: '예: sleep-survey', req: true },
      { k: 'link', label: 'GitHub Pages 주소', type: 'url', ph: 'https://아이디.github.io/저장소이름/', req: true },
      { k: 'memo', label: '두 방식을 써 보니 다른 점', type: 'area', ph: '예: GitHub 주소가 더 짧고 Google 안내 문구가 안 뜸' },
      { k: 'fix', label: '막혔던 점 · 해결 방법', type: 'area', ph: '예: Index.html로 올려서 404 → index.html로 바꿈' },
    ] },
  { id: 'record', no: 4, type: 'submit', title: '나만의 탐구 기록 페이지 만들고 공유하기',
    desc: '이제 배운 것을 내 탐구에 씁니다. 탐구 질문·방법·결과·결론이 담긴 기록 페이지를 만들어 GitHub Pages로 공개하고, 친구들 페이지에 ♥를 눌러 주세요. 오늘 만든 API 앱이나 설문을 링크로 붙여도 좋아요.',
    prompts: [
      { label: '탐구 기록 페이지 프롬프트 ([ ] 부분을 바꾸세요)', text: '내 과학 탐구를 기록하는 한 페이지 홈페이지를 만들어줘.\n구성: 제목과 탐구 질문 / 방법 / 결과 표와 그래프 / 결론과 한계 / 참고 자료 / 관련 앱 링크 버튼\n탐구 질문: [ ]\n방법: [ ]\n결과 데이터: [ ]\n보는 사람: [예: 탐구 발표회 관람객]\n휴대폰에서도 잘 보이게, 한국어로, html 파일 하나로 만들어줘.\n없는 데이터는 지어내지 말고 [자료 필요]라고 표시해줘.' },
    ],
    fields: [
      { k: 'title', label: '탐구 제목', ph: '예: 온도에 따른 효소 반응 속도', req: true },
      { k: 'link', label: '기록 페이지 주소', type: 'url', ph: 'https://아이디.github.io/저장소이름/', req: true },
      { k: 'summary', label: '탐구 한 줄 소개', type: 'area' },
      { k: 'memo', label: 'AI가 틀렸거나 내가 직접 고친 부분', type: 'area', ph: '예: 그래프 단위가 틀려서 바로잡음' },
    ] },
  { id: 'reflect', no: 5, type: 'submit', noVote: true, title: '소감문',
    desc: '오늘 만든 주소들은 여러분의 것입니다. 끝나면 구글과 GitHub에서 꼭 로그아웃하세요.',
    fields: [
      { k: 'title', label: '한 줄 소감', req: true },
      { k: 'best', label: '가장 기억에 남는 순간', type: 'area' },
      { k: 'next', label: '다음에 만들어 보고 싶은 것', type: 'area' },
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
