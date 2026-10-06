(() => {
  'use strict';

  /* =====================================================================
     Уровень 3: список багов. Здесь же — ответы для ведущего.
     Баги простые и наглядные: их видно глазами или после одного действия.
     ===================================================================== */
  const SEVERITY = {
    1: { name: 'Косметический', pts: 10 },
    2: { name: 'Незначительный', pts: 20 },
    3: { name: 'Серьёзный', pts: 30 },
    4: { name: 'Критический', pts: 50 },
  };

  const BUGS = [
    { id: 'weather', sev: 1, type: 'Контент', area: 'Первый экран',
      title: 'Жара и снег одновременно',
      hint: 'Посмотри на прогноз погоды на первом экране. Так бывает?',
      steps: 'Открыть страницу и посмотреть на виджет погоды.',
      expected: 'Погода без противоречий: например, +35° и солнце.',
      actual: '+35° и «Сегодня снег».' },
    { id: 'hours-text', sev: 1, type: 'Текст', area: 'Первый экран',
      title: 'Каждый день, но с выходным',
      hint: 'Прочитай часы работы парка до конца.',
      steps: 'Посмотреть на виджет с часами работы.',
      expected: 'Либо «каждый день», либо «выходной — понедельник».',
      actual: 'Написано «Каждый день. Выходной — понедельник».' },
    { id: 'firework-countdown', sev: 2, type: 'Логика', area: 'Первый экран',
      title: 'Обратный отсчёт идёт вперёд',
      hint: 'Последи несколько секунд за таймером до фейерверка.',
      steps: 'Открыть страницу и подождать 5 секунд, глядя на таймер «До фейерверка».',
      expected: 'Время до фейерверка уменьшается.',
      actual: 'Время увеличивается: фейерверк всё дальше.' },
    { id: 'loader-overflow', sev: 2, type: 'Интерфейс', area: 'Карта парка',
      title: 'Загрузка больше 100%',
      hint: 'Дождись, пока загрузится карта парка. Сколько процентов получилось?',
      steps: 'Открыть страницу и дождаться загрузки карты парка.',
      expected: 'Загрузка останавливается на 100%.',
      actual: 'Загрузка доходит до 147%, полоска вылезает за рамку.' },
    { id: 'qr-map', sev: 2, type: 'QR-код', area: 'Карта парка',
      title: 'QR-код карты ведёт на Луну',
      hint: 'Отсканируй QR-код рядом с картой парка камерой телефона.',
      steps: 'Отсканировать телефоном QR-код в блоке «Карта парка».',
      expected: 'Открывается карта парка «Вираж».',
      actual: 'Открывается статья в Википедии про Луну.' },
    { id: 'queue-bar', sev: 1, type: 'Интерфейс', area: 'Аттракционы',
      title: 'Полоска очереди врёт',
      hint: 'Сравни подпись над полоской очереди с самой полоской.',
      steps: 'Посмотреть на очередь у аттракциона «Мёртвая петля».',
      expected: 'Пройдено 80% — полоска заполнена на 80%.',
      actual: 'Написано 80%, а полоска заполнена примерно на пятую часть.' },
    { id: 'age-string', sev: 3, type: 'Логика', area: 'Аттракционы',
      title: 'На «Мёртвую петлю» пускают девятилетних',
      hint: 'Проверь возраст для «Мёртвой петли» с разными числами: 9, 10, 15, 100.',
      steps: 'У «Мёртвой петли» ввести возраст 9 и нажать «Проверить».',
      expected: '«Пока рано» — аттракцион с 14 лет.',
      actual: '«Проходи!» А 10-летнего и 100-летнего не пускают: числа сравниваются как слова.' },
    { id: 'age-absurd', sev: 2, type: 'Валидация', area: 'Аттракционы',
      title: 'На карусель пускают тех, кому −5 лет',
      hint: 'Карусель для детей от 3 до 10 лет. А если ввести очень маленький возраст?',
      steps: 'У «Пони-карусели» ввести возраст −5 или 1 и нажать «Проверить».',
      expected: 'Отказ: карусель для детей от 3 лет, а возраст не может быть отрицательным.',
      actual: '«Садись на пони!»' },
    { id: 'seats-increase', sev: 3, type: 'Логика', area: 'Аттракционы',
      title: 'После брони кабинок становится больше',
      hint: 'Забронируй кабинку на колесе обозрения и следи за числом свободных.',
      steps: 'У «Колеса обозрения» выбрать 2 кабинки и нажать «Забронировать».',
      expected: 'Свободных кабинок становится на 2 меньше: 12 → 10.',
      actual: 'Свободных кабинок становится больше: 12 → 14.' },
    { id: 'gallery-arrows', sev: 1, type: 'Интерфейс', area: 'Фото из парка',
      title: 'Стрелка «вперёд» листает назад',
      hint: 'Полистай фотографии стрелками и следи за номером фото.',
      steps: 'В галерее нажать стрелку →.',
      expected: 'Открывается следующее фото: 1 / 5 → 2 / 5.',
      actual: 'Открывается предыдущее фото: 1 / 5 → 5 / 5.' },
    { id: 'like-decrease', sev: 1, type: 'Логика', area: 'Фото из парка',
      title: 'Лайк уменьшает счётчик',
      hint: 'Поставь лайк фотографии.',
      steps: 'В галерее нажать на сердечко.',
      expected: 'Лайков становится больше: 128 → 129.',
      actual: 'Лайков становится меньше: 128 → 127.' },
    { id: 'confirm-swap', sev: 3, type: 'Логика', area: 'Билеты',
      title: '«Нет» покупает билет, а «Да» отменяет',
      hint: 'Начни покупать билет и в окне подтверждения нажми «Нет».',
      steps: 'Нажать «Купить билет», в окне подтверждения нажать «Нет».',
      expected: 'Покупка отменяется.',
      actual: 'Билет куплен. А кнопка «Да», наоборот, отменяет покупку.' },
    { id: 'qr-ticket', sev: 3, type: 'QR-код', area: 'Билеты',
      title: 'QR-код билета ведёт на картошку',
      hint: 'Купи билет и отсканируй его QR-код камерой телефона.',
      steps: 'Купить билет и отсканировать телефоном QR-код в блоке «Мои билеты».',
      expected: 'Открывается электронный билет.',
      actual: 'Открывается статья в Википедии про картофель.' },
    { id: 'balance-topup', sev: 4, type: 'Логика', area: 'Браслет',
      title: 'Пополнение уменьшает баланс',
      hint: 'Пополни браслет и посмотри, сколько на нём стало денег.',
      steps: 'В блоке «Браслет посетителя» нажать «500 ₽».',
      expected: 'Баланс 300 + 500 = 800 ₽.',
      actual: 'Баланс 300 − 500 = −200 ₽, хотя написано «Браслет пополнен».' },
    { id: 'ad-close-run', sev: 3, type: 'Интерфейс', area: 'Реклама',
      title: 'Крестик рекламы убегает',
      hint: 'Через несколько секунд после старта появится реклама. Попробуй её закрыть.',
      steps: 'Дождаться рекламы сладкой ваты и навести курсор на крестик.',
      expected: 'Реклама закрывается крестиком.',
      actual: 'Крестик перепрыгивает в другой угол, закрыть рекламу невозможно.' },
    { id: 'theme-header', sev: 2, type: 'Тема', area: 'Шапка сайта',
      title: 'В тёмной теме пропадает логотип',
      hint: 'Включи тёмную тему кнопкой с луной и посмотри на шапку сайта.',
      steps: 'Включить тёмную тему кнопкой 🌙 в шапке.',
      expected: 'Шапка становится тёмной, логотип и меню видны.',
      actual: 'Шапка осталась белой, белый логотип на ней исчез, меню еле видно.' },
    { id: 'fullscreen-gallery', sev: 2, type: 'Вёрстка', area: 'Фото из парка',
      title: '«Во весь экран» ломает галерею',
      hint: 'Открой фотографию во весь экран.',
      steps: 'В галерее нажать «Во весь экран».',
      expected: 'Фото аккуратно открывается на весь экран, его можно закрыть.',
      actual: 'Фото раздувается за края страницы и наезжает на кнопки галереи.' },
  ];

  const PENALTY = 5;
  const STORAGE_KEY = 'korzh-bughunt-l3-v1';
  const bugById = id => BUGS.find(b => b.id === id);
  const ptsOf = b => SEVERITY[b.sev].pts;
  const MAX_SCORE = BUGS.reduce((s, b) => s + ptsOf(b), 0);

  const $ = sel => document.querySelector(sel);
  const rub = n => `${n < 0 ? '−' : ''}${Math.abs(n).toLocaleString('ru-RU')} ₽`;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* =====================================================================
     Сайт парка «Вираж» — с багами внутри
     ===================================================================== */
  const armed = new Set(['weather', 'hours-text', 'queue-bar', 'qr-map']);
  const arm = id => armed.add(id);

  // --- Таймер до фейерверка
  let fwLeft = 15 * 60;
  const hms = s => [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map(n => String(n).padStart(2, '0')).join(':');
  setInterval(() => {
    fwLeft++; // баг: обратный отсчёт должен уменьшаться
    $('#fwTimer').textContent = hms(fwLeft);
    arm('firework-countdown');
  }, 1000);

  // --- Загрузка карты парка
  let mapStarted = false;
  function startMapLoading() {
    if (mapStarted) return;
    mapStarted = true;
    let p = 0;
    const timer = setInterval(() => {
      p += p < 90 ? 6 : 3;
      const limit = 147; // баг: загрузка не останавливается на 100%
      if (p >= limit) { p = limit; clearInterval(timer); $('#mapStatus').textContent = 'Карта загружена'; }
      if (p > 100) arm('loader-overflow');
      $('#mapBar').style.width = `${p}%`;
      $('#mapNum').textContent = `${p}%`;
    }, 220);
  }

  // --- Проверка возраста
  document.querySelectorAll('.age-check').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const raw = form.querySelector('input').value.trim();
      const out = form.nextElementSibling;
      if (raw === '') { out.textContent = 'Введи возраст'; out.className = 'age-result no'; return; }
      const age = Number(raw);
      let ok;
      if (form.dataset.ride === 'loop') {
        ok = raw >= '14'; // баг: строки сравниваются по буквам, а не как числа
        if (ok !== (age >= 14)) arm('age-string');
        out.textContent = ok ? 'Проходи! Пристегнись покрепче 🎢' : 'Пока рано: «Мёртвая петля» — с 14 лет';
      } else {
        ok = age <= 10; // баг: нет нижней границы «от 3 лет» и проверки на отрицательный возраст
        if (ok && age < 3) arm('age-absurd');
        out.textContent = ok ? 'Садись на пони! 🎠' : 'Карусель для детей до 10 лет';
      }
      out.className = `age-result ${ok ? 'ok' : 'no'}`;
    });
  });

  // --- Колесо обозрения
  let seatsFree = 12;
  $('#bookForm').addEventListener('submit', e => {
    e.preventDefault();
    const qty = Number($('#seatsQty').value);
    seatsFree += qty; // баг: свободных кабинок должно стать меньше
    arm('seats-increase');
    $('#seatsFree').textContent = seatsFree;
    $('#bookMsg').textContent = `Забронировано: ${qty} ${qty === 1 ? 'кабинка' : 'кабинки'}`;
    $('#bookMsg').className = 'age-result ok';
  });

  // --- Галерея
  const SLIDES = [
    { e: '🎢', t: '«Мёртвая петля» ночью', bg: '#2a2350' },
    { e: '🎡', t: 'Колесо обозрения на закате', bg: '#c4532f' },
    { e: '🎠', t: 'Пони-карусель', bg: '#2e7d4f' },
    { e: '🍭', t: 'Самая большая сладкая вата', bg: '#c2417a' },
    { e: '🎆', t: 'Фейерверк в субботу', bg: '#1b2a4a' },
  ];
  let slide = 0;
  function renderSlide() {
    const s = SLIDES[slide];
    $('#slide').style.background = s.bg;
    $('#slide').innerHTML = `<div><div class="slide-art" aria-hidden="true">${s.e}</div><p class="slide-caption">${s.t}</p></div>`;
    $('#gCount').textContent = `${slide + 1} / ${SLIDES.length}`;
  }
  $('#gPrev').addEventListener('click', () => { slide = (slide - 1 + SLIDES.length) % SLIDES.length; renderSlide(); });
  $('#gNext').addEventListener('click', () => {
    slide = (slide - 1 + SLIDES.length) % SLIDES.length; // баг: «вперёд» листает назад
    arm('gallery-arrows');
    renderSlide();
  });
  let likes = 128;
  $('#like').addEventListener('click', () => {
    const on = $('#like').getAttribute('aria-pressed') !== 'true';
    likes += on ? -1 : 1; // баг: лайк уменьшает счётчик
    arm('like-decrease');
    $('#like').setAttribute('aria-pressed', String(on));
    $('#likeN').textContent = likes;
  });

  // --- Покупка билета
  const confirmBox = $('#confirm');
  $('#buyBtn').addEventListener('click', () => {
    $('#confirmAsk').hidden = false;
    $('#confirmDone').hidden = true;
    confirmBox.hidden = false;
    confirmBox.querySelector('[data-answer="yes"]').focus();
  });
  confirmBox.addEventListener('click', e => {
    const answer = e.target.closest('[data-answer]')?.dataset.answer;
    if (!answer) return;
    if (answer === 'close') { confirmBox.hidden = true; return; }
    const bought = answer === 'no'; // баг: кнопки перепутаны
    arm('confirm-swap');
    if (bought) {
      $('#ticket').hidden = false;
      $('#noTickets').hidden = true;
      arm('qr-ticket');
    }
    $('#confirmResult').textContent = bought ? 'Готово! Билет куплен 🎟' : 'Покупка отменена';
    $('#confirmAsk').hidden = true;
    $('#confirmDone').hidden = false;
  });

  // --- Браслет
  let balance = 300;
  $('#topup').addEventListener('click', e => {
    const b = e.target.closest('[data-sum]');
    if (!b) return;
    const sum = Number(b.dataset.sum);
    balance -= sum; // баг: при пополнении деньги списываются
    arm('balance-topup');
    $('#balance').textContent = rub(balance);
    $('#bandMsg').textContent = `Браслет пополнен на ${rub(sum)}`;
  });

  // --- Реклама с убегающим крестиком
  const ad = $('#ad');
  const adClose = $('#adClose');
  let adPos = 0;
  let adEscapes = 0;
  let adShown = false;
  function showAdLater() {
    if (adShown) return;
    adShown = true;
    setTimeout(() => { ad.hidden = false; }, 4000);
  }
  adClose.addEventListener('pointerenter', () => {
    if (isCaught('ad-close-run')) return; // пойманный баг больше не мешает
    if (hunting && adEscapes >= 3) return; // в режиме охоты крестик устаёт после трёх побегов
    if (hunting) adEscapes++;
    arm('ad-close-run');
    adClose.classList.remove(`pos-${adPos}`);
    adPos = (adPos + 1 + Math.floor(Math.random() * 3)) % 4;
    if (adPos) adClose.classList.add(`pos-${adPos}`);
  });
  adClose.addEventListener('click', () => { ad.hidden = true; });

  function startShow() {
    startMapLoading();
    showAdLater();
  }

  // --- Галерея во весь экран
  $('#gFull').addEventListener('click', e => {
    const on = !$('.gallery').classList.contains('is-full');
    $('.gallery').classList.toggle('is-full', on); // баг: фото раздувается за края страницы
    if (on) arm('fullscreen-gallery');
    e.currentTarget.setAttribute('aria-pressed', String(on));
    e.currentTarget.textContent = on ? 'Свернуть' : 'Во весь экран';
  });

  // --- Тема: баг виден, когда включена тёмная тема (theme.js)
  document.addEventListener('themechange', e => { if (e.detail === 'dark') arm('theme-header'); });
  if (document.documentElement.dataset.theme === 'dark') arm('theme-header');

  $('#year').textContent = new Date().getFullYear();
  renderSlide();

  /* =====================================================================
     Игровой слой: режим охоты, очки, журнал, статистика
     ===================================================================== */
  const newId = () => Math.random().toString(36).slice(2, 10);
  const fresh = () => ({
    sessionId: newId(), participant: null, caught: [], misses: 0, hints: 0, hinted: [],
    startedAt: null, finishedAt: null, missNoteShown: false,
  });
  let state = load() || fresh();
  // прогресс, сохранённый старой версией сайта, получает участника для статистики
  if (state.startedAt && !state.participant) { state.participant = BugStats.startParticipant(state.name || ''); save(); }

  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return s && Array.isArray(s.caught) && s.sessionId ? { ...fresh(), ...s } : null;
    } catch { return null; }
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* хранилище недоступно */ }
  }

  const isCaught = id => state.caught.some(c => c.id === id);
  const displayName = () => BugStats.displayName(state.participant);
  const score = () => Math.max(0,
    state.caught.reduce((s, c) => s + ptsOf(bugById(c.id)), 0) - PENALTY * (state.misses + state.hints));

  function elapsed() {
    if (!state.startedAt) return 0;
    return Math.floor(((state.finishedAt || Date.now()) - state.startedAt) / 1000);
  }
  const clock = sec => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

  // запись в статистику участников (stats.js)
  function record(event, bug = null, points = 0, extra = '') {
    BugStats.record({
      level: 3, session: state.sessionId, name: displayName(), event,
      bug: bug ? bug.title : extra, severity: bug ? SEVERITY[bug.sev].name : '',
      points, elapsed: elapsed(), score: score(),
    });
  }

  // --- Нижняя панель
  const slots = $('#slots');
  slots.innerHTML = BUGS.map(() => '<span class="slot"></span>').join('');
  $('#totalN').textContent = BUGS.length;

  function updateDock() {
    [...slots.children].forEach((el, i) => el.classList.toggle('on', i < state.caught.length));
    $('#caughtN').textContent = state.caught.length;
    $('#score').textContent = score();
  }
  setInterval(() => { $('#timer').textContent = clock(elapsed()); }, 1000);

  const dock = $('#dock');
  new ResizeObserver(() => {
    document.documentElement.style.setProperty('--dock-h', `${dock.offsetHeight}px`);
  }).observe(dock);

  // --- Режим охоты
  let hunting = false;
  const huntBtn = $('#huntBtn');
  function setHunt(on) {
    hunting = on;
    if (on) adEscapes = 0;
    document.body.classList.toggle('hunting', on);
    huntBtn.setAttribute('aria-pressed', String(on));
    $('#huntHint').textContent = on ? 'Нажми на баг, чтобы поймать' : 'Выключен, клавиша Ф';
  }
  huntBtn.addEventListener('click', () => setHunt(!hunting));

  const anyDialogOpen = () => !!document.querySelector('dialog[open]');
  document.addEventListener('keydown', e => {
    if (anyDialogOpen()) return;
    const typing = e.target.closest?.('input, textarea, select, [contenteditable]');
    if (e.code === 'KeyA' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      setHunt(!hunting);
    }
    if (e.key === 'Escape' && hunting) setHunt(false);
  });

  const root = document.documentElement;
  let raf = 0;
  document.addEventListener('pointermove', e => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      root.style.setProperty('--x', `${e.clientX}px`);
      root.style.setProperty('--y', `${e.clientY}px`);
    });
  }, { passive: true });

  const inSite = t => t instanceof Element && t.closest('#site');
  ['pointerdown', 'mousedown'].forEach(type => {
    document.addEventListener(type, e => { if (hunting && inSite(e.target)) e.preventDefault(); }, true);
  });
  document.addEventListener('click', e => {
    if (!hunting || !inSite(e.target)) return;
    e.preventDefault();
    e.stopPropagation();
    let { pageX: x, pageY: y } = e;
    if (e.detail === 0) {
      const r = e.target.getBoundingClientRect();
      x = r.left + r.width / 2 + scrollX;
      y = r.top + r.height / 2 + scrollY;
    }
    attempt(e.target, x, y);
  }, true);

  function attempt(target, x, y) {
    if (!state.startedAt) return;
    const id = target.closest('[data-bug]')?.dataset.bug;

    if (id && isCaught(id)) {
      floatText(x, y, 'Уже в журнале', 'muted');
      return;
    }
    if (!id || !armed.has(id)) {
      state.misses++;
      save();
      updateDock();
      record('Ложная тревога', null, -PENALTY);
      floatText(x, y, `−${PENALTY}<small>ложная тревога</small>`, 'miss');
      if (!state.missNoteShown) {
        state.missNoteShown = true;
        save();
        showPop(`
          <p class="kicker">Ложная тревога, −${PENALTY} баллов</p>
          <h3>Сейчас здесь всё работает правильно</h3>
          <p class="pop-text">Выключи режим охоты и сначала воспроизведи баг: нажми, введи, подожди. Тестировщик сообщает только о том, что смог повторить.</p>`);
      }
      return;
    }

    const bug = bugById(id);
    state.caught.push({ id, t: elapsed() });
    save();
    updateDock();
    record('Баг пойман', bug, ptsOf(bug));
    floatText(x, y, `+${ptsOf(bug)}`, 'hit');
    addPin(x, y);
    showPop(`
      <div class="pop-top">
        <span class="pop-pts">+${ptsOf(bug)}</span>
        <span class="chip sev-${bug.sev}">${SEVERITY[bug.sev].name}</span>
        <span class="chip chip-type">${bug.type}</span>
      </div>
      <h3>${bug.title}</h3>
      <p class="kicker">Так этот баг описал бы тестировщик:</p>
      ${reportHTML(bug)}`);

    if (state.caught.length === BUGS.length) setTimeout(openFinish, 1400);
  }

  function reportHTML(bug) {
    return `<dl class="report">
      <div><dt>Шаги</dt><dd>${bug.steps}</dd></div>
      <div><dt>Ожидалось</dt><dd>${bug.expected}</dd></div>
      <div><dt>На самом деле</dt><dd>${bug.actual}</dd></div>
    </dl>`;
  }

  function floatText(x, y, html, kind) {
    const el = document.createElement('div');
    el.className = `float ${kind}`;
    el.innerHTML = html;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
    setTimeout(() => el.remove(), 2000);
  }

  function addPin(x, y) {
    const pin = document.createElement('span');
    pin.className = 'pin';
    pin.textContent = '🐞';
    pin.style.left = `${x}px`;
    pin.style.top = `${y}px`;
    $('#pins').appendChild(pin);
  }

  const pop = $('#pop');
  function showPop(html) {
    pop.innerHTML = `${html}<div class="pop-actions"><button class="dock-btn dock-btn-light" type="button" data-close-pop>Понятно</button></div>`;
    pop.hidden = false;
    pop.style.animation = 'none';
    void pop.offsetWidth;
    pop.style.animation = '';
  }
  pop.addEventListener('click', e => {
    if (e.target.closest('[data-close-pop]')) pop.hidden = true;
  });

  // --- Подсказка
  $('#hintBtn').addEventListener('click', () => {
    if (!state.startedAt) return;
    const left = BUGS.filter(b => !isCaught(b.id));
    if (!left.length) return;
    const unseen = left.filter(b => !state.hinted.includes(b.id));
    const pool = unseen.length ? unseen : left;
    const bug = pool[Math.floor(Math.random() * pool.length)];
    state.hints++;
    if (!state.hinted.includes(bug.id)) state.hinted.push(bug.id);
    save();
    updateDock();
    record('Подсказка', null, -PENALTY);
    showPop(`
      <p class="kicker">Подсказка, −${PENALTY} баллов</p>
      <h3>Где искать: ${bug.area.toLowerCase()}</h3>
      <p class="pop-text">${bug.hint}</p>`);
  });

  // --- Журнал
  const logDlg = $('#logDlg');
  $('#logBtn').addEventListener('click', () => {
    $('#logList').innerHTML = state.caught.length
      ? state.caught.map(c => logItemHTML(bugById(c.id), c.t)).join('')
      : '<p class="log-empty">Журнал пуст. Включи режим охоты и поймай первый баг.</p>';
    logDlg.showModal();
  });

  function logItemHTML(bug, t) {
    return `<article class="log-item">
      <div class="pop-top">
        <span class="chip sev-${bug.sev}">${SEVERITY[bug.sev].name}, +${ptsOf(bug)}</span>
        <span class="chip chip-type">${bug.type}</span>
        ${t != null ? `<span class="chip chip-type">найден на ${clock(t)}</span>` : ''}
      </div>
      <h3>${bug.title}</h3>
      ${reportHTML(bug)}
    </article>`;
  }

  document.querySelectorAll('[data-close]').forEach(btn =>
    btn.addEventListener('click', () => btn.closest('dialog').close()));
  document.querySelectorAll('dialog').forEach(d =>
    d.addEventListener('click', e => { if (e.target === d && d.id !== 'introDlg') d.close(); }));

  // --- Финиш
  const finishDlg = $('#finishDlg');
  $('#finishBtn').addEventListener('click', openFinish);

  function rank(s) {
    if (state.caught.length === BUGS.length) return 'Главный охотник на баги';
    const r = s / MAX_SCORE;
    if (r >= 0.75) return 'Сеньор-тестировщик';
    if (r >= 0.5) return 'Мидл-тестировщик';
    if (r >= 0.25) return 'Джуниор-тестировщик';
    return 'Стажёр-тестировщик';
  }

  function openFinish() {
    if (!state.startedAt || anyDialogOpen()) return;
    setHunt(false);
    if (!state.finishedAt) {
      state.finishedAt = Date.now();
      save();
      record('Финиш', null, 0, `Найдено ${state.caught.length} из ${BUGS.length}`);
    }
    const s = score();
    const missed = BUGS.filter(b => !isCaught(b.id));
    const shots = state.caught.length + state.misses;
    const accuracy = shots ? Math.round(state.caught.length / shots * 100) : 0;
    $('#finishBody').innerHTML = `
      <div class="dlg-head">
        <p>${esc(displayName())}, твой результат</p>
        <button class="dlg-close" type="button" data-resume aria-label="Закрыть">×</button>
      </div>
      <p class="result-score">${s}</p>
      <p class="rank">${rank(s)}</p>
      <div class="stats">
        <div><b>${state.caught.length} из ${BUGS.length}</b><span>багов поймано</span></div>
        <div><b>${clock(elapsed())}</b><span>время</span></div>
        <div><b>${accuracy}%</b><span>точность</span></div>
        <div><b>${state.hints}</b><span>подсказок</span></div>
      </div>
      ${missed.length ? `
        <details class="missed">
          <summary>Показать ненайденные баги (${missed.length})</summary>
          ${missed.map(b => logItemHTML(b)).join('')}
        </details>` : '<p>Все баги найдены. Парк «Вираж» теперь можно чинить!</p>'}
      <div class="dlg-row">
        ${missed.length ? '<button class="dlg-cta" type="button" data-resume>Вернуться к охоте</button>' : ''}
        <button class="dlg-ghost" type="button" data-open-stats>Статистика участников</button>
        <button class="dlg-ghost" type="button" data-next>Следующий участник</button>
      </div>`;
    finishDlg.showModal();
  }

  finishDlg.addEventListener('click', e => {
    if (e.target.closest('[data-resume]')) finishDlg.close();
    if (e.target.closest('[data-next]')
      && confirm(`Результат «${displayName()}» сохранён. Передать компьютер следующему участнику?`)) {
      BugStats.nextParticipant();
    }
  });
  finishDlg.addEventListener('close', () => {
    // пока пойманы не все баги, охота продолжается, время идёт от общего старта
    if (state.caught.length < BUGS.length) { state.finishedAt = null; save(); }
  });

  // --- Старт
  const introDlg = $('#introDlg');
  introDlg.addEventListener('cancel', e => e.preventDefault());
  $('#nameInput').value = BugStats.participant()?.name || '';
  $('#introForm').addEventListener('submit', () => {
    state.participant = BugStats.startParticipant($('#nameInput').value.trim());
    state.startedAt = Date.now();
    save();
    record('Старт');
    startShow();
  });

  updateDock();
  $('#timer').textContent = clock(elapsed());
  if (!state.startedAt) introDlg.showModal();
  else startShow();
})();
