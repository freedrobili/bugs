(() => {
  'use strict';

  /* =====================================================================
     Уровень 4: список багов. Здесь же — ответы для ведущего.
     Приложение видно только в режиме телефона (режим разработчика,
     эмуляция устройства). Часть багов зависит от размера и поворота экрана.
     ===================================================================== */
  const SEVERITY = {
    1: { name: 'Косметический', pts: 10 },
    2: { name: 'Незначительный', pts: 20 },
    3: { name: 'Серьёзный', pts: 30 },
    4: { name: 'Критический', pts: 50 },
  };

  const BUGS = [
    { id: 'h-scroll', sev: 2, type: 'Вёрстка', area: 'Меню',
      title: 'Экран съезжает вбок',
      hint: 'Посмотри на красный рекламный баннер и попробуй сдвинуть экран пальцем вбок.',
      steps: 'Открыть приложение в режиме телефона и посмотреть на баннер «Две пиццы по цене одной».',
      expected: 'Баннер помещается в ширину экрана.',
      actual: 'Баннер шире экрана и обрезан справа, весь экран можно сдвинуть вбок.' },
    { id: 'name-overlap', sev: 1, type: 'Вёрстка', area: 'Меню',
      title: 'Длинное название налезает на цену',
      hint: 'Найди пиццу с самым длинным названием.',
      steps: 'Найти в списке «Четыре сыра с трюфельным маслом».',
      expected: 'Название переносится на вторую строку или обрезается многоточием.',
      actual: 'Название налезает на цену и кнопку «+».' },
    { id: 'small-screen', sev: 3, type: 'Адаптивность', area: 'Меню',
      title: 'На маленьком телефоне кнопки уезжают',
      hint: 'Выбери в режиме разработчика телефон поменьше, например iPhone SE.',
      steps: 'В режиме устройства выбрать iPhone SE (ширина 375) и посмотреть на список пицц.',
      expected: 'Цены и кнопки «+» видны полностью.',
      actual: 'Кнопки «+» уезжают за правый край экрана.' },
    { id: 'back-wrong', sev: 2, type: 'Навигация', area: 'Карточка пиццы',
      title: 'Стрелка «назад» ведёт в профиль',
      hint: 'Открой любую пиццу и вернись назад стрелкой в заголовке.',
      steps: 'Нажать на пиццу в списке, затем на стрелку ← в заголовке.',
      expected: 'Возврат к списку пицц.',
      actual: 'Открывается профиль.' },
    { id: 'tab-wrong', sev: 3, type: 'Навигация', area: 'Нижнее меню',
      title: 'Вкладка «Корзина» открывает профиль',
      hint: 'Понажимай все вкладки нижнего меню.',
      steps: 'Нажать «Корзина» в нижнем меню.',
      expected: 'Открывается корзина.',
      actual: 'Открывается профиль. В корзину можно попасть только через значок 🛒 в заголовке.' },
    { id: 'checkout-covered', sev: 3, type: 'Вёрстка', area: 'Корзина',
      title: 'Кнопка «Оформить» спряталась под меню',
      hint: 'Положи пиццу в корзину, открой её и посмотри на кнопку оформления.',
      steps: 'Добавить пиццу и открыть корзину через значок 🛒 в заголовке.',
      expected: 'Кнопка «Оформить заказ» видна целиком над нижним меню.',
      actual: 'Нижнее меню закрывает половину кнопки.' },
    { id: 'theme-app', sev: 2, type: 'Тема', area: 'Корзина',
      title: 'В тёмной теме не видно суммы',
      hint: 'Включи тёмную тему в профиле и загляни в корзину.',
      steps: 'В профиле включить «Тёмная тема», добавить пиццу и открыть корзину.',
      expected: 'Сумма заказа светлая и хорошо видна.',
      actual: 'Сумма тёмная на тёмном фоне, её не видно.' },
    { id: 'tracker-steps', sev: 2, type: 'Логика', area: 'Заказ',
      title: '«Доставлено» раньше, чем «В пути»',
      hint: 'Оформи заказ и посмотри на этапы доставки.',
      steps: 'Оформить заказ и посмотреть на вкладку «Заказ».',
      expected: 'Отмечены только пройденные этапы: «Принят» и «Готовим».',
      actual: 'Отмечено и «Доставлено», хотя курьер ещё не выехал.' },
    { id: 'stars-reversed', sev: 2, type: 'Интерфейс', area: 'Заказ',
      title: 'Звёзды оценки работают наоборот',
      hint: 'Поставь доставке пять звёзд.',
      steps: 'После заказа нажать на пятую звезду в блоке «Оцени доставку».',
      expected: 'Оценка 5 из 5.',
      actual: 'Оценка 1 из 5: звёзды считаются справа налево.' },
    { id: 'notif-toggle', sev: 2, type: 'Логика', area: 'Профиль',
      title: 'Переключатель уведомлений врёт',
      hint: 'Включи уведомления в профиле и прочитай подпись под ними.',
      steps: 'В профиле включить «Уведомления».',
      expected: 'Подпись «Уведомления включены».',
      actual: 'Переключатель включён, а подпись — «Уведомления выключены».' },
    { id: 'big-text-break', sev: 2, type: 'Вёрстка', area: 'Профиль',
      title: '«Крупный текст» ломает приложение',
      hint: 'В профиле есть настройка для крупного текста. Включи её и походи по экранам.',
      steps: 'В профиле включить «Крупный текст».',
      expected: 'Текст становится крупнее, но всё помещается.',
      actual: 'Заголовки налезают друг на друга и вылезают за экран, подписи меню не помещаются.' },
    { id: 'landscape', sev: 3, type: 'Адаптивность', area: 'Нижнее меню',
      title: 'Если повернуть телефон, меню закрывает экран',
      hint: 'Поверни телефон: в режиме разработчика над страницей есть кнопка поворота экрана.',
      steps: 'В режиме устройства нажать кнопку поворота экрана.',
      expected: 'Нижнее меню остаётся тонкой полоской внизу.',
      actual: 'Нижнее меню растягивается на половину экрана и закрывает содержимое.' },
  ];

  const PENALTY = 5;
  const STORAGE_KEY = 'korzh-bughunt-l4-v1';
  const bugById = id => BUGS.find(b => b.id === id);
  const ptsOf = b => SEVERITY[b.sev].pts;
  const MAX_SCORE = BUGS.reduce((s, b) => s + ptsOf(b), 0);

  const $ = sel => document.querySelector(sel);
  const rub = n => `${n < 0 ? '−' : ''}${Math.abs(n).toLocaleString('ru-RU')} ₽`;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* =====================================================================
     Приложение «Корж» — с багами внутри
     ===================================================================== */
  const armed = new Set(['h-scroll', 'name-overlap']);
  const arm = id => armed.add(id);

  const SIZES = ['25 см', '30 см', '35 см'];
  const SIZE_DELTA = [-100, 0, 150];
  const PIZZAS = [
    { id: 'margherita', name: 'Маргарита', desc: 'Томаты, моцарелла, базилик', price: 490, tags: ['veg'], top: ['🍅', '🌿', '🍅', '🌿', '🍅'] },
    { id: 'pepperoni', name: 'Пепперони', desc: 'Пепперони, моцарелла', price: 550, tags: ['meat', 'hot'], top: ['🔴', '🔴', '🔴', '🔴', '🔴'] },
    { id: 'truffle', name: 'Четыре сыра с трюфельным маслом', desc: 'Четыре сыра и капля трюфеля', price: 690, tags: ['veg'], top: ['🧀', '🧀', '🧀', '🧀'] },
    { id: 'mushroom', name: 'Грибная', desc: 'Шампиньоны, сливочный соус', price: 520, tags: ['veg'], top: ['🍄', '🍄', '🍄', '🍄', '🍄'] },
    { id: 'hawaii', name: 'Гавайская', desc: 'Курица, ананас', price: 570, tags: ['meat'], top: ['🍍', '🍗', '🍍', '🍗', '🍍'] },
    { id: 'diablo', name: 'Дьябло', desc: 'Острая колбаска, халапеньо', price: 590, tags: ['meat', 'hot'], top: ['🌶️', '🔴', '🌶️', '🔴', '🌶️'] },
  ];
  const pizza = id => PIZZAS.find(p => p.id === id);
  const SPOTS = [[50, 27], [28, 46], [72, 44], [40, 70], [64, 70], [50, 50]];
  const pizzaHTML = p => `<div class="pizza">${p.top.map((t, i) =>
    `<span style="left:${SPOTS[i][0]}%;top:${SPOTS[i][1]}%">${t}</span>`).join('')}</div>`;
  const app = $('#app');
  const appVisible = () => getComputedStyle(app).display !== 'none';

  // --- Экраны
  const TITLES = { home: 'Корж', product: 'Пицца', cart: 'Корзина', order: 'Мой заказ', profile: 'Профиль' };
  let screen = 'home';
  function show(name) {
    screen = name;
    document.querySelectorAll('.screen').forEach(s => { s.hidden = s.dataset.screen !== name; });
    $('#appTitle').textContent = TITLES[name];
    $('#back').hidden = !(name === 'product' || name === 'cart');
    const tab = name === 'product' ? 'home' : name;
    document.querySelectorAll('[data-tab]').forEach(b => {
      if (b.dataset.tab === tab) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    if (name === 'cart' && cart.length) arm('checkout-covered');
    if (name === 'order' && order) arm('tracker-steps');
    scrollTo(0, 0);
  }

  $('#tabbar').addEventListener('click', e => {
    const b = e.target.closest('[data-tab]');
    if (!b) return;
    let target = b.dataset.tab;
    if (target === 'cart') { target = 'profile'; arm('tab-wrong'); } // баг: вкладка ведёт не туда
    show(target);
  });
  $('#back').addEventListener('click', () => {
    if (screen === 'product') { arm('back-wrong'); show('profile'); return; } // баг: «назад» ведёт в профиль
    show('home');
  });
  $('#cartIcon').addEventListener('click', () => show('cart'));

  // --- Меню
  let filter = 'all';
  function renderList() {
    const list = PIZZAS.filter(p => filter === 'all' || p.tags.includes(filter));
    $('#pList').innerHTML = list.map(p => `
      <li class="p-row" data-id="${p.id}" data-bug="small-screen">
        ${pizzaHTML(p)}
        <div>
          <p class="p-name"${p.id === 'truffle' ? ' data-bug="name-overlap"' : ''}>${p.name}</p>
          <p class="p-desc">${p.desc}</p>
        </div>
        <span class="p-price">${rub(p.price)}</span>
        <button class="p-add" type="button" aria-label="Добавить ${p.name}">+</button>
      </li>`).join('');
  }
  $('#chips').addEventListener('click', e => {
    const b = e.target.closest('[data-tag]');
    if (!b) return;
    filter = b.dataset.tag;
    document.querySelectorAll('#chips [data-tag]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    renderList();
  });
  $('#pList').addEventListener('click', e => {
    const row = e.target.closest('.p-row');
    if (!row) return;
    if (e.target.closest('.p-add')) addToCart(row.dataset.id, 1);
    else openProduct(row.dataset.id);
  });

  // --- Карточка пиццы
  let prodSize = 1;
  function openProduct(id) {
    const p = pizza(id);
    prodSize = 1;
    const render = () => {
      $('#product').innerHTML = `
        <div class="prod" data-id="${p.id}">
          ${pizzaHTML(p)}
          <h2>${p.name}</h2>
          <p class="muted">${p.desc}</p>
          <div class="sizes" role="group" aria-label="Размер">${SIZES.map((z, i) =>
            `<button type="button" data-size="${i}" aria-pressed="${i === prodSize}">${z}</button>`).join('')}</div>
          <p class="prod-price">${rub(p.price + SIZE_DELTA[prodSize])}</p>
          <button class="btn btn-tomato btn-wide" type="button" data-add>Добавить в корзину</button>
        </div>`;
    };
    render();
    $('#product').onclick = e => {
      const s = e.target.closest('[data-size]');
      if (s) { prodSize = Number(s.dataset.size); render(); return; }
      if (e.target.closest('[data-add]')) addToCart(p.id, prodSize);
    };
    show('product');
  }

  // --- Корзина
  let cart = []; // { id, size, qty }
  function addToCart(id, size) {
    const item = cart.find(i => i.id === id && i.size === size);
    if (item) item.qty++; else cart.push({ id, size, qty: 1 });
    renderCart();
    toast(`${pizza(id).name} в корзине`);
  }
  function renderCart() {
    $('#cList').innerHTML = cart.map((it, i) => {
      const p = pizza(it.id);
      return `<li class="c-row" data-i="${i}">
        <div><b>${p.name}</b><small>${SIZES[it.size]}</small></div>
        <div class="stepper">
          <button type="button" data-act="dec" aria-label="Убрать одну">−</button>
          <span>${it.qty}</span>
          <button type="button" data-act="inc" aria-label="Добавить ещё одну">+</button>
        </div>
        <span class="c-sum">${rub((p.price + SIZE_DELTA[it.size]) * it.qty)}</span>
      </li>`;
    }).join('');
    const count = cart.reduce((s, it) => s + it.qty, 0);
    const total = cart.reduce((s, it) => s + (pizza(it.id).price + SIZE_DELTA[it.size]) * it.qty, 0);
    $('#cEmpty').hidden = cart.length > 0;
    $('#checkout').hidden = cart.length === 0;
    $('#cTotal').textContent = rub(total);
    $('#tabBadge').textContent = count;
    $('#tabBadge').hidden = count === 0;
    $('#cartDot').hidden = count === 0;
  }
  $('#cList').addEventListener('click', e => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const i = Number(b.closest('.c-row').dataset.i);
    cart[i].qty += b.dataset.act === 'inc' ? 1 : -1;
    if (cart[i].qty < 1) cart.splice(i, 1);
    renderCart();
  });

  // --- Заказ
  let order = null;
  $('#orderBtn').addEventListener('click', () => {
    if (!cart.length) return;
    order = { num: 1040 + Math.floor(Math.random() * 900) };
    cart = [];
    renderCart();
    $('#noOrder').hidden = true;
    $('#orderInfo').hidden = false;
    $('#orderNum').textContent = `Заказ №${order.num}`;
    show('order');
  });
  $('#stars').addEventListener('click', e => {
    const b = e.target.closest('[data-star]');
    if (!b) return;
    const rating = 6 - Number(b.dataset.star); // баг: звёзды считаются справа налево
    arm('stars-reversed');
    document.querySelectorAll('#stars [data-star]').forEach(s => s.classList.toggle('on', Number(s.dataset.star) <= rating));
    $('#rateText').textContent = `Твоя оценка: ${rating} из 5`;
  });

  // --- Профиль
  $('#notifSwitch').addEventListener('click', e => {
    const on = e.currentTarget.getAttribute('aria-pressed') !== 'true';
    e.currentTarget.setAttribute('aria-pressed', String(on));
    $('#notifText').textContent = on ? 'Уведомления выключены' : 'Уведомления включены'; // баг: подписи перепутаны
    if (on) arm('notif-toggle');
  });
  $('#bigSwitch').addEventListener('click', e => {
    const on = e.currentTarget.getAttribute('aria-pressed') !== 'true';
    e.currentTarget.setAttribute('aria-pressed', String(on));
    app.classList.toggle('big', on); // баг: вёрстка не рассчитана на крупный текст
    if (on) arm('big-text-break');
  });
  document.addEventListener('themechange', e => { if (e.detail === 'dark') arm('theme-app'); });
  if (document.documentElement.dataset.theme === 'dark') arm('theme-app');

  // --- Всплывающее сообщение
  let toastTimer;
  function toast(text) {
    $('#appToastText').textContent = text;
    $('#appToast').hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { $('#appToast').hidden = true; }, 2600);
  }
  $('#appToastBtn').addEventListener('click', () => { $('#appToast').hidden = true; show('cart'); });

  // --- Баги, которые зависят от экрана телефона
  const landscapeMq = matchMedia('(orientation: landscape) and (max-height: 520px)');
  function checkScreen() {
    if (!appVisible()) return;
    if (innerWidth < 380) arm('small-screen');
    if (landscapeMq.matches) arm('landscape');
  }
  addEventListener('resize', checkScreen);
  setInterval(checkScreen, 1000);

  renderList();
  renderCart();
  checkScreen();

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
      level: 4, session: state.sessionId, name: displayName(), event,
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
          <p class="pop-text">Выключи режим охоты и сначала воспроизведи баг: нажми, смени телефон, поверни экран. Тестировщик сообщает только о том, что смог повторить.</p>`);
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
        </details>` : '<p>Все баги найдены. Приложение «Корж» теперь можно чинить!</p>'}
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
  });

  updateDock();
  $('#timer').textContent = clock(elapsed());
  if (!state.startedAt) introDlg.showModal();
})();
