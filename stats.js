/* =====================================================================
   Статистика участников для всех уровней «Охоты на баги».

   Сценарий: один компьютер, дети подходят по очереди. Каждый вводит имя
   (можно не вводить), играет, нажимает «Следующий участник».

   С запущенным server.py каждое событие сразу дописывается в файл
   stats/statistics.csv. Без сервера события копятся в этом браузере,
   их можно сохранить кнопкой «Скачать CSV» в окне статистики.
   ===================================================================== */
window.BugStats = (() => {
  'use strict';

  const ROWS_KEY = 'korzh-bughunt-stats-v1';
  const PARTICIPANT_KEY = 'korzh-bughunt-participant-v1';
  const PROGRESS_KEYS = ['korzh-bughunt-v1', 'korzh-bughunt-l2-v1', 'korzh-bughunt-l3-v1', 'korzh-bughunt-l4-v1', 'korzh-theme'];
  const COLUMNS = [
    ['at', 'Дата и время'], ['name', 'Участник'], ['level', 'Уровень'], ['event', 'Событие'],
    ['bug', 'Баг'], ['severity', 'Серьёзность'], ['points', 'Баллы'], ['clock', 'Время от старта'],
    ['elapsed', 'Секунд от старта'], ['score', 'Счёт'], ['session', 'Сессия'],
  ];

  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  };
  const write = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* хранилище недоступно */ }
  };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = n => String(n).padStart(2, '0');
  const clock = sec => `${pad(Math.floor(sec / 60))}:${pad(sec % 60)}`;
  const stamp = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

  // --- Есть ли рядом server.py, который пишет в файл
  let server = false;
  const ready = location.protocol.startsWith('http')
    ? fetch('api/ping', { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : null))
      .then(j => { server = !!(j && j.ok); })
      .catch(() => {})
    : Promise.resolve();
  let queue = ready;

  // --- Участник у компьютера: имя и код общие для всех уровней
  function participant() {
    return read(PARTICIPANT_KEY, null);
  }
  function startParticipant(name) {
    const current = participant();
    const p = current && current.name === name
      ? current
      : { name, code: Math.random().toString(36).slice(2, 6).toUpperCase() };
    write(PARTICIPANT_KEY, p);
    return p;
  }
  const displayName = p => (p && p.name) || `Без имени (${p ? p.code : '????'})`;

  function nextParticipant() {
    try {
      [...PROGRESS_KEYS, PARTICIPANT_KEY].forEach(k => localStorage.removeItem(k));
    } catch { /* хранилище недоступно */ }
    location.href = 'index.html';
  }

  // --- Запись события
  function record({ level, session, name, event, bug = '', severity = '', points = 0, elapsed = 0, score = 0 }) {
    const row = {
      at: stamp(new Date()), name, level, event, bug, severity, points,
      clock: clock(elapsed), elapsed, score, session,
    };
    const rows = read(ROWS_KEY, []);
    rows.push(row);
    write(ROWS_KEY, rows);
    // события уходят по очереди, чтобы в файле они шли в том же порядке
    queue = queue.then(() => (server
      ? fetch('api/stats', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(row), keepalive: true,
      }).catch(() => {})
      : null));
  }

  async function loadRows() {
    await ready;
    if (server) {
      try { return { fromFile: true, rows: await fetch('api/stats', { cache: 'no-store' }).then(r => r.json()) }; } catch { /* читаем из браузера */ }
    }
    return { fromFile: false, rows: read(ROWS_KEY, []) };
  }

  function toSessions(rows) {
    const map = new Map();
    for (const r of rows) {
      if (!map.has(r.session)) {
        map.set(r.session, {
          name: r.name, level: String(r.level), startedAt: r.at, finished: false,
          duration: 0, score: 0, total: 0, misses: 0, hints: 0, caught: [],
        });
      }
      const s = map.get(r.session);
      const t = Number(r.elapsed) || 0;
      s.name = r.name || s.name;
      s.score = Number(r.score) || 0;
      s.duration = Math.max(s.duration, t);
      if (r.event === 'Баг пойман') s.caught.push({ bug: r.bug, points: Number(r.points) || 0, t });
      if (r.event === 'Ложная тревога') s.misses++;
      if (r.event === 'Подсказка') s.hints++;
      if (r.event === 'Финиш') s.finished = true;
    }
    return [...map.values()];
  }

  // --- Окно статистики
  let dlg;
  let lastRows = [];

  function ensureDialog() {
    if (dlg) return dlg;
    dlg = document.createElement('dialog');
    dlg.className = 'dlg dlg-wide';
    dlg.setAttribute('aria-labelledby', 'statsTitle');
    dlg.innerHTML = `
      <div class="dlg-body">
        <div class="dlg-head">
          <h2 class="dlg-title dlg-title-sm" id="statsTitle">Статистика участников</h2>
          <button class="dlg-close" type="button" data-stats-close aria-label="Закрыть">×</button>
        </div>
        <p class="note" data-stats-source></p>
        <div data-stats-board></div>
        <div class="dlg-row">
          <button class="dlg-cta" type="button" data-stats-download>Скачать CSV</button>
          <button class="dlg-ghost" type="button" data-stats-clear hidden>Очистить статистику браузера</button>
        </div>
      </div>`;
    document.body.appendChild(dlg);
    dlg.addEventListener('click', e => {
      if (e.target === dlg || e.target.closest('[data-stats-close]')) dlg.close();
      if (e.target.closest('[data-stats-download]')) downloadCsv(lastRows);
      if (e.target.closest('[data-stats-clear]') && confirm('Удалить статистику всех участников из этого браузера?')) {
        write(ROWS_KEY, []);
        openStats();
      }
    });
    return dlg;
  }

  function boardHTML(sessions) {
    return `
      <div class="board-head"><span>#</span><span>Участник</span><span>Найдено</span><span>Счёт</span><span>Время</span></div>
      <div class="board">${sessions.map((s, i) => `
        <details>
          <summary>
            <span class="place">${i + 1}</span>
            <span class="who">${esc(s.name)}<small>${esc(s.startedAt)}</small></span>
            <span class="found">${s.caught.length} ${s.caught.length === 1 ? 'баг' : s.caught.length > 1 && s.caught.length < 5 ? 'бага' : 'багов'}</span>
            <span class="pts">${s.score}</span>
            <span class="time">${clock(s.duration)}${s.finished ? '' : ' …'}</span>
          </summary>
          <ol>${s.caught.length
            ? [...s.caught].sort((a, b) => a.t - b.t).map(c =>
              `<li><span class="t">${clock(c.t)}</span>${esc(c.bug)} (+${c.points})</li>`).join('')
            : '<li>Пока ни одного бага</li>'}</ol>
        </details>`).join('')}
      </div>`;
  }

  async function openStats() {
    const d = ensureDialog();
    const { fromFile, rows } = await loadRows();
    lastRows = rows;
    d.querySelector('[data-stats-source]').textContent = fromFile
      ? 'Каждое событие сразу записывается в файл stats/statistics.csv в папке проекта.'
      : 'Сайт открыт без server.py, поэтому статистика хранится только в этом браузере. Сохрани её кнопкой «Скачать CSV».';
    d.querySelector('[data-stats-clear]').hidden = fromFile;

    const sessions = toSessions(rows)
      .sort((a, b) => b.score - a.score || b.caught.length - a.caught.length || a.duration - b.duration);
    const levels = [...new Set(sessions.map(s => s.level))].sort();
    d.querySelector('[data-stats-board]').innerHTML = levels.length
      ? levels.map(l => `<h3 class="board-level">Уровень ${esc(l)}</h3>${boardHTML(sessions.filter(s => s.level === l))}`).join('')
      : '<p class="board-empty">Пока никто не играл.</p>';
    if (!d.open) d.showModal();
  }

  function downloadCsv(rows) {
    const cell = v => {
      let s = String(v ?? '');
      if (/^[=+\-@]/.test(s) && Number.isNaN(Number(s))) s = `'${s}`; // Excel не исполнит формулу
      return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [COLUMNS.map(([, title]) => title), ...rows.map(r => COLUMNS.map(([key]) => r[key]))];
    const csv = '﻿' + lines.map(l => l.map(cell).join(';')).join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = `korzh-statistics-${stamp(new Date()).slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  document.addEventListener('click', e => {
    if (e.target.closest('[data-open-stats]')) openStats();
  });

  return { participant, startParticipant, displayName, nextParticipant, record, openStats };
})();
