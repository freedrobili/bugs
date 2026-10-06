/* =====================================================================
   Тема сайтов: светлая или тёмная. Общая для всех уровней.
   Подключается в <head> без defer, чтобы страница сразу открылась
   в нужной теме. Кнопки темы — элементы с атрибутом data-theme-toggle.
   Страницы узнают о смене темы из события «themechange».
   ===================================================================== */
(() => {
  'use strict';
  const KEY = 'korzh-theme';
  const root = document.documentElement;

  const stored = () => {
    try { return localStorage.getItem(KEY) === 'dark' ? 'dark' : 'light'; } catch { return 'light'; }
  };

  function apply(theme) {
    root.dataset.theme = theme;
    const dark = theme === 'dark';
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.setAttribute('aria-pressed', String(dark));
      if (btn.classList.contains('theme-btn')) {
        btn.textContent = dark ? '☀️' : '🌙';
        btn.setAttribute('aria-label', dark ? 'Включить светлую тему' : 'Включить тёмную тему');
      }
    });
    document.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
  }

  root.dataset.theme = stored();
  document.addEventListener('DOMContentLoaded', () => apply(stored()));
  document.addEventListener('click', e => {
    if (!e.target.closest('[data-theme-toggle]')) return;
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(KEY, next); } catch { /* хранилище недоступно */ }
    apply(next);
  });
})();
