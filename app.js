(() => {
  'use strict';

  /* =====================================================================
     Список багов. Здесь же — ответы для ведущего мастер-класса.
     repro: false — баг виден сразу; true — его нужно сначала воспроизвести.
     ===================================================================== */
  const SEVERITY = {
    1: { name: 'Косметический', pts: 10 },
    2: { name: 'Незначительный', pts: 20 },
    3: { name: 'Серьёзный', pts: 30 },
    4: { name: 'Критический', pts: 50 },
  };

  const BUGS = [
    { id: 'nav-typo', sev: 1, type: 'Текст', repro: false, area: 'Шапка сайта',
      title: 'Опечатка в меню',
      hint: 'Прочитай пункты меню в шапке очень внимательно, буква за буквой.',
      steps: 'Открыть главную страницу и посмотреть на меню в шапке.',
      expected: 'Пункт меню называется «Доставка».',
      actual: 'Написано «Достафка».' },
    { id: 'nav-contacts', sev: 2, type: 'Навигация', repro: true, area: 'Шапка сайта',
      title: 'Ссылка «Контакты» ведёт не туда',
      hint: 'Пройдись по всем пунктам меню. Каждый ли приводит туда, куда обещает?',
      steps: 'Нажать «Контакты» в шапке сайта.',
      expected: 'Страница прокручивается к контактам в подвале.',
      actual: 'Страница прокручивается к отзывам.' },
    { id: 'hero-run', sev: 3, type: 'Интерфейс', repro: true, area: 'Первый экран',
      title: 'Кнопка «Заказать» убегает',
      hint: 'Попробуй нажать самую главную кнопку на первом экране.',
      steps: 'Навести курсор на кнопку «Заказать» на первом экране.',
      expected: 'Кнопку можно нажать, открывается меню.',
      actual: 'Кнопка отпрыгивает от курсора, нажать её невозможно.' },
    { id: 'promo-contrast', sev: 2, type: 'Доступность', repro: false, area: 'Полоса с акциями',
      title: 'Текст акции почти не виден',
      hint: 'Под первым экраном есть тёмная полоса с акциями. Всё ли там легко прочитать?',
      steps: 'Посмотреть на полосу с акциями под первым экраном.',
      expected: 'Текст каждой акции хорошо читается.',
      actual: 'Текст «По средам третья пицца бесплатно» почти сливается с фоном.' },
    { id: 'search-case', sev: 2, type: 'Логика', repro: true, area: 'Поиск по меню',
      title: 'Поиск не находит пиццу с маленькой буквы',
      hint: 'Поищи пиццу так, как пишешь в чате с друзьями: без заглавных букв.',
      steps: 'В поиске по меню ввести «пепперони».',
      expected: 'Найдена пицца «Пепперони».',
      actual: 'Показано «Ничего не нашлось». Поиск работает только с заглавной буквы.' },
    { id: 'card-image', sev: 1, type: 'Контент', repro: false, area: 'Меню',
      title: 'Картинка не совпадает с составом',
      hint: 'Сравни, что написано в составе пиццы, и что нарисовано на картинке.',
      steps: 'Найти в меню пиццу «Грибная», сравнить картинку и состав.',
      expected: 'На картинке грибы.',
      actual: 'На картинке ананасы.' },
    { id: 'size-price', sev: 2, type: 'Логика', repro: true, area: 'Меню',
      title: 'Большая пицца дешевле средней',
      hint: 'Попереключай размеры у пицц и последи за ценой.',
      steps: 'У пиццы «Маргарита» выбрать 30 см, затем 35 см.',
      expected: 'Пицца 35 см стоит дороже, чем 30 см.',
      actual: '35 см стоит 450 ₽, а 30 см — 490 ₽.' },
    { id: 'add-wrong', sev: 3, type: 'Логика', repro: true, area: 'Меню',
      title: 'В корзину попадает не та пицца',
      hint: 'Добавляй разные пиццы в корзину и смотри, что туда попадает на самом деле.',
      steps: 'Нажать «В корзину» у пиццы «Четыре сыра».',
      expected: 'В корзину добавлена «Четыре сыра».',
      actual: 'В корзину добавлена «Пепперони».' },
    { id: 'rating-stars', sev: 1, type: 'Интерфейс', repro: false, area: 'Отзывы',
      title: 'Шесть звёзд из пяти',
      hint: 'Посчитай звёздочки в отзывах.',
      steps: 'Открыть раздел «Отзывы» и посчитать звёзды у отзыва Миши.',
      expected: 'Оценка 5 из 5 — пять звёзд.',
      actual: 'Нарисовано шесть звёзд.' },
    { id: 'review-overflow', sev: 1, type: 'Вёрстка', repro: false, area: 'Отзывы',
      title: 'Текст вылезает за карточку',
      hint: 'Посмотри, всё ли помещается внутри карточек отзывов.',
      steps: 'Открыть раздел «Отзывы» и посмотреть на отзыв Алисы.',
      expected: 'Текст переносится и остаётся внутри карточки.',
      actual: 'Длинное слово вылезает за границу карточки.' },
    { id: 'cart-badge', sev: 2, type: 'Логика', repro: true, area: 'Кнопка «Корзина» в шапке',
      title: 'Счётчик корзины врёт',
      hint: 'Следи за цифрой на кнопке «Корзина», когда убираешь пиццы.',
      steps: 'Добавить 2 пиццы, затем удалить одну из корзины.',
      expected: 'Цифра на кнопке «Корзина» уменьшается.',
      actual: 'Цифра не меняется и показывает больше пицц, чем в корзине.' },
    { id: 'qty-negative', sev: 3, type: 'Логика', repro: true, area: 'Корзина',
      title: 'Количество уходит в минус',
      hint: 'Что будет, если нажимать «−» в корзине слишком много раз?',
      steps: 'Добавить пиццу в корзину и нажимать «−», пока количество не станет меньше нуля.',
      expected: 'Минимум — 1 пицца, или позиция удаляется из корзины.',
      actual: 'Можно заказать −2 пиццы, сумма становится отрицательной.' },
    { id: 'delivery-fee', sev: 3, type: 'Логика', repro: true, area: 'Корзина',
      title: 'Платная доставка вместо бесплатной',
      hint: 'Прочитай условия доставки и собери заказ побольше.',
      steps: 'Собрать заказ на сумму от 1000 ₽.',
      expected: 'Доставка 0 ₽ — она бесплатна от 1000 ₽.',
      actual: 'Доставка всё равно стоит 199 ₽.' },
    { id: 'promo-stack', sev: 4, type: 'Логика', repro: true, area: 'Корзина',
      title: 'Промокод срабатывает много раз',
      hint: 'Промокод ШКОЛА — хорошая штука. А если применить его ещё раз?',
      steps: 'Добавить пиццу, ввести промокод ШКОЛА и нажать «Применить» несколько раз.',
      expected: 'Скидка 10% применяется только один раз.',
      actual: 'Скидка растёт с каждым нажатием, заказ становится бесплатным и даже уходит в минус.' },
    { id: 'name-placeholder', sev: 1, type: 'Текст', repro: false, area: 'Форма заказа',
      title: 'Неверная подсказка в поле «Имя»',
      hint: 'Прочитай серые подсказки внутри пустых полей формы.',
      steps: 'Открыть форму заказа и посмотреть на пустое поле «Имя».',
      expected: 'Подсказка вроде «Например, Маша».',
      actual: 'Подсказка «Введите email».' },
    { id: 'phone-letters', sev: 3, type: 'Валидация', repro: true, area: 'Форма заказа',
      title: 'В телефон можно вписать буквы',
      hint: 'Попробуй ввести в поле телефона что-нибудь, что телефоном не является.',
      steps: 'В поле «Телефон» ввести «абв».',
      expected: 'Буквы не вводятся или появляется ошибка.',
      actual: 'Буквы принимаются, с ними можно оформить заказ.' },
    { id: 'time-25', sev: 2, type: 'Логика', repro: true, area: 'Форма заказа',
      title: 'Доставка в 25:00',
      hint: 'Посмотри все варианты времени доставки.',
      steps: 'Открыть список «Время доставки» и выбрать последний вариант.',
      expected: 'Только реальное время в часы работы, до 23:00.',
      actual: 'Можно выбрать 25:00.' },
    { id: 'success-name', sev: 2, type: 'Логика', repro: true, area: 'Форма заказа',
      title: 'Заказ оформлен на чужое имя',
      hint: 'Оформи заказ до конца и внимательно прочитай сообщение.',
      steps: 'Указать имя «Маша», заполнить форму и нажать «Оформить заказ».',
      expected: 'Сообщение «Спасибо, Маша!»',
      actual: 'Сообщение «Спасибо, Вася!»' },
    { id: 'footer-year', sev: 1, type: 'Текст', repro: false, area: 'Подвал сайта',
      title: 'Год из будущего',
      hint: 'Спустись в самый низ страницы.',
      steps: 'Прокрутить страницу до подвала.',
      expected: 'Указан текущий год.',
      actual: 'Написано «© 2062».' },
  ];

  const PENALTY = 5;
  const STORAGE_KEY = 'korzh-bughunt-v1';
  const bugById = id => BUGS.find(b => b.id === id);
  const ptsOf = b => SEVERITY[b.sev].pts;
  const MAX_SCORE = BUGS.reduce((s, b) => s + ptsOf(b), 0);

  const $ = sel => document.querySelector(sel);
  const rub = n => `${n < 0 ? '−' : ''}${Math.abs(n).toLocaleString('ru-RU')} ₽`;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* =====================================================================
     Сайт пиццерии «Корж» — с багами внутри
     ===================================================================== */
  const SIZES = ['25 см', '30 см', '35 см'];
  const PIZZAS = [
    { id: 'margherita', name: 'Маргарита', desc: 'Томаты, моцарелла, свежий базилик',
      prices: [390, 490, 450], top: ['🍅', '🌿', '🍅', '🌿', '🍅'] }, // баг: 35 см дешевле 30 см
    { id: 'pepperoni', name: 'Пепперони', desc: 'Пикантная пепперони, моцарелла, томатный соус',
      prices: [450, 550, 650], top: 'dots' },
    { id: 'four-cheese', name: 'Четыре сыра', desc: 'Моцарелла, горгонзола, пармезан, чеддер',
      prices: [490, 590, 690], top: ['🧀', '🧀', '🧀', '🧀'] },
    { id: 'mushroom', name: 'Грибная', desc: 'Шампиньоны, сливочный соус, тимьян',
      prices: [420, 520, 620], top: ['🍍', '🍍', '🍍', '🍍', '🍍'] }, // баг: ананасы вместо грибов
    { id: 'hawaii', name: 'Гавайская', desc: 'Курица, ананас, моцарелла',
      prices: [470, 570, 670], top: ['🍍', '🍗', '🍍', '🍗', '🍍'] },
    { id: 'veggie', name: 'Овощная', desc: 'Перец, томаты, оливки, кукуруза',
      prices: [410, 510, 610], top: ['🫑', '🌽', '🫒', '🍅', '🫑', '🫒'] },
  ];
  const pizza = id => PIZZAS.find(p => p.id === id);
  const SPOTS = [[50, 27], [27, 45], [72, 43], [38, 70], [64, 70], [50, 50]];

  function pizzaHTML(p, cls = '', attrs = '') {
    const tops = p.top === 'dots'
      ? SPOTS.map(([x, y]) => `<i class="dot" style="left:${x}%;top:${y}%"></i>`).join('')
      : p.top.map((t, i) => `<span style="left:${SPOTS[i][0]}%;top:${SPOTS[i][1]}%">${t}</span>`).join('');
    return `<div class="pizza ${cls}"${attrs}>${tops}</div>`;
  }

  const heroPizza = { top: ['🍅', '🍄', '🌿', '🫒', '🍅', '🌿'] };
  $('#heroArt').innerHTML = pizzaHTML(heroPizza, 'pizza-main') + pizzaHTML(heroPizza, 'pizza-slice');

  const armed = new Set(BUGS.filter(b => !b.repro).map(b => b.id));
  const arm = id => armed.add(id);

  // --- Меню
  const grid = $('#grid');
  const search = $('#search');
  const empty = $('#empty');
  const sizeOf = Object.fromEntries(PIZZAS.map(p => [p.id, 1]));

  function cardHTML(p) {
    const s = sizeOf[p.id];
    return `<article class="card" data-id="${p.id}">
      ${pizzaHTML(p, '', p.id === 'mushroom' ? ' data-bug="card-image"' : '')}
      <h3>${p.name}</h3>
      <p class="desc">${p.desc}</p>
      <div class="sizes" role="group" aria-label="Размер пиццы ${p.name}">
        ${SIZES.map((z, i) => `<button type="button" data-size="${i}" aria-pressed="${i === s}">${z}</button>`).join('')}
      </div>
      <div class="card-foot">
        <span class="price"${p.id === 'margherita' ? ' data-bug="size-price"' : ''}>${rub(p.prices[s])}</span>
        <button class="btn btn-tomato add" type="button"${p.id === 'four-cheese' ? ' data-bug="add-wrong"' : ''}>В корзину</button>
      </div>
    </article>`;
  }

  function renderMenu() {
    const q = search.value.trim();
    const list = PIZZAS.filter(p => p.name.includes(q)); // баг: поиск учитывает регистр
    grid.innerHTML = list.map(cardHTML).join('');
    empty.hidden = list.length > 0;
    if (!list.length && PIZZAS.some(p => p.name.toLowerCase().includes(q.toLowerCase()))) arm('search-case');
  }

  search.addEventListener('input', renderMenu);

  grid.addEventListener('click', e => {
    const card = e.target.closest('.card');
    if (!card) return;
    const p = pizza(card.dataset.id);
    const sizeBtn = e.target.closest('[data-size]');
    if (sizeBtn) {
      sizeOf[p.id] = Number(sizeBtn.dataset.size);
      if (p.id === 'margherita' && sizeOf[p.id] === 2) arm('size-price');
      card.outerHTML = cardHTML(p);
      grid.querySelector(`[data-id="${p.id}"] [data-size="${sizeOf[p.id]}"]`)?.focus();
      return;
    }
    if (e.target.closest('.add')) addToCart(p);
  });

  // --- Корзина
  let cart = [];       // { pid, size, qty }
  let badge = 0;       // баг: счётчик только растёт
  let promoTimes = 0;  // баг: промокод можно применять снова и снова

  function addToCart(p) {
    const real = p.id === 'four-cheese' ? pizza('pepperoni') : p; // баг: добавляется не та пицца
    if (p.id === 'four-cheese') arm('add-wrong');
    const size = sizeOf[p.id];
    const item = cart.find(i => i.pid === real.id && i.size === size);
    if (item) item.qty++;
    else cart.push({ pid: real.id, size, qty: 1 });
    badge++;
    renderCart();
    siteToast(`Добавлено в корзину: ${real.name}, ${SIZES[size]}`);
  }

  const cartList = $('#cartList');

  function renderCart() {
    cartList.innerHTML = cart.map((it, i) => {
      const p = pizza(it.pid);
      return `<li class="row" data-i="${i}">
        <div><b>${p.name}</b><small>${SIZES[it.size]}</small></div>
        <div class="stepper" data-bug="qty-negative">
          <button type="button" data-act="dec" aria-label="Убрать одну">−</button>
          <span>${String(it.qty).replace('-', '−')}</span>
          <button type="button" data-act="inc" aria-label="Добавить ещё одну">+</button>
        </div>
        <span class="row-price">${rub(p.prices[it.size] * it.qty)}</span>
        <button type="button" class="remove" data-act="del" aria-label="Удалить ${p.name}">×</button>
      </li>`;
    }).join('');
    $('#cartEmpty').hidden = cart.length > 0;

    const sub = cart.reduce((s, it) => s + pizza(it.pid).prices[it.size] * it.qty, 0);
    const delivery = cart.length ? 199 : 0; // баг: обещали бесплатно от 1000 ₽
    const discount = Math.round(Math.max(sub, 0) * 0.1) * promoTimes;
    $('#sub').textContent = rub(sub);
    $('#deliv').textContent = rub(delivery);
    $('#discRow').hidden = !(promoTimes && cart.length);
    $('#disc').textContent = rub(-discount);
    $('#total').textContent = rub(sub + delivery - discount);
    $('#badge').textContent = badge;

    const count = cart.reduce((s, it) => s + it.qty, 0);
    if (sub >= 1000) arm('delivery-fee');
    if (badge !== count) arm('cart-badge');
    if (cart.some(it => it.qty < 0)) arm('qty-negative');
    if (promoTimes >= 2 && sub > 0) arm('promo-stack');
  }

  cartList.addEventListener('click', e => {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const i = Number(btn.closest('.row').dataset.i);
    const act = btn.dataset.act;
    if (act === 'inc') { cart[i].qty++; badge++; }
    else if (act === 'dec') cart[i].qty--; // баг: нет нижней границы
    else cart.splice(i, 1);
    renderCart();
    cartList.querySelector(`.row[data-i="${i}"] [data-act="${act}"]`)?.focus();
  });

  $('#promoForm').addEventListener('submit', e => {
    e.preventDefault();
    const code = $('#promo').value.trim().toUpperCase();
    const msg = $('#promoMsg');
    if (code === 'ШКОЛА') {
      promoTimes++;
      msg.textContent = 'Промокод применён: скидка 10%';
      msg.className = 'promo-msg ok';
    } else {
      msg.textContent = code ? 'Такого промокода нет' : 'Введи промокод';
      msg.className = 'promo-msg err';
    }
    renderCart();
  });

  // --- Форма заказа
  const fPhone = $('#fPhone');
  fPhone.addEventListener('input', () => {
    if (/[a-zа-яё]/i.test(fPhone.value)) arm('phone-letters'); // баг: нет проверки формата
  });
  $('#fTime').addEventListener('change', e => {
    if (e.target.value === '25:00') arm('time-25');
  });

  $('#orderForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#fName').value.trim();
    const phone = fPhone.value.trim();
    const addr = $('#fAddr').value.trim();
    const time = $('#fTime').value;
    const err = $('#formError');
    const success = $('#success');
    success.hidden = true;

    if (!cart.length) { err.textContent = 'Добавь в корзину хотя бы одну пиццу.'; return; }
    const missing = [!name && 'имя', !phone && 'телефон', !addr && 'адрес'].filter(Boolean);
    if (missing.length) { err.textContent = `Заполни ${missing.join(', ')}.`; return; }

    err.textContent = '';
    if (name.toLowerCase() !== 'вася') arm('success-name');
    const num = 1040 + Math.floor(Math.random() * 900);
    success.innerHTML = `<b>Спасибо, Вася!</b> Заказ №${num} принят и уже готовится. Привезём ${time === 'asap' ? 'за 30 минут' : `к ${time}`}.`;
    success.hidden = false;
  });

  // --- Шапка и первый экран
  $('#contactsLink').addEventListener('click', () => arm('nav-contacts')); // баг: href ведёт к отзывам

  const runBtn = $('#runBtn');
  const hero = $('#hero');
  let runOffset = { x: 0, y: 0 };
  let huntEscapes = 0;

  function flee(e) {
    if (hunting && huntEscapes >= 3) return; // в режиме охоты кнопка устаёт после трёх побегов
    if (hunting) huntEscapes++;
    arm('hero-run');
    const area = hero.getBoundingClientRect();
    const r = runBtn.getBoundingClientRect();
    const baseX = r.left - runOffset.x;
    const baseY = r.top - runOffset.y;
    const px = e?.clientX ?? r.left + r.width / 2;
    const py = e?.clientY ?? r.top + r.height / 2;
    let tx, ty, tries = 0;
    do {
      tx = area.left + Math.random() * Math.max(0, area.width - r.width);
      ty = area.top + Math.random() * Math.max(0, area.height - r.height);
      tries++;
    } while (Math.hypot(tx + r.width / 2 - px, ty + r.height / 2 - py) < 180 && tries < 30);
    runOffset = { x: tx - baseX, y: ty - baseY };
    runBtn.style.transform = `translate(${runOffset.x}px, ${runOffset.y}px)`;
  }
  runBtn.addEventListener('pointerenter', flee);
  runBtn.addEventListener('focus', () => { if (!hunting) flee(); });
  runBtn.addEventListener('click', () => $('#menu').scrollIntoView({ behavior: 'smooth' }));

  let toastTimer;
  function siteToast(text) {
    const t = $('#siteToast');
    t.textContent = text;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 2400);
  }

  renderMenu();
  renderCart();

  /* =====================================================================
     Игровой слой: режим охоты, очки, журнал
     ===================================================================== */
  const fresh = () => ({
    sessionId: Math.random().toString(36).slice(2, 10), participant: null,
    caught: [], misses: 0, hints: 0, hinted: [], startedAt: null, finishedAt: null, missNoteShown: false,
  });
  let state = load() || fresh();
  // прогресс, сохранённый старой версией сайта, получает участника для статистики
  if (state.startedAt && !state.participant) { state.participant = BugStats.startParticipant(state.name || ''); save(); }

  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return s && Array.isArray(s.caught) ? { ...fresh(), ...s } : null;
    } catch { return null; }
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* хранилище недоступно */ }
  }

  const score = () => Math.max(0,
    state.caught.reduce((s, id) => s + ptsOf(bugById(id)), 0) - PENALTY * (state.misses + state.hints));

  // запись в статистику участников (stats.js)
  const playerName = () => BugStats.displayName(state.participant);
  const log = (event, data = {}) => BugStats.record({
    level: 1, session: state.sessionId, name: playerName(), event, elapsed: elapsed(), score: score(), ...data,
  });

  // --- Нижняя панель
  const slots = $('#slots');
  slots.innerHTML = BUGS.map(() => '<span class="slot"></span>').join('');
  $('#totalN').textContent = BUGS.length;

  function updateDock() {
    [...slots.children].forEach((el, i) => el.classList.toggle('on', i < state.caught.length));
    $('#caughtN').textContent = state.caught.length;
    $('#score').textContent = score();
  }

  function elapsed() {
    if (!state.startedAt) return 0;
    return Math.floor(((state.finishedAt || Date.now()) - state.startedAt) / 1000);
  }
  const clock = sec => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
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
    if (on) huntEscapes = 0;
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

  // фонарик следует за курсором
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

  // в режиме охоты сайт не реагирует на клики — клик ловит баг
  const inSite = t => t instanceof Element && t.closest('#site');
  ['pointerdown', 'mousedown'].forEach(type => {
    document.addEventListener(type, e => { if (hunting && inSite(e.target)) e.preventDefault(); }, true);
  });
  document.addEventListener('click', e => {
    if (!hunting || !inSite(e.target)) return;
    e.preventDefault();
    e.stopPropagation();
    let { pageX: x, pageY: y } = e;
    if (e.detail === 0) { // нажатие с клавиатуры
      const r = e.target.getBoundingClientRect();
      x = r.left + r.width / 2 + scrollX;
      y = r.top + r.height / 2 + scrollY;
    }
    attempt(e.target, x, y);
  }, true);

  function attempt(target, x, y) {
    if (!state.startedAt) return;
    const id = target.closest('[data-bug]')?.dataset.bug;

    if (id && state.caught.includes(id)) {
      floatText(x, y, 'Уже в журнале', 'muted');
      return;
    }
    if (!id || !armed.has(id)) {
      state.misses++;
      save();
      updateDock();
      log('Ложная тревога', { points: -PENALTY });
      floatText(x, y, `−${PENALTY}<small>ложная тревога</small>`, 'miss');
      if (!state.missNoteShown) {
        state.missNoteShown = true;
        save();
        showPop(`
          <p class="kicker">Ложная тревога, −${PENALTY} баллов</p>
          <h3>Сейчас здесь всё работает правильно</h3>
          <p class="pop-text">Если подозреваешь баг, выключи режим охоты и сначала воспроизведи его: нажми, введи, выбери. Тестировщик сообщает только о том, что смог повторить.</p>`);
      }
      return;
    }

    const bug = bugById(id);
    state.caught.push(id);
    save();
    updateDock();
    log('Баг пойман', { bug: bug.title, severity: SEVERITY[bug.sev].name, points: ptsOf(bug) });
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
    const left = BUGS.filter(b => !state.caught.includes(b.id));
    if (!left.length) return;
    const unseen = left.filter(b => !state.hinted.includes(b.id));
    const pool = unseen.length ? unseen : left;
    const bug = pool[Math.floor(Math.random() * pool.length)];
    state.hints++;
    if (!state.hinted.includes(bug.id)) state.hinted.push(bug.id);
    save();
    updateDock();
    log('Подсказка', { points: -PENALTY });
    showPop(`
      <p class="kicker">Подсказка, −${PENALTY} баллов</p>
      <h3>Где искать: ${bug.area.toLowerCase()}</h3>
      <p class="pop-text">${bug.hint}</p>`);
  });

  // --- Журнал
  const logDlg = $('#logDlg');
  $('#logBtn').addEventListener('click', () => {
    $('#logList').innerHTML = state.caught.length
      ? state.caught.map(id => logItemHTML(bugById(id))).join('')
      : '<p class="log-empty">Журнал пуст. Включи режим охоты и поймай первый баг.</p>';
    logDlg.showModal();
  });

  function logItemHTML(bug) {
    return `<article class="log-item">
      <div class="pop-top">
        <span class="chip sev-${bug.sev}">${SEVERITY[bug.sev].name}, +${ptsOf(bug)}</span>
        <span class="chip chip-type">${bug.type}</span>
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
      log('Финиш', { bug: `Найдено ${state.caught.length} из ${BUGS.length}` });
    }
    const s = score();
    const missed = BUGS.filter(b => !state.caught.includes(b.id));
    const shots = state.caught.length + state.misses;
    const accuracy = shots ? Math.round(state.caught.length / shots * 100) : 0;
    $('#finishBody').innerHTML = `
      <div class="dlg-head">
        <p>${esc(playerName())}, твой результат</p>
        <button class="dlg-close" type="button" data-close-finish aria-label="Закрыть">×</button>
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
          ${missed.map(logItemHTML).join('')}
        </details>` : '<p>Все баги найдены. Сайт «Корж» теперь можно чинить!</p>'}
      <div class="dlg-row">
        ${missed.length ? '<button class="dlg-cta" type="button" data-close-finish>Вернуться к охоте</button>' : ''}
        <button class="dlg-ghost" type="button" data-open-stats>Статистика участников</button>
        <button class="dlg-ghost" type="button" data-next>Следующий участник</button>
      </div>`;
    finishDlg.showModal();
  }

  finishDlg.addEventListener('click', e => {
    if (e.target.closest('[data-close-finish]')) finishDlg.close();
    if (e.target.closest('[data-next]')
      && confirm(`Результат «${playerName()}» сохранён. Передать компьютер следующему участнику?`)) {
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
    log('Старт');
  });

  updateDock();
  $('#timer').textContent = clock(elapsed());
  if (!state.startedAt) introDlg.showModal();
})();
