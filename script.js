/* ---------- Constants ---------- */
const STORAGE_KEYS = { questions: 'ipt_questions', settings: 'ipt_settings', machine: 'ipt_machine' };
const CATEGORIES = ['DSA', 'Git', 'Technical'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const STATUSES = ['Pending', 'In Progress', 'Completed'];
const MACHINE_STATUSES = ['Not Started', 'In Progress', 'Completed'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const PAGE_TITLES = { dashboard: 'Dashboard', questions: 'Question Tracker', progress: 'Weekly Progress', settings: 'Settings' };

const ICONS = {
  logout: '<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>',
  dash: '<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9L7 7M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  x: '<path d="M18 6L6 18M6 6l12 12"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  code: '<path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5z"/>',
  cpu: '<rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4"/>',
  layers: '<path d="M12 2l10 5-10 5L2 7z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>',
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5.1L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.5-6.9A2 2 0 0016.8 4H7.2a2 2 0 00-1.7 1.1z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>'
};

const DEMO_QUESTIONS = [
  ['Two Sum', 'DSA', 'Easy', 'Completed', 'Arrays / Hash map'],
  ['Longest Substring Without Repeating Characters', 'DSA', 'Medium', 'Completed', 'Sliding window'],
  ['Merge K Sorted Lists', 'DSA', 'Hard', 'In Progress', 'Heap'],
  ['Binary Tree Level Order Traversal', 'DSA', 'Medium', 'Pending', 'BFS'],
  ['Difference between git merge and git rebase', 'Git', 'Medium', 'Completed', 'Branching'],
  ['How do you undo a pushed commit?', 'Git', 'Easy', 'Pending', 'revert vs reset'],
  ['Explain the React reconciliation process', 'Technical', 'Medium', 'In Progress', 'Virtual DOM'],
  ['What is event delegation in JavaScript?', 'Technical', 'Easy', 'Completed', 'Events']
];

/* ---------- State ---------- */
const state = {
  user: null,
  authMode: 'login',
  questions: [],
  settings: { target: 20, theme: 'light' },
  machine: { status: 'Not Started', notes: '', updatedAt: null },
  filters: { category: 'All', difficulty: 'All', status: 'All' },
  query: '',
  page: 'dashboard',
  editingId: null,
  confirmAction: null
};

const $ = (id) => document.getElementById(id);

/* ---------- Helpers ---------- */
function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
function generateId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function formatDate(timestamp) {
  if (!timestamp) return '—';
  return new Date(timestamp).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}
function iconSvg(name, size) {
  return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + '</svg>';
}
function hydrateIcons(root) {
  (root || document).querySelectorAll('[data-icon]').forEach((el) => {
    el.innerHTML = iconSvg(el.dataset.icon, el.dataset.size || 20);
  });
}
function badge(value) {
  return '<span class="badge b-' + value.toLowerCase().replace(/\s+/g, '-') + '">' + escapeHtml(value) + '</span>';
}
function fillSelect(select, options, placeholder) {
  select.innerHTML = '<option value="">' + placeholder + '</option>' +
    options.map((o) => '<option value="' + o + '">' + o + '</option>').join('');
}

/* ---------- LocalStorage & Auth Core Functions ---------- */
const AUTH_KEYS = { users: 'ipt_users', session: 'ipt_session' };

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    showToast('Could not save data. Browser storage may be disabled or full.', 'error');
    return false;
  }
}

async function hashPassword(password, salt) {
  if (!window.crypto || !crypto.subtle) return btoa(unescape(encodeURIComponent(salt + password)));
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + password));
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function readUsers() {
  const users = readStorage(AUTH_KEYS.users, []);
  return Array.isArray(users) ? users.filter((u) => u && u.id && u.email && u.hash && u.salt) : [];
}

function getCurrentUser() {
  const session = readStorage(AUTH_KEYS.session, null);
  if (!session || !session.userId) return null;
  const users = readUsers();
  const user = users.find((u) => u.id === session.userId);
  return user ? { id: user.id, name: user.name, email: user.email } : null;
}

function isAuthenticated() {
  return getCurrentUser() !== null;
}

function validateSignupForm(name, email, password) {
  const errors = {};
  if (!name || name.trim().length < 2) {
    errors['a-name'] = 'Please enter your name.';
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors['a-email'] = 'Enter a valid email address.';
  }
  if (!password || password.trim().length < 8) {
    errors['a-password'] = 'Password must be at least 8 characters.';
  }
  return errors;
}

function validateLoginForm(email, password) {
  const errors = {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors['a-email'] = 'Enter a valid email address.';
  }
  if (!password || password.trim() === '') {
    errors['a-password'] = 'Password is required.';
  }
  return errors;
}

async function registerUser(name, email, password) {
  const users = readUsers();
  const cleanEmail = email.trim().toLowerCase();
  
  if (users.some((u) => u.email === cleanEmail)) {
    throw new Error('An account with this email already exists.');
  }
  
  const salt = generateId();
  const hashedPassword = await hashPassword(password, salt);
  const newUser = {
    id: 'u_' + generateId(),
    name: name.trim(),
    email: cleanEmail,
    salt,
    hash: hashedPassword,
    createdAt: Date.now()
  };

  users.push(newUser);
  if (!writeStorage(AUTH_KEYS.users, users)) {
    throw new Error('Could not save your account.');
  }
  return newUser;
}

async function loginUser(email, password) {
  const users = readUsers();
  const cleanEmail = email.trim().toLowerCase();
  const user = users.find((u) => u.email === cleanEmail);

  if (!user) {
    throw new Error('No account found. Please sign up first.');
  }

  const hashedPassword = await hashPassword(password, user.salt);
  if (hashedPassword !== user.hash) {
    throw new Error('Incorrect email or password.');
  }

  writeStorage(AUTH_KEYS.session, { userId: user.id });
  return { id: user.id, name: user.name, email: user.email };
}

function logoutUser() {
  try {
    localStorage.removeItem(AUTH_KEYS.session);
  } catch (e) {
    // ignore
  }
}

function isValidQuestion(q) {
  return q && typeof q === 'object' && typeof q.id === 'string' && typeof q.title === 'string' && q.title.trim() !== '' &&
    CATEGORIES.includes(q.category) && DIFFICULTIES.includes(q.difficulty) && STATUSES.includes(q.status);
}
function userKey(name) { return state.user ? STORAGE_KEYS[name] + '_' + state.user.id : null; }

function resetStateToDefaults() {
  state.questions = [];
  state.settings = { target: 20, theme: state.settings.theme };
  state.machine = { status: 'Not Started', notes: '', updatedAt: null };
  state.filters = { category: 'All', difficulty: 'All', status: 'All' };
  state.query = ''; state.editingId = null; state.confirmAction = null;
  if ($('searchInput')) $('searchInput').value = '';
}

function loadState() {
  resetStateToDefaults();
  if (!state.user) return;
  const questions = readStorage(userKey('questions'), []);
  state.questions = Array.isArray(questions) ? questions.filter(isValidQuestion) : [];
  const settings = readStorage(userKey('settings'), {}) || {};
  state.settings.target = clamp(parseInt(settings.target, 10) || 20, 1, 200);
  state.settings.theme = settings.theme === 'dark' ? 'dark' : 'light';
  const machine = readStorage(userKey('machine'), {}) || {};
  state.machine.status = MACHINE_STATUSES.includes(machine.status) ? machine.status : 'Not Started';
  state.machine.notes = typeof machine.notes === 'string' ? machine.notes : '';
  state.machine.updatedAt = typeof machine.updatedAt === 'number' ? machine.updatedAt : null;
}

function persist(name, value) { return state.user ? writeStorage(userKey(name), value) : false; }
const saveQuestions = () => persist('questions', state.questions);
const saveSettings = () => persist('settings', state.settings);
const saveMachine = () => persist('machine', state.machine);

/* ---------- Statistics ---------- */
function getWeekStart() {
  const date = new Date();
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}
function computeStats() {
  const completed = state.questions.filter((q) => q.status === 'Completed');
  const weekStart = getWeekStart();
  const thisWeek = completed.filter((q) => typeof q.completedAt === 'number' && q.completedAt >= weekStart);
  const activity = [0, 0, 0, 0, 0, 0, 0];
  thisWeek.forEach((q) => { activity[(new Date(q.completedAt).getDay() + 6) % 7] += 1; });
  const total = state.questions.length;
  const target = state.settings.target;
  return {
    total,
    completed: completed.length,
    percent: total ? Math.round((completed.length / total) * 100) : 0,
    dsaDone: completed.filter((q) => q.category === 'DSA').length,
    interviewDone: completed.filter((q) => q.category !== 'DSA').length,
    weekDone: thisWeek.length,
    target,
    remaining: Math.max(0, target - thisWeek.length),
    goalPercent: Math.min(100, Math.round((thisWeek.length / target) * 100)),
    activity
  };
}

/* ---------- Rendering ---------- */
function renderGreeting() {
  const hour = new Date().getHours();
  const part = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  $('greeting').textContent = part + ', let’s prepare for your next interview!';
}
function renderStats(stats) {
  $('statTotal').textContent = stats.total;
  $('statDsa').textContent = stats.dsaDone;
  $('statTech').textContent = stats.interviewDone;
  $('statMachine').textContent = state.machine.status;
  $('statMachineSub').textContent = state.machine.updatedAt ? 'Updated ' + formatDate(state.machine.updatedAt) : 'Not updated yet';
}
function renderOverall(stats) {
  $('overallEmpty').hidden = stats.total > 0;
  $('overallBody').hidden = stats.total === 0;
  $('overallPercent').textContent = stats.percent + '%';
  $('overallText').textContent = stats.completed + ' of ' + stats.total + ' completed';
  $('overallBar').style.width = stats.percent + '%';
  $('dashGoal').textContent = stats.target;
  $('dashWeek').textContent = stats.weekDone;
  $('dashLeft').textContent = stats.remaining;
}
function renderActivity(stats) {
  const max = Math.max(1, ...stats.activity);
  const today = (new Date().getDay() + 6) % 7;
  $('activityChart').innerHTML = stats.activity.map((count, i) =>
    '<div class="bar-col"><span>' + (count || '') + '</span>' +
    '<div class="bar' + (count ? ' has' : '') + '" style="height:' + (count ? Math.max(10, Math.round((count / max) * 90)) : 6) + 'px"></div>' +
    '<span class="bar-label' + (i === today ? ' today' : '') + '">' + DAYS[i] + '</span></div>'
  ).join('');
}
function renderRecent() {
  const recent = state.questions.slice(0, 5);
  $('recentList').innerHTML = recent.length
    ? recent.map((q) => '<li><span class="t">' + escapeHtml(q.title) + '</span>' + badge(q.status) + '</li>').join('')
    : '<li><span class="muted">Your latest questions will show up here.</span></li>';
}
function renderMachine() {
  $('machineBadge').className = 'badge b-' + state.machine.status.toLowerCase().replace(/\s+/g, '-');
  $('machineBadge').textContent = state.machine.status;
  $('machineSeg').innerHTML = MACHINE_STATUSES.map((s) =>
    '<button type="button" data-machine="' + s + '" class="' + (s === state.machine.status ? 'active' : '') + '" aria-pressed="' + (s === state.machine.status) + '">' + s + '</button>'
  ).join('');
  if (document.activeElement !== $('machineNotes')) $('machineNotes').value = state.machine.notes;
  $('machineUpdated').textContent = 'Last updated: ' + formatDate(state.machine.updatedAt);
}
function renderGoal(stats) {
  $('goalTargetLabel').textContent = 'Target: ' + stats.target + ' questions';
  $('goalPercent').textContent = stats.goalPercent + '%';
  $('goalText').textContent = stats.weekDone + ' done · ' + stats.remaining + ' left';
  $('goalBar').style.width = stats.goalPercent + '%';
  let message = 'A fresh week. Solve your first question today.';
  if (!stats.total) message = 'Add some questions to get started.';
  else if (stats.goalPercent >= 100) message = 'Goal smashed! Time to aim higher.';
  else if (stats.goalPercent >= 60) message = 'Great momentum. The finish line is close.';
  else if (stats.goalPercent > 0) message = 'Good start. Keep the streak going!';
  $('goalMessage').textContent = message;
  if (document.activeElement !== $('targetInput')) $('targetInput').value = state.settings.target;
}
function renderCategoryProgress() {
  if (!state.questions.length) {
    $('categoryProgress').innerHTML = '<p class="muted">Add questions to see your category breakdown.</p>';
    return;
  }
  $('categoryProgress').innerHTML = CATEGORIES.map((category) => {
    const items = state.questions.filter((q) => q.category === category);
    const done = items.filter((q) => q.status === 'Completed').length;
    const percent = items.length ? Math.round((done / items.length) * 100) : 0;
    return '<div class="cat-row"><div class="row-between"><span>' + badge(category) + '</span><span class="muted">' + done + '/' + items.length + ' · ' + percent + '%</span></div>' +
      '<div class="bar-track"><div class="bar-fill" style="width:' + percent + '%"></div></div></div>';
  }).join('');
}

function getFilteredQuestions() {
  const search = state.query.trim().toLowerCase();
  return state.questions.filter((q) =>
    (state.filters.category === 'All' || q.category === state.filters.category) &&
    (state.filters.difficulty === 'All' || q.difficulty === state.filters.difficulty) &&
    (state.filters.status === 'All' || q.status === state.filters.status) &&
    (!search || q.title.toLowerCase().includes(search))
  );
}
function actionButtons(id, title) {
  return '<div class="row-actions">' +
    '<button class="icon-btn small" data-action="edit" data-id="' + id + '" aria-label="Edit ' + escapeHtml(title) + '">' + iconSvg('edit', 16) + '</button>' +
    '<button class="icon-btn small" data-action="delete" data-id="' + id + '" aria-label="Delete ' + escapeHtml(title) + '">' + iconSvg('trash', 16) + '</button></div>';
}
function renderEmptyState(kind) {
  const box = $('emptyState');
  const variants = {
    none: ['inbox', 'No questions added yet', 'Start building your question bank for DSA, Git and technical rounds.', '<button class="btn primary" data-action="add">Add Your First Question</button>'],
    nomatch: ['search', 'No questions match your search or filters', 'Try different keywords or clear your filters.', '<button class="btn secondary" data-action="reset-filters">Clear search and filters</button>']
  };
  const v = variants[kind];
  box.innerHTML = '<span class="empty-icon">' + iconSvg(v[0], 28) + '</span><h3>' + v[1] + '</h3><p class="muted">' + v[2] + '</p>' + v[3];
}
function renderQuestions() {
  const list = getFilteredQuestions();
  const hasAny = state.questions.length > 0;
  $('filtersBar').hidden = !hasAny;
  $('resultCount').textContent = list.length + (list.length === 1 ? ' result' : ' results');
  $('clearSearchBtn').hidden = state.query === '';

  const showEmpty = list.length === 0;
  $('emptyState').hidden = !showEmpty;
  $('tableWrap').hidden = showEmpty;
  $('cardList').hidden = showEmpty;
  if (showEmpty) renderEmptyState(hasAny ? 'nomatch' : 'none');

  $('questionBody').innerHTML = list.map((q) =>
    '<tr><td><div class="title">' + escapeHtml(q.title) + '</div>' + (q.notes ? '<div class="note">' + escapeHtml(q.notes) + '</div>' : '') + '</td>' +
    '<td>' + badge(q.category) + '</td><td>' + badge(q.difficulty) + '</td><td>' + badge(q.status) + '</td>' +
    '<td class="date">' + formatDate(q.createdAt) + '</td><td>' + actionButtons(q.id, q.title) + '</td></tr>'
  ).join('');
  $('cardList').innerHTML = list.map((q) =>
    '<div class="q-card"><div class="head"><span>' + escapeHtml(q.title) + '</span>' + actionButtons(q.id, q.title) + '</div>' +
    (q.notes ? '<p class="muted note">' + escapeHtml(q.notes) + '</p>' : '') +
    '<div class="tags">' + badge(q.category) + badge(q.difficulty) + badge(q.status) + '</div>' +
    '<small class="muted">Added ' + formatDate(q.createdAt) + '</small></div>'
  ).join('');
}
function renderAll() {
  const stats = computeStats();
  renderStats(stats); renderOverall(stats); renderActivity(stats); renderRecent();
  renderMachine(); renderGoal(stats); renderCategoryProgress(); renderQuestions();
}

/* ---------- Navigation and theme ---------- */
function openSidebar() { $('sidebar').classList.add('open'); $('overlay').classList.add('show'); }
function closeSidebar() { $('sidebar').classList.remove('open'); $('overlay').classList.remove('show'); }
function showPage(page) {
  if (!state.user) return;
  state.page = page;
  document.querySelectorAll('.page').forEach((el) => el.classList.toggle('active', el.id === 'page-' + page));
  document.querySelectorAll('.nav-link').forEach((btn) => {
    const active = btn.dataset.page === page;
    btn.classList.toggle('active', active);
    if (active) btn.setAttribute('aria-current', 'page'); else btn.removeAttribute('aria-current');
  });
  $('pageTitle').textContent = PAGE_TITLES[page];
  closeSidebar();
  window.scrollTo(0, 0);
}
function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.settings.theme);
  const icon = iconSvg(state.settings.theme === 'dark' ? 'sun' : 'moon', 20);
  $('themeBtn').innerHTML = icon;
  $('themeBtn2').innerHTML = icon;
}
function toggleTheme() {
  state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark';
  saveSettings();
  applyTheme();
  writeStorage('ipt_last_theme', state.settings.theme);
}

/* ---------- Toasts ---------- */
function showToast(message, type) {
  const toast = document.createElement('div');
  toast.className = 'toast' + (type === 'error' ? ' error' : '');
  toast.textContent = message;
  $('toasts').appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

/* ---------- Validation ---------- */
function validateQuestion(data) {
  const errors = {};
  const title = data.title.trim();
  if (!title) errors.title = 'Question title is required.';
  else if (title.length < 3) errors.title = 'Title must be at least 3 characters.';
  else if (title.length > 200) errors.title = 'Title must be 200 characters or fewer.';
  if (!CATEGORIES.includes(data.category)) errors.category = 'Please choose a category.';
  if (!DIFFICULTIES.includes(data.difficulty)) errors.difficulty = 'Please choose a difficulty.';
  if (!STATUSES.includes(data.status)) errors.status = 'Please choose a status.';
  return errors;
}
function showFormErrors(errors) {
  ['title', 'category', 'difficulty', 'status'].forEach((field) => {
    $('err-' + field).textContent = errors[field] || '';
    $('f-' + field).setAttribute('aria-invalid', errors[field] ? 'true' : 'false');
  });
}

/* ---------- CRUD ---------- */
function createQuestion(data) {
  const now = Date.now();
  state.questions.unshift({ id: generateId(), ...data, createdAt: now, completedAt: data.status === 'Completed' ? now : null });
  saveQuestions();
}
function updateQuestion(id, data) {
  const question = state.questions.find((q) => q.id === id);
  if (!question) return false;
  const wasCompleted = question.status === 'Completed';
  Object.assign(question, data);
  question.completedAt = data.status === 'Completed' ? (wasCompleted && question.completedAt ? question.completedAt : Date.now()) : null;
  saveQuestions();
  return true;
}
function deleteQuestion(id) {
  state.questions = state.questions.filter((q) => q.id !== id);
  saveQuestions();
}

/* ---------- Modals ---------- */
function openQuestionForm(id) {
  const question = id ? state.questions.find((q) => q.id === id) : null;
  state.editingId = question ? question.id : null;
  $('formTitle').textContent = question ? 'Edit question' : 'Add question';
  $('formSubmitBtn').textContent = question ? 'Save changes' : 'Add question';
  $('f-title').value = question ? question.title : '';
  $('f-category').value = question ? question.category : '';
  $('f-difficulty').value = question ? question.difficulty : '';
  $('f-status').value = question ? question.status : 'Pending';
  $('f-notes').value = question ? (question.notes || '') : '';
  showFormErrors({});
  $('formModal').showModal();
  $('f-title').focus();
}
function handleFormSubmit(event) {
  event.preventDefault();
  const data = {
    title: $('f-title').value, category: $('f-category').value, difficulty: $('f-difficulty').value,
    status: $('f-status').value, notes: $('f-notes').value.trim()
  };
  const errors = validateQuestion(data);
  showFormErrors(errors);
  if (Object.keys(errors).length) {
    showToast('Please fix the highlighted fields.', 'error');
    return;
  }
  data.title = data.title.trim();
  if (state.editingId) {
    if (updateQuestion(state.editingId, data)) showToast('Question updated');
    else showToast('That question no longer exists.', 'error');
  } else {
    createQuestion(data);
    showToast('Question added successfully');
  }
  $('formModal').close();
  renderAll();
}
function askConfirmation(title, text, label, onConfirm) {
  $('confirmTitle').textContent = title;
  $('confirmText').textContent = text;
  $('confirmOk').textContent = label;
  state.confirmAction = onConfirm;
  $('confirmModal').showModal();
}

/* ---------- Other actions ---------- */
function resetFilters() {
  state.filters = { category: 'All', difficulty: 'All', status: 'All' };
  state.query = '';
  $('searchInput').value = '';
  $('filterCategory').value = 'All';
  $('filterDifficulty').value = 'All';
  $('filterStatus').value = 'All';
  renderQuestions();
}
function setMachineStatus(status) {
  if (!MACHINE_STATUSES.includes(status)) return;
  state.machine.status = status;
  state.machine.updatedAt = Date.now();
  saveMachine();
  renderAll();
  showToast('Machine coding status: ' + status);
}
function loadDemoData() {
  const now = Date.now();
  const demo = DEMO_QUESTIONS.map((row, i) => {
    const time = now - i * 86400000;
    return { id: generateId(), title: row[0], category: row[1], difficulty: row[2], status: row[3], notes: row[4], createdAt: time, completedAt: row[3] === 'Completed' ? time : null };
  });
  state.questions = demo.concat(state.questions);
  saveQuestions();
  renderAll();
  showToast('Demo data loaded');
}
function resetAllData() {
  state.questions = [];
  state.settings = { target: 20, theme: state.settings.theme };
  state.machine = { status: 'Not Started', notes: '', updatedAt: null };
  saveQuestions(); saveSettings(); saveMachine();
  resetFilters();
  renderAll();
  showToast('All data has been reset');
}
function updateTarget(value) {
  state.settings.target = clamp(parseInt(value, 10) || 1, 1, 200);
  saveSettings();
  renderAll();
}

/* ---------- Auth UI and session management ---------- */
function clearAuthErrors() {
  ['a-name', 'a-email', 'a-password'].forEach((id) => {
    if ($('err-' + id)) $('err-' + id).textContent = '';
    if ($(id)) $(id).setAttribute('aria-invalid', 'false');
  });
  if ($('authError')) $('authError').textContent = '';
}

function setAuthMode(mode) {
  state.authMode = mode;
  const signup = mode === 'signup';
  if ($('tabLogin')) $('tabLogin').classList.toggle('active', !signup);
  if ($('tabSignup')) $('tabSignup').classList.toggle('active', signup);
  if ($('nameField')) $('nameField').hidden = !signup;
  if ($('authSubmit')) $('authSubmit').textContent = signup ? 'Create account' : 'Log in';
  if ($('a-password')) $('a-password').autocomplete = signup ? 'new-password' : 'current-password';
  clearAuthErrors();
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  clearAuthErrors();
  const mode = state.authMode;
  const nameInput = $('a-name') ? $('a-name').value : '';
  const emailInput = $('a-email') ? $('a-email').value : '';
  const passwordInput = $('a-password') ? $('a-password').value : '';

  const errors = mode === 'signup' 
    ? validateSignupForm(nameInput, emailInput, passwordInput) 
    : validateLoginForm(emailInput, passwordInput);

  Object.keys(errors).forEach((id) => {
    if ($('err-' + id)) $('err-' + id).textContent = errors[id];
    if ($(id)) $(id).setAttribute('aria-invalid', 'true');
  });

  if (Object.keys(errors).length) return;

  if ($('authSubmit')) $('authSubmit').disabled = true;

  try {
    if (mode === 'signup') {
      await registerUser(nameInput, emailInput, passwordInput);
      showToast('Account created successfully! Please log in.');
      if ($('authForm')) $('authForm').reset();
      setAuthMode('login');
    } else {
      const user = await loginUser(emailInput, passwordInput);
      startSession(user);
      showToast('Welcome back!');
    }
  } catch (error) {
    if ($('authError')) $('authError').textContent = error.message || 'Authentication failed. Please try again.';
  } finally {
    if ($('authSubmit')) $('authSubmit').disabled = false;
  }
}

function handleLogout() {
  logoutUser();
  endSession();
  showToast('You have been logged out');
}

function renderUser() {
  const user = state.user;
  if (!user) return;
  const display = user.name || user.email.split('@')[0];
  const initial = display.trim().charAt(0).toUpperCase() || '?';
  if ($('userAvatar')) $('userAvatar').textContent = initial;
  if ($('topAvatar')) $('topAvatar').textContent = initial;
  if ($('userName')) $('userName').textContent = display;
  if ($('userEmail')) $('userEmail').textContent = user.email;
  if ($('settingsEmail')) $('settingsEmail').textContent = user.email;
}

function startSession(user) {
  state.user = user;
  loadState();
  if ($('authForm')) $('authForm').reset();
  clearAuthErrors();
  applyTheme();
  renderGreeting();
  renderUser();
  document.body.classList.add('authed');
  showPage('dashboard');
  renderAll();
}

function endSession() {
  state.user = null;
  resetStateToDefaults();
  if ($('formModal') && typeof $('formModal').close === 'function') $('formModal').close();
  if ($('confirmModal') && typeof $('confirmModal').close === 'function') $('confirmModal').close();
  closeSidebar();
  document.body.classList.remove('authed');
  setAuthMode('login');
  applyTheme();
}

/* ---------- Event listeners ---------- */
function setupAuthEvents() {
  if ($('authForm')) $('authForm').addEventListener('submit', handleAuthSubmit);
  if ($('tabLogin')) $('tabLogin').addEventListener('click', () => setAuthMode('login'));
  if ($('tabSignup')) $('tabSignup').addEventListener('click', () => setAuthMode('signup'));
  if ($('logoutBtn')) $('logoutBtn').addEventListener('click', handleLogout);
  if ($('logoutBtn2')) $('logoutBtn2').addEventListener('click', handleLogout);
}

function setupEvents() {
  if ($('menuBtn')) $('menuBtn').addEventListener('click', openSidebar);
  if ($('closeMenuBtn')) $('closeMenuBtn').addEventListener('click', closeSidebar);
  if ($('overlay')) $('overlay').addEventListener('click', closeSidebar);
  if ($('themeBtn')) $('themeBtn').addEventListener('click', toggleTheme);
  if ($('themeBtn2')) $('themeBtn2').addEventListener('click', toggleTheme);

  document.querySelectorAll('.nav-link').forEach((btn) => btn.addEventListener('click', () => showPage(btn.dataset.page)));

  if ($('searchInput')) {
    $('searchInput').addEventListener('input', (e) => {
      state.query = e.target.value;
      if (state.query && state.page !== 'questions') showPage('questions');
      renderQuestions();
    });
  }
  if ($('clearSearchBtn')) {
    $('clearSearchBtn').addEventListener('click', () => {
      state.query = '';
      if ($('searchInput')) $('searchInput').value = '';
      renderQuestions();
    });
  }

  if ($('filterCategory')) $('filterCategory').addEventListener('change', (e) => { state.filters.category = e.target.value; renderQuestions(); });
  if ($('filterDifficulty')) $('filterDifficulty').addEventListener('change', (e) => { state.filters.difficulty = e.target.value; renderQuestions(); });
  if ($('filterStatus')) $('filterStatus').addEventListener('change', (e) => { state.filters.status = e.target.value; renderQuestions(); });

  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    const id = target.dataset.id;
    if (action === 'add') openQuestionForm(null);
    else if (action === 'edit') openQuestionForm(id);
    else if (action === 'reset-filters') resetFilters();
    else if (action === 'go') showPage(target.dataset.page);
    else if (action === 'delete') {
      const question = state.questions.find((q) => q.id === id);
      if (!question) return;
      askConfirmation('Delete question?', '“' + question.title + '” will be permanently removed.', 'Delete', () => {
        deleteQuestion(id);
        renderAll();
        showToast('Question deleted');
      });
    }
  });

  if ($('machineSeg')) {
    $('machineSeg').addEventListener('click', (e) => {
      const button = e.target.closest('[data-machine]');
      if (button) setMachineStatus(button.dataset.machine);
    });
  }
  if ($('saveMachineNotes')) {
    $('saveMachineNotes').addEventListener('click', () => {
      if ($('machineNotes')) state.machine.notes = $('machineNotes').value;
      state.machine.updatedAt = Date.now();
      saveMachine();
      renderAll();
      showToast('Notes saved');
    });
  }

  if ($('questionForm')) $('questionForm').addEventListener('submit', handleFormSubmit);
  if ($('formCancelBtn')) $('formCancelBtn').addEventListener('click', () => $('formModal').close());
  if ($('formCloseBtn')) $('formCloseBtn').addEventListener('click', () => $('formModal').close());
  if ($('confirmCancel')) $('confirmCancel').addEventListener('click', () => $('confirmModal').close());
  if ($('confirmOk')) {
    $('confirmOk').addEventListener('click', () => {
      const action = state.confirmAction;
      state.confirmAction = null;
      $('confirmModal').close();
      if (action) action();
    });
  }
  ['formModal', 'confirmModal'].forEach((id) => {
    if ($(id)) {
      $(id).addEventListener('click', (e) => { if (e.target === $(id)) $(id).close(); });
    }
  });

  if ($('targetInput')) $('targetInput').addEventListener('change', (e) => updateTarget(e.target.value));
  if ($('loadDemoBtn')) $('loadDemoBtn').addEventListener('click', loadDemoData);
  if ($('resetDataBtn')) {
    $('resetDataBtn').addEventListener('click', () => {
      askConfirmation('Reset all data?', 'This clears all questions, goals and machine coding notes. This can’t be undone.', 'Reset everything', resetAllData);
    });
  }
}

/* ---------- Init ---------- */
function init() {
  hydrateIcons();
  if ($('f-category')) fillSelect($('f-category'), CATEGORIES, 'Select…');
  if ($('f-difficulty')) fillSelect($('f-difficulty'), DIFFICULTIES, 'Select…');
  if ($('f-status')) fillSelect($('f-status'), STATUSES, 'Select…');
  if ($('filterCategory')) fillSelect($('filterCategory'), CATEGORIES, 'Category: All');
  if ($('filterDifficulty')) fillSelect($('filterDifficulty'), DIFFICULTIES, 'Difficulty: All');
  if ($('filterStatus')) fillSelect($('filterStatus'), STATUSES, 'Status: All');
  ['filterCategory', 'filterDifficulty', 'filterStatus'].forEach((id) => { if ($(id) && $(id).options[0]) $(id).options[0].value = 'All'; });
  
  state.settings.theme = readStorage('ipt_last_theme', 'light') === 'dark' ? 'dark' : 'light';
  applyTheme();
  setupEvents();
  setupAuthEvents();
  setAuthMode('login');

  // Session verification and restoration on page load
  const activeUser = getCurrentUser();
  if (activeUser) {
    startSession(activeUser);
  } else {
    endSession();
  }
}

init();