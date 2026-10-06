(() => {
  'use strict';

  /* =====================================================================
     Уровень 2: список багов. Здесь же — ответы для ведущего.
     Все баги этого уровня появляются только при определённых числах,
     поэтому каждый нужно сначала воспроизвести.
     ===================================================================== */
  const SEVERITY = {
    1: { name: 'Косметический', pts: 10 },
    2: { name: 'Незначительный', pts: 20 },
    3: { name: 'Серьёзный', pts: 30 },
    4: { name: 'Критический', pts: 50 },
  };

  const BUGS = [
    { id: 'calc-floor', sev: 3, type: 'Округление', area: 'Калькулятор',
      title: 'Пиццы не хватает гостям',
      hint: 'Посчитай сам: сколько кусков нужно и сколько их в пиццах, которые советует калькулятор.',
      steps: 'Калькулятор: 10 гостей, обычный аппетит, 30 см.',
      expected: '30 кусков ÷ 8 = 3,75 — значит, нужно 4 пиццы.',
      actual: 'Калькулятор советует 3 пиццы. Это 24 куска, шести кускам не хватает места.' },
    { id: 'calc-slices35', sev: 2, type: 'Требования', area: 'Калькулятор',
      title: 'В пицце 35 см не 10 кусков',
      hint: 'Сверь с правилами, сколько кусков в пицце каждого размера.',
      steps: 'Калькулятор: выбрать размер 35 см.',
      expected: 'Кусков в одной пицце: 10.',
      actual: 'Кусков в одной пицце: 8.' },
    { id: 'calc-add-size', sev: 3, type: 'Логика', area: 'Калькулятор и заказ',
      title: 'Калькулятор добавляет не тот размер',
      hint: 'Выбери в калькуляторе необычный размер, добавь пиццы в заказ и проверь состав.',
      steps: 'Калькулятор: выбрать 35 см, нажать «Добавить в заказ».',
      expected: 'В заказе Маргарита 35 см.',
      actual: 'В заказе Маргарита 30 см.' },
    { id: 'topping-size', sev: 3, type: 'Логика', area: 'Конструктор',
      title: 'Наценка на добавки не для того размера',
      hint: 'Выбери одну добавку и переключай размеры. Как меняется цена добавок?',
      steps: 'Конструктор: размер 25 см, добавить грибы за 50 ₽.',
      expected: 'Добавки: 50 ₽. Наценка ×1,5 только для 35 см.',
      actual: 'Добавки: 75 ₽. А для 35 см наценки, наоборот, нет.' },
    { id: 'topping-limit', sev: 2, type: 'Граничное значение', area: 'Конструктор',
      title: 'Можно выбрать шесть добавок',
      hint: 'Сколько добавок разрешают правила? Попробуй выбрать на одну больше.',
      steps: 'Конструктор: выбрать подряд шесть добавок.',
      expected: 'Шестая добавка не выбирается, максимум 5.',
      actual: 'Выбрано 6 из 5.' },
    { id: 'builder-stale', sev: 3, type: 'Логика', area: 'Конструктор',
      title: 'Итог конструктора отстаёт на шаг',
      hint: 'Сложи основу и добавки сам и сравни с «Итого». Сразу после каждого клика.',
      steps: 'Конструктор: размер 30 см, добавить грибы.',
      expected: 'Итого 400 + 50 = 450 ₽.',
      actual: 'Итого 400 ₽. Сумма обновляется только после следующего клика.' },
    { id: 'qty-fraction', sev: 2, type: 'Валидация', area: 'Заказ',
      title: 'Можно заказать полторы пиццы',
      hint: 'Количество пицц в заказе можно вписать руками. Любое ли число подходит?',
      steps: 'В составе заказа вписать количество 1,5.',
      expected: 'Только целое число пицц.',
      actual: 'Принимается 1,5 пиццы, цена умножается на 1,5.' },
    { id: 'combo-max', sev: 3, type: 'Логика', area: 'Чек',
      title: 'В подарок самая дорогая пицца',
      hint: 'Собери заказ из 3 пицц разной цены. Какую из них дарят?',
      steps: 'Добавить 2 Маргариты 30 см (по 500 ₽) и свою пиццу дороже 500 ₽.',
      expected: 'Подарок — самая дешёвая пицца: −500 ₽.',
      actual: 'Подарок — самая дорогая пицца.' },
    { id: 'discount-base', sev: 4, type: 'Логика', area: 'Чек',
      title: 'Скидка 15% считается до подарка',
      hint: 'Правило скидки говорит про сумму после подарка. Собери заказ ровно на 2000 ₽ из 4 пицц.',
      steps: 'Добавить 4 Маргариты 30 см: 2000 ₽.',
      expected: 'После подарка 1500 ₽ — меньше 2000, скидки нет.',
      actual: 'Скидка 15% = 300 ₽ посчитана от 2000 ₽, до подарка.' },
    { id: 'free-delivery-boundary', sev: 3, type: 'Граничное значение', area: 'Доставка',
      title: 'Ровно 1500 ₽ — доставка всё равно платная',
      hint: 'Бесплатная доставка — «от 1500 ₽». А если ровно 1500?',
      steps: 'Добавить 3 Маргариты 30 см (1500 ₽), расстояние 5 км.',
      expected: 'Доставка 0 ₽: заказ на 1500 ₽ подходит под условие.',
      actual: 'Доставка платная.' },
    { id: 'delivery-km', sev: 3, type: 'Логика', area: 'Доставка',
      title: 'Платные километры считаются с нуля',
      hint: 'Задай расстояние больше 3 км и пересчитай стоимость доставки по правилам.',
      steps: 'Заказ меньше 1500 ₽, расстояние 5 км.',
      expected: 'Платных км: 5 − 3 = 2, доставка 98 ₽.',
      actual: 'Платных км: 5, доставка 245 ₽.' },
    { id: 'eta-midnight', sev: 2, type: 'Время', area: 'Доставка',
      title: 'Доставка в 24 часа',
      hint: 'Закажи пиццу очень поздно вечером и посмотри, когда её привезут.',
      steps: 'Время заказа 23:40, расстояние 2 км.',
      expected: 'Привезём к 00:13.',
      actual: 'Привезём к 24:13.' },
    { id: 'bonus-over', sev: 4, type: 'Логика', area: 'Чек',
      title: 'Можно списать больше бонусов, чем есть',
      hint: 'На счёте 300 бонусов. А если попробовать списать больше?',
      steps: 'В чеке списать 500 бонусов.',
      expected: 'Списать можно максимум 300.',
      actual: 'Списано 500, останется −200 бонусов.' },
    { id: 'cashback-base', sev: 3, type: 'Логика', area: 'Чек',
      title: 'Кешбэк начисляется и на бонусы',
      hint: 'Оплати часть заказа бонусами и пересчитай, сколько бонусов начислят.',
      steps: 'Заказ на 1000 ₽ с бесплатной доставкой, списать 200 бонусов.',
      expected: 'Деньгами 800 ₽ → начислим 40 бонусов.',
      actual: 'Начислим 50 бонусов — 5% от 1000 ₽.' },
    { id: 'split-zero', sev: 2, type: 'Деление на ноль', area: 'Чек',
      title: 'Скинуться на ноль человек',
      hint: 'Что будет, если в «Скинуться поровну» вписать самое маленькое число?',
      steps: 'В поле «Скинуться поровну» вписать 0.',
      expected: 'Ошибка: нужен хотя бы 1 человек.',
      actual: 'С каждого ∞ ₽.' },
    { id: 'split-round', sev: 3, type: 'Округление', area: 'Чек',
      title: 'При делении теряются рубли',
      hint: 'Раздели счёт так, чтобы он не делился нацело, и сложи, сколько соберут все вместе.',
      steps: 'Заказ на 1000 ₽, скинуться на 3 человек.',
      expected: 'По 334 ₽, вместе 1002 ₽ — хватит на заказ.',
      actual: 'По 333 ₽, вместе 999 ₽ — не хватает рубля.' },
    { id: 'theme-rules', sev: 2, type: 'Тема', area: 'Как мы считаем',
      title: 'В тёмной теме пропадают правила',
      hint: 'Включи тёмную тему кнопкой с луной в шапке и попробуй прочитать правила.',
      steps: 'Включить тёмную тему кнопкой 🌙 в шапке.',
      expected: 'Блок «Как мы считаем» тоже становится тёмным, текст читается.',
      actual: 'Блок остался белым, а текст стал светлым — правила не прочитать.' },
    { id: 'big-text', sev: 2, type: 'Вёрстка', area: 'Первый экран',
      title: '«Крупный шрифт» ломает страницу',
      hint: 'Под заголовком страницы есть кнопка для крупного шрифта. Нажми её.',
      steps: 'Нажать «Крупный шрифт» под заголовком страницы.',
      expected: 'Текст становится крупнее, но всё помещается на своих местах.',
      actual: 'Заголовки налезают на соседние блоки и вылезают за края, большие числа не помещаются.' },
  ];

  const PENALTY = 5;
  const STORAGE_KEY = 'korzh-bughunt-l2-v1';
  const bugById = id => BUGS.find(b => b.id === id);
  const ptsOf = b => SEVERITY[b.sev].pts;
  const MAX_SCORE = BUGS.reduce((s, b) => s + ptsOf(b), 0);

  const $ = sel => document.querySelector(sel);
  const rub = n => `${n < 0 ? '−' : ''}${Math.abs(n).toLocaleString('ru-RU')} ₽`;
  const num = n => `${n < 0 ? '−' : ''}${Math.abs(n).toLocaleString('ru-RU')}`;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const plural = (n, [one, few, many]) => {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  };
  const intOf = el => {
    const v = parseInt(el.value, 10);
    return Number.isNaN(v) ? 0 : v;
  };

  /* =====================================================================
     Сайт «Корж. Праздник» — с багами внутри
     ===================================================================== */
  const SIZES = ['25 см', '30 см', '35 см'];
  const SLICES = [6, 8, 10];
  const MARGHERITA = [400, 500, 650];
  const BASES = [300, 400, 500];
  const MAX_TOPPINGS = 5;
  const BONUS_BALANCE = 300;
  const TOPPINGS = [
    { id: 'cheese', name: 'Моцарелла', price: 60, e: '🧀' },
    { id: 'mush', name: 'Грибы', price: 50, e: '🍄' },
    { id: 'pine', name: 'Ананас', price: 70, e: '🍍' },
    { id: 'chili', name: 'Халапеньо', price: 40, e: '🌶️' },
    { id: 'bacon', name: 'Бекон', price: 90, e: '🥓' },
    { id: 'olive', name: 'Оливки', price: 50, e: '🫒' },
    { id: 'tomato', name: 'Томаты', price: 40, e: '🍅' },
    { id: 'corn', name: 'Кукуруза', price: 40, e: '🌽' },
  ];
  const topping = id => TOPPINGS.find(t => t.id === id);
  const SPOTS = [[50, 26], [27, 44], [73, 42], [38, 70], [63, 71], [50, 49], [30, 62], [70, 60], [43, 34], [59, 33], [50, 76], [24, 52]];

  const armed = new Set();
  const arm = id => armed.add(id);

  const toppingsHTML = emojis => emojis.map((e, i) =>
    `<span style="left:${SPOTS[i][0]}%;top:${SPOTS[i][1]}%">${e}</span>`).join('');
  const pizzaHTML = (emojis, attrs = '') => `<div class="pizza"${attrs}>${toppingsHTML(emojis)}</div>`;

  // размеры на первом экране: куски нарисованы честно — 6, 8 и 10
  $('#sizeRow').innerHTML = SIZES.map((z, i) => `
    <div class="size-item">
      <div style="width:${[96, 128, 160][i]}px">${pizzaHTML([], ` style="--n:${SLICES[i]}"`)}</div>
      <span>${z}, ${SLICES[i]} кусков</span>
    </div>`).join('');

  function sizesHTML(current) {
    return SIZES.map((z, i) => `<button type="button" data-size="${i}" aria-pressed="${i === current}">${z}</button>`).join('');
  }

  // --- Калькулятор гостей
  const cGuests = $('#cGuests');
  const cAppetite = $('#cAppetite');
  const cSizes = $('#cSizes');
  const cAdd = $('#cAdd');
  let calcSize = 1;
  let calcPizzas = 0;

  function renderCalc() {
    cSizes.innerHTML = sizesHTML(calcSize);
    const guests = Math.max(0, intOf(cGuests));
    const slices = guests * Number(cAppetite.value);
    const perPizza = calcSize === 2 ? 8 : SLICES[calcSize]; // баг: в 35 см должно быть 10 кусков
    if (calcSize === 2) arm('calc-slices35');
    calcPizzas = Math.floor(slices / perPizza); // баг: нужно округлять вверх
    if (slices % perPizza !== 0) arm('calc-floor');

    $('#cSlices').textContent = slices;
    $('#cPer').textContent = perPizza;
    $('#cPizzas').textContent = calcPizzas;
    $('#cWord').textContent = plural(calcPizzas, ['пицца', 'пиццы', 'пицц']);
    $('#cSizeName').textContent = SIZES[calcSize];
    cAdd.disabled = calcPizzas < 1;
    cAdd.textContent = calcPizzas > 0
      ? `Добавить ${calcPizzas} ${plural(calcPizzas, ['пиццу', 'пиццы', 'пицц'])} в заказ`
      : 'Добавить в заказ';
  }

  cGuests.addEventListener('input', renderCalc);
  cAppetite.addEventListener('change', renderCalc);
  cSizes.addEventListener('click', e => {
    const b = e.target.closest('[data-size]');
    if (!b) return;
    calcSize = Number(b.dataset.size);
    renderCalc();
    cSizes.querySelector(`[data-size="${calcSize}"]`)?.focus();
  });
  cAdd.addEventListener('click', () => {
    if (calcPizzas < 1) return;
    const size = 1; // баг: всегда 30 см, а не выбранный размер
    const mismatch = calcSize !== size;
    if (mismatch) arm('calc-add-size');
    const key = `m-${size}`;
    const item = items.find(i => i.key === key);
    if (item) { item.qty += calcPizzas; item.mismatch = item.mismatch || mismatch; }
    else items.push({ key, name: 'Маргарита', size, detail: '', unit: MARGHERITA[size], qty: calcPizzas, mismatch });
    renderOrder();
    siteToast(`Добавлено в заказ: Маргарита ×${calcPizzas}`);
  });

  // --- Конструктор
  const bSizes = $('#bSizes');
  const bTops = $('#bTops');
  const picked = new Set();
  let builderSize = 1;
  let shownTops = 0; // сумма добавок с прошлой отрисовки

  function toppingsPrice() {
    const sum = [...picked].reduce((s, id) => s + topping(id).price, 0);
    const k = builderSize === 0 ? 1.5 : 1; // баг: наценка ×1,5 должна быть у 35 см, а не у 25 см
    return Math.round(sum * k);
  }

  function renderBuilder() {
    bSizes.innerHTML = sizesHTML(builderSize);
    bTops.innerHTML = TOPPINGS.map(t => `
      <button type="button" data-top="${t.id}" aria-pressed="${picked.has(t.id)}">
        <span aria-hidden="true">${t.e}</span>${t.name} <small>${t.price} ₽</small>
      </button>`).join('');

    const base = BASES[builderSize];
    const tops = toppingsPrice();
    $('#bCount').textContent = `${picked.size} из ${MAX_TOPPINGS}`;
    if (picked.size > MAX_TOPPINGS) arm('topping-limit');
    $('#bBase').textContent = rub(base);
    $('#bTopsSum').textContent = rub(tops);
    if (picked.size && builderSize !== 1) arm('topping-size');

    $('#bTotal').textContent = rub(base + shownTops); // баг: берётся сумма добавок с прошлого шага
    if (shownTops !== tops) arm('builder-stale');
    shownTops = tops;

    const emojis = [...picked].flatMap(id => [topping(id).e, topping(id).e]).slice(0, SPOTS.length);
    $('#bPreview').innerHTML = toppingsHTML(emojis);
  }

  bSizes.addEventListener('click', e => {
    const b = e.target.closest('[data-size]');
    if (!b) return;
    builderSize = Number(b.dataset.size);
    renderBuilder();
    bSizes.querySelector(`[data-size="${builderSize}"]`)?.focus();
  });
  bTops.addEventListener('click', e => {
    const b = e.target.closest('[data-top]');
    if (!b) return;
    const id = b.dataset.top;
    const msg = $('#bMsg');
    msg.textContent = '';
    if (picked.has(id)) picked.delete(id);
    else if (picked.size > MAX_TOPPINGS) msg.textContent = `Больше ${MAX_TOPPINGS} добавок нельзя`; // баг: должно быть >=
    else picked.add(id);
    renderBuilder();
    bTops.querySelector(`[data-top="${id}"]`)?.focus();
  });
  $('#bAdd').addEventListener('click', () => {
    const unit = BASES[builderSize] + toppingsPrice();
    const detail = picked.size ? [...picked].map(id => topping(id).name.toLowerCase()).join(', ') : 'без добавок';
    items.push({ key: `c-${Date.now()}-${Math.random()}`, name: 'Своя пицца', size: builderSize, detail, unit, qty: 1 });
    renderOrder();
    siteToast(`Добавлено в заказ: своя пицца ${SIZES[builderSize]} за ${rub(unit)}`);
  });

  // --- Заказ, доставка, чек
  let items = []; // { key, name, size, detail, unit, qty, mismatch }
  const oItems = $('#oItems');
  const dKm = $('#dKm');
  const dTime = $('#dTime');
  const oBonus = $('#oBonus');
  const oPeople = $('#oPeople');

  function renderItems() {
    oItems.innerHTML = items.map((it, i) => `
      <li class="item" data-i="${i}">
        <div${it.mismatch ? ' data-bug="calc-add-size"' : ''}>
          <b>${it.name}, ${SIZES[it.size]}</b>
          ${it.detail ? `<small>${esc(it.detail)}</small>` : ''}
          <small>${rub(it.unit)} за штуку</small>
        </div>
        <input class="field" data-bug="qty-fraction" value="${String(it.qty).replace('.', ',')}" inputmode="decimal" aria-label="Количество: ${it.name}">
        <span class="item-sum">${rub(Math.round(it.unit * it.qty))}</span>
        <button type="button" class="remove" data-del aria-label="Удалить ${it.name}">×</button>
      </li>`).join('');
    $('#oEmpty').hidden = items.length > 0;
  }

  function renderOrder({ keepItems = false } = {}) {
    if (!keepItems) renderItems();

    const sub = items.reduce((s, it) => s + Math.round(it.unit * it.qty), 0);
    const count = items.reduce((s, it) => s + it.qty, 0);
    const prices = items.map(it => it.unit);

    // подарок
    const gift = count >= 3 ? Math.max(...prices) : 0; // баг: дарить нужно самую дешёвую
    if (count >= 3 && Math.max(...prices) !== Math.min(...prices)) arm('combo-max');
    const afterGift = sub - gift;

    // скидка 15%
    const disc = sub >= 2000 ? Math.round(sub * 0.15) : 0; // баг: считать надо от суммы после подарка
    const rightDisc = afterGift >= 2000 ? Math.round(afterGift * 0.15) : 0;
    if (gift > 0 && disc !== rightDisc) arm('discount-base');

    // доставка
    const km = Math.max(0, intOf(dKm));
    const freeBySum = sub > 1500; // баг: должно быть >= 1500
    const paidKm = km > 3 ? km : 0; // баг: платные только километры после третьего
    const fee = freeBySum ? 0 : paidKm * 49;
    if (sub === 1500 && km > 3) arm('free-delivery-boundary');
    if (km > 3 && fee > 0) arm('delivery-km');

    const [h, m] = (dTime.value || '18:30').split(':').map(Number);
    const eta = h * 60 + m + 25 + 4 * km;
    const etaH = Math.floor(eta / 60); // баг: нет перехода через полночь (% 24)
    if (etaH >= 24) arm('eta-midnight');

    // бонусы
    const spend = Math.max(0, intOf(oBonus)); // баг: нет проверки баланса
    if (spend > BONUS_BALANCE) arm('bonus-over');
    const goods = afterGift - disc + fee;
    const toPay = goods - spend;
    const cashback = Math.round(goods * 0.05); // баг: кешбэк только с суммы, оплаченной деньгами
    if (spend > 0 && cashback !== Math.round(toPay * 0.05)) arm('cashback-base');

    // скинуться
    const people = Math.max(0, intOf(oPeople));
    const per = Math.floor(toPay / people); // баги: округление вниз и деление на ноль
    if (people === 0) arm('split-zero');
    if (people > 0 && toPay > 0 && toPay % people !== 0) arm('split-round');

    // вывод
    $('#dSub').textContent = rub(sub);
    $('#dPaidKm').textContent = paidKm;
    $('#dFee').textContent = rub(fee);
    $('#dEta').textContent = `${String(etaH).padStart(2, '0')}:${String(eta % 60).padStart(2, '0')}`;

    $('#oCount').textContent = num(count);
    $('#oSub').textContent = rub(sub);
    $('#oGiftRow').hidden = gift === 0;
    $('#oGift').textContent = rub(-gift);
    $('#oDiscRow').hidden = disc === 0;
    $('#oDisc').textContent = rub(-disc);
    $('#oFee').textContent = rub(fee);
    $('#oSpend').textContent = rub(-spend);
    $('#oPay').textContent = rub(toPay);
    $('#oLeft').textContent = num(BONUS_BALANCE - spend);
    $('#oCash').textContent = num(cashback);
    $('#oPer').textContent = rub(per);
    $('#oTogether').textContent = people === 0 ? '—' : rub(per * people);
    $('#badge').textContent = num(count);
  }

  oItems.addEventListener('change', e => {
    const input = e.target.closest('input');
    if (!input) return;
    const it = items[Number(input.closest('.item').dataset.i)];
    const v = parseFloat(input.value.replace(',', '.'));
    it.qty = v > 0 ? v : 1; // баг: дробное количество принимается
    if (!Number.isInteger(it.qty)) arm('qty-fraction');
    renderOrder();
  });
  oItems.addEventListener('click', e => {
    if (!e.target.closest('[data-del]')) return;
    items.splice(Number(e.target.closest('.item').dataset.i), 1);
    renderOrder();
  });
  [dKm, dTime, oBonus, oPeople].forEach(el => el.addEventListener('input', () => renderOrder({ keepItems: true })));

  let toastTimer;
  function siteToast(text) {
    const t = $('#siteToast');
    t.textContent = text;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 2400);
  }

  // --- Крупный шрифт
  $('#bigText').addEventListener('click', e => {
    const on = !document.body.classList.contains('big-text');
    document.body.classList.toggle('big-text', on); // баг: вёрстка не рассчитана на крупный шрифт
    if (on) arm('big-text');
    e.currentTarget.setAttribute('aria-pressed', String(on));
  });

  // --- Тема: баг виден, когда включена тёмная тема (theme.js)
  document.addEventListener('themechange', e => { if (e.detail === 'dark') arm('theme-rules'); });
  if (document.documentElement.dataset.theme === 'dark') arm('theme-rules');

  $('#year').textContent = new Date().getFullYear();
  renderCalc();
  renderBuilder();
  renderOrder();

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
      level: 2, session: state.sessionId, name: displayName(), event,
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
          <h3>Сейчас здесь всё посчитано правильно</h3>
          <p class="pop-text">Выключи режим охоты, подбери такие числа, при которых расчёт ломается, и проверь его по правилам «Как мы считаем».</p>`);
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
        </details>` : '<p>Все баги найдены. Расчёты «Корж. Праздник» теперь можно чинить!</p>'}
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
