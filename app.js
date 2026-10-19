const people = [
  { id: 1, name: "陈昱", avatar: "陈", color: "a1", city: "悉尼", mode: "线上 / 线下", teach: "人像摄影", level: "商业摄影师 · 6 年经验", score: 96, mutual: true, online: true, wants: "UI 设计", blurb: "擅长用自然光拍出有故事感的人像，从构图到后期带你完整走一遍。", tags: ["自然光", "构图", "Lightroom"], about: "自由摄影师，平时为生活方式品牌拍摄。比起堆砌器材，我更喜欢教你观察光线与人的状态。" },
  { id: 2, name: "苏蔓", avatar: "苏", color: "a2", city: "墨尔本", mode: "线上", teach: "Python 数据分析", level: "数据分析师 · 4 年经验", score: 91, mutual: true, online: true, wants: "Figma", blurb: "从真实小项目入手，零基础也能完成一份清晰的数据洞察报告。", tags: ["Pandas", "可视化", "零基础"], about: "金融科技公司的数据分析师，习惯把复杂概念讲成简单步骤，课程会围绕你的兴趣选数据集。" },
  { id: 3, name: "许知行", avatar: "许", color: "a3", city: "布里斯班", mode: "线上", teach: "木吉他弹唱", level: "独立音乐人 · 8 年经验", score: 88, mutual: false, online: true, wants: "品牌设计", blurb: "不从枯燥乐理开始，四个和弦让你在第一节课弹完一首歌。", tags: ["弹唱", "节奏型", "乐理"], about: "周末在 Livehouse 演出，也为初学者做过三年一对一教学。希望交换一些个人品牌视觉建议。" },
  { id: 4, name: "唐宁", avatar: "唐", color: "a4", city: "悉尼", mode: "仅线下", teach: "胶片摄影", level: "视觉编辑 · 5 年经验", score: 84, mutual: false, online: false, wants: "交互设计", blurb: "一起扫街，从测光、选片到冲扫，理解胶片独特的节奏与质感。", tags: ["扫街", "胶片", "审美"], about: "杂志视觉编辑，收藏了不少老相机。教学会安排一次两小时的街头实拍，适合喜欢慢慢观察城市的人。" },
  { id: 5, name: "周屿", avatar: "周", color: "a5", city: "悉尼", mode: "线上 / 线下", teach: "木吉他入门", level: "乐队吉他手 · 7 年经验", score: 93, mutual: true, online: true, wants: "Figma", blurb: "从你喜欢的歌开始，建立节奏感和正确的手型习惯。", tags: ["弹唱", "入门", "陪练"], about: "独立乐队吉他手，擅长帮助完全没基础的人跨过最初的手指疼和节奏不稳。" }
];

const skillMap = {
  "人像摄影": [1, 4],
  "Python": [2, 1, 4],
  "木吉他": [5, 3]
};

let state = { skill: "人像摄影", filter: "all", selected: null };
const grid = document.querySelector("#matchGrid");
const drawer = document.querySelector("#profileDrawer");
const drawerBackdrop = document.querySelector("#drawerBackdrop");
const modalBackdrop = document.querySelector("#modalBackdrop");

function currentPeople() {
  const ids = skillMap[state.skill] || people.map(p => p.id);
  return people
    .filter(p => ids.includes(p.id))
    .filter(p => state.filter === "all" || (state.filter === "mutual" && p.mutual) || (state.filter === "online" && p.online))
    .sort((a, b) => b.score - a.score);
}

function cardTemplate(p, index) {
  return `<article class="match-card ${index === 0 ? "featured" : ""}" data-id="${p.id}" tabindex="0" aria-label="查看 ${p.name} 的资料">
    <div class="card-top">
      <div class="avatar ${p.color}">${p.avatar}</div>
      <div class="person"><strong>${p.name}</strong><span class="meta">${p.city} · ${p.mode}</span></div>
      <span class="match-badge">${p.score}% 匹配</span>
    </div>
    <p class="teach-title">TA 能教你</p>
    <h3 class="teach-skill">${p.teach}</h3>
    <p class="card-blurb">${p.blurb}</p>
    <div class="skill-tags">${p.tags.map(t => `<span class="skill-tag">${t}</span>`).join("")}</div>
    ${p.mutual ? `<div class="mutual-line"><span>⇄</span> TA 也想学你的 ${p.wants}</div>` : ""}
    <button type="button" class="card-arrow" aria-label="查看详情">↗</button>
  </article>`;
}

function render() {
  const list = currentPeople();
  document.querySelector("#resultCount").textContent = list.length;
  grid.innerHTML = list.length ? list.map(cardTemplate).join("") : `<div class="empty">暂时没有符合条件的伙伴，换个筛选试试吧。</div>`;
  grid.querySelectorAll(".match-card").forEach(card => {
    const open = () => openDrawer(Number(card.dataset.id));
    card.addEventListener("click", open);
    card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  });
}

function openDrawer(id) {
  const p = people.find(person => person.id === id);
  state.selected = p;
  document.querySelector("#drawerContent").innerHTML = `
    <div class="drawer-hero"><div class="avatar ${p.color}">${p.avatar}</div><div><h2>${p.name}</h2><p>${p.level}<br>${p.city} · ${p.mode}</p></div></div>
    <div class="drawer-score"><strong>${p.score}%</strong><span>与你的目标高度匹配</span></div>
    <p class="eyebrow">为什么匹配</p>
    <div class="reason-list">
      <div class="reason"><b>01</b><span>TA 能教的「${p.teach}」符合你的学习方向</span></div>
      <div class="reason"><b>02</b><span>${p.mutual ? `TA 正在寻找「${p.wants}」指导，形成双向交换` : "你们的可用时间与授课方式相符"}</span></div>
      <div class="reason"><b>03</b><span>教学风格偏实践，与你偏好的“做中学”一致</span></div>
    </div>
    <div class="drawer-section"><h3>关于 ${p.name}</h3><p>${p.about}</p></div>
    <div class="drawer-section"><h3>擅长内容</h3><div class="skill-tags">${p.tags.map(t => `<span class="skill-tag">${t}</span>`).join("")}</div></div>
    <button class="primary-btn full" type="button" id="openInvite">发起技能交换 <span>↗</span></button>`;
  drawer.classList.add("open"); drawerBackdrop.classList.add("open"); drawer.setAttribute("aria-hidden", "false");
  document.querySelector("#openInvite").addEventListener("click", openInvite);
}

function closeDrawer() { drawer.classList.remove("open"); drawerBackdrop.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); }
function openInvite() {
  if (!state.selected) return;
  document.querySelector("#inviteName").textContent = state.selected.name;
  document.querySelector("#inviteSkill").textContent = state.selected.teach;
  modalBackdrop.classList.add("open");
}
function closeInvite() { modalBackdrop.classList.remove("open"); }
function toast(message) { const el = document.querySelector("#toast"); el.textContent = message; el.classList.add("show"); clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove("show"), 2300); }

document.querySelectorAll(".skill-pill[data-skill]").forEach(btn => btn.addEventListener("click", () => {
  state.skill = btn.dataset.skill;
  document.querySelectorAll(".skill-pill").forEach(b => b.classList.toggle("active", b === btn));
  document.querySelector("#currentSkill").textContent = state.skill;
  render();
}));
document.querySelectorAll(".filter-btn").forEach(btn => btn.addEventListener("click", () => {
  state.filter = btn.dataset.filter;
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.toggle("active", b === btn));
  render();
}));
document.querySelector("#drawerClose").addEventListener("click", closeDrawer);
drawerBackdrop.addEventListener("click", closeDrawer);
document.querySelector("#modalClose").addEventListener("click", closeInvite);
modalBackdrop.addEventListener("click", e => { if (e.target === modalBackdrop) closeInvite(); });
document.querySelector("#sendInvite").addEventListener("click", () => {
  closeInvite(); closeDrawer();
  const count = document.querySelector("#navCount"); count.textContent = Number(count.textContent) + 1;
  toast(`已向 ${state.selected.name} 发送交换邀约`);
});
document.querySelector("#menuBtn").addEventListener("click", () => document.querySelector("#sidebar").classList.toggle("open"));
document.querySelector("#completeProfile").addEventListener("click", () => toast("个人资料编辑功能已在 Demo 中模拟"));
document.querySelector("#addSkill").addEventListener("click", () => toast("新技能添加功能已在 Demo 中模拟"));
document.querySelector("#viewAll").addEventListener("click", () => toast("当前共有 2 条交换动态"));
document.querySelector("[data-action='message']").addEventListener("click", () => toast("已打开与周屿的模拟对话"));
document.addEventListener("keydown", e => { if (e.key === "Escape") { closeInvite(); closeDrawer(); } });
render();
