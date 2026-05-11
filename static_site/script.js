const students = window.STUDENTS || [];
const state = {
  query: new URLSearchParams(window.location.search).get('q') || '',
  blood: 'All',
  hometown: 'All',
  view: 'directory',
  theme: localStorage.getItem('meteoric-theme') || 'light',
};

const icons = {
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  droplet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-6.2S12 2 12 2 10 6.5 8 8.8 5 13 5 15a7 7 0 0 0 7 7Z"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 12 5a5.5 5.5 0 0 0-10 3.5c0 2.3 1.5 4 3 5.5l7 7Z"/><path d="M3.2 12H8l2-3 4 6 2-3h4.8"/></svg>',
  cap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 10c0 4.99-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3.09 5.18 2 2 0 0 1 5.11 3h3a2 2 0 0 1 2 1.72c.12.9.32 1.77.59 2.61a2 2 0 0 1-.45 2.11L9 10.69a16 16 0 0 0 4.31 4.31l1.25-1.25a2 2 0 0 1 2.11-.45c.84.27 1.71.47 2.61.59A2 2 0 0 1 22 16.92Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a2 2 0 0 1-2.06 0L2 7"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function countsBy(field) {
  return students.reduce((acc, student) => {
    const key = student[field] || 'Unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function getFiltered() {
  const query = normalize(state.query);
  return students.filter((student) => {
    const matchesQuery =
      !query ||
      [student.name, student.nickname, student.roll, student.mobile, student.email, student.hometown, student.blood]
        .map(normalize)
        .some((value) => value.includes(query));
    const matchesBlood = state.blood === 'All' || student.blood === state.blood;
    const matchesHometown = state.hometown === 'All' || student.hometown === state.hometown;
    return matchesQuery && matchesBlood && matchesHometown;
  });
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function setIcons() {
  $$('[data-icon]').forEach((node) => {
    const name = node.dataset.icon;
    if (icons[name]) node.innerHTML = icons[name];
  });
  renderThemeIcon();
}

function renderThemeIcon() {
  const icon = $('[data-theme-icon]');
  if (icon) icon.innerHTML = state.theme === 'dark' ? icons.sun : icons.moon;
}

function setTheme(theme) {
  state.theme = theme;
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('meteoric-theme', theme);
  renderThemeIcon();
}

function setView(view) {
  state.view = view;
  $$('[data-view]').forEach((section) => section.classList.toggle('active', section.dataset.view === view));
  $$('[data-view-button]').forEach((button) => button.classList.toggle('active', button.dataset.viewButton === view));
}

function renderFilters() {
  const bloodCounts = countsBy('blood');
  const bloodOrder = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].filter(
    (item) => item === 'All' || bloodCounts[item],
  );
  const hometowns = ['All', ...Array.from(new Set(students.map((student) => student.hometown).filter(Boolean))).sort()];

  $('#blood-filter').innerHTML = bloodOrder.map((value) => `<option>${escapeHtml(value)}</option>`).join('');
  $('#hometown-filter').innerHTML = hometowns.map((value) => `<option>${escapeHtml(value)}</option>`).join('');
}

function renderSummary(filtered) {
  const bloodCounts = countsBy('blood');
  const hometownCount = new Set(students.map((student) => student.hometown).filter(Boolean)).size;
  $('[data-total-students]').textContent = students.length;
  $('[data-total-blood]').textContent = Object.keys(bloodCounts).length;
  $('[data-total-hometowns]').textContent = hometownCount;
  $$('[data-visible-count]').forEach((node) => {
    node.textContent = filtered.length;
  });
  $('[data-result-count]').textContent = filtered.length;
  $('[data-aside-visible]').textContent = filtered.length;
  $('[data-aside-blood]').textContent = state.blood;
  $('[data-aside-hometown]').textContent = state.hometown;
}

function renderPreview() {
  $('#preview-list').innerHTML = students
    .slice(0, 5)
    .map(
      (student) => `
        <div class="consoleRow">
          <span class="miniAvatar">${escapeHtml(initials(student.name))}</span>
          <span>
            <b>${escapeHtml(student.name)}</b>
            <small>${escapeHtml(student.nickname || 'mETEoric')} · ${escapeHtml(student.roll)}</small>
          </span>
          <i>${escapeHtml(student.blood)}</i>
        </div>
      `,
    )
    .join('');
}

function renderStudents(filtered) {
  $('#student-list').innerHTML = filtered
    .map(
      (student, index) => `
        <article class="studentCard" style="animation-delay:${Math.min(index, 18) * 35}ms">
          <button class="profileButton" data-roll="${escapeHtml(student.roll)}" type="button">
            <span class="avatar">${escapeHtml(initials(student.name))}</span>
            <span>
              <strong>${escapeHtml(student.name)}</strong>
              <small>${escapeHtml(student.nickname || 'mETEoric 24')} · Roll ${escapeHtml(student.roll)}</small>
            </span>
          </button>
          <div class="metaRows">
            <span>${icons.map} ${escapeHtml(student.hometown || 'Unknown')}</span>
            <span>${icons.droplet} ${escapeHtml(student.blood || 'Unknown')}</span>
          </div>
          <div class="quickActions">
            <a href="tel:${escapeHtml(student.mobile)}">${icons.phone} ${escapeHtml(student.mobile)}</a>
            <a href="mailto:${escapeHtml(student.email)}">${icons.mail} Email</a>
          </div>
        </article>
      `,
    )
    .join('');

  $('#empty-state').hidden = filtered.length !== 0;
}

function renderBlood() {
  const bloodCounts = countsBy('blood');
  const max = Math.max(...Object.values(bloodCounts));
  const order = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  $('#blood-grid').innerHTML = Object.entries(bloodCounts)
    .sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]))
    .map(
      ([group, count]) => `
        <button class="bloodTile" data-blood-tile="${escapeHtml(group)}" type="button">
          <strong>${escapeHtml(group)}</strong>
          <span>${count} students</span>
          <i style="width:${(count / max) * 100}%"></i>
        </button>
      `,
    )
    .join('');
}

function renderCharts() {
  const bloodCounts = countsBy('blood');
  const hometownCounts = countsBy('hometown');
  const topHometowns = Object.entries(hometownCounts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 6);

  $('#blood-chart').innerHTML = Object.entries(bloodCounts)
    .map(([group, count]) => barRow(group, count, students.length))
    .join('');

  const maxTown = Math.max(...topHometowns.map(([, count]) => count));
  $('#hometown-chart').innerHTML = topHometowns.map(([town, count]) => barRow(town, count, maxTown)).join('');
}

function barRow(label, count, max) {
  return `
    <div class="barRow">
      <span>${escapeHtml(label)}</span>
      <div><i style="width:${(count / max) * 100}%"></i></div>
      <b>${count}</b>
    </div>
  `;
}

function render() {
  const filtered = getFiltered();
  renderSummary(filtered);
  renderStudents(filtered);
  const params = new URLSearchParams(window.location.search);
  if (state.query) params.set('q', state.query);
  else params.delete('q');
  window.history.replaceState({}, '', `${window.location.pathname}${params.toString() ? `?${params}` : ''}`);
  $('#student-search').value = state.query;
  $('#blood-filter').value = state.blood;
  $('#hometown-filter').value = state.hometown;
  $('.searchBox').classList.toggle('hasValue', Boolean(state.query));
}

function resetFilters() {
  state.query = '';
  state.blood = 'All';
  state.hometown = 'All';
  render();
}

function makeCsv(rows) {
  const headers = ['Roll', 'Name', 'Nickname', 'Mobile', 'Email', 'Hometown', 'Blood'];
  const body = rows.map((student) =>
    [student.roll, student.name, student.nickname, student.mobile, student.email, student.hometown, student.blood]
      .map((field) => `"${String(field || '').replaceAll('"', '""')}"`)
      .join(','),
  );
  return [headers.join(','), ...body].join('\n');
}

function exportCsv() {
  const blob = new Blob([makeCsv(getFiltered())], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'meteoric-24-directory-filtered.csv';
  link.click();
  URL.revokeObjectURL(url);
}

function openProfile(roll) {
  const student = students.find((item) => item.roll === roll);
  if (!student) return;
  $('[data-modal-initials]').textContent = initials(student.name);
  $('[data-modal-roll]').textContent = `Roll ${student.roll}`;
  $('[data-modal-name]').textContent = student.name;
  $('[data-modal-nick]').textContent = student.nickname || 'mETEoric 24';
  $('[data-modal-blood]').textContent = student.blood || 'Unknown';
  $('[data-modal-hometown]').textContent = student.hometown || 'Unknown';
  $('[data-modal-mobile]').textContent = student.mobile;
  $('[data-modal-email-text]').textContent = student.email;
  $('[data-modal-phone]').href = `tel:${student.mobile}`;
  $('[data-modal-email]').href = `mailto:${student.email}`;
  $('#profile-modal').hidden = false;
}

function closeProfile() {
  $('#profile-modal').hidden = true;
}

function bindEvents() {
  $('#student-search').addEventListener('input', (event) => {
    state.query = event.target.value;
    render();
  });
  $('#clear-search').addEventListener('click', () => {
    state.query = '';
    render();
    $('#student-search').focus();
  });
  $('#blood-filter').addEventListener('change', (event) => {
    state.blood = event.target.value;
    render();
  });
  $('#hometown-filter').addEventListener('change', (event) => {
    state.hometown = event.target.value;
    render();
  });
  ['reset-filters', 'empty-reset'].forEach((id) => $(`#${id}`).addEventListener('click', resetFilters));
  ['nav-export', 'hero-export', 'section-export'].forEach((id) => $(`#${id}`).addEventListener('click', exportCsv));
  $('#theme-toggle').addEventListener('click', () => setTheme(state.theme === 'dark' ? 'light' : 'dark'));
  $('[data-open-roster]').addEventListener('click', () => setView('directory'));
  $$('[data-view-button]').forEach((button) => button.addEventListener('click', () => setView(button.dataset.viewButton)));
  $('#student-list').addEventListener('click', (event) => {
    const button = event.target.closest('[data-roll]');
    if (button) openProfile(button.dataset.roll);
  });
  $('#blood-grid').addEventListener('click', (event) => {
    const tile = event.target.closest('[data-blood-tile]');
    if (!tile) return;
    state.blood = tile.dataset.bloodTile;
    setView('directory');
    render();
  });
  $('#close-modal').addEventListener('click', closeProfile);
  $('#profile-modal').addEventListener('click', (event) => {
    if (event.target.id === 'profile-modal') closeProfile();
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === '/' && document.activeElement?.tagName !== 'INPUT') {
      event.preventDefault();
      $('#student-search').focus();
    }
    if (event.key === 'Escape') {
      state.query = '';
      closeProfile();
      render();
    }
  });
}

function init() {
  setIcons();
  setTheme(state.theme);
  renderFilters();
  renderPreview();
  renderBlood();
  renderCharts();
  bindEvents();
  render();
}

init();
