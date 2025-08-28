let currentLang = 'en';

async function loadLanguage(lang) {
  try {
    const res = await fetch(`libs/lang/${lang}.json?v=${Date.now()}`);
    // добавил ?v=... чтобы кеш не мешал при тестах
    const translations = await res.json();

    // функция для перевода одного элемента
    function translateElement(el) {
      const keys = el.getAttribute('data-i18n').split('.');
      let text = keys.reduce((obj, key) => obj?.[key], translations);

      if (!text) return; // если перевода нет — пропускаем

      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        if (el.hasAttribute('placeholder')) el.placeholder = text;
        else el.value = text;
      } else if (el.tagName === 'IMG') {
        if (el.hasAttribute('alt')) el.alt = text;
        if (el.hasAttribute('title')) el.title = text;
      } else {
        el.innerText = text;
      }
    }

    // обычные элементы
    document.querySelectorAll('[data-i18n]').forEach(translateElement);

    // поддержка swiper-дубликатов
    document.querySelectorAll('.swiper-slide-duplicate [data-i18n]').forEach(translateElement);
  } catch (err) {
    console.error('Ошибка загрузки перевода:', err);
  }
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  loadLanguage(lang);
}

// загрузка при старте
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('lang') || 'en';
  setLanguage(savedLang);

  // если используешь Swiper — обновляем перевод после инициализации
  if (typeof Swiper !== 'undefined') {
    document.querySelectorAll('.swiper').forEach((swiperEl) => {
      if (swiperEl.swiper) {
        swiperEl.swiper.on('slideChange', () => loadLanguage(currentLang));
      }
    });
  }
});
