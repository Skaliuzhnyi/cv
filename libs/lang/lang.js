let currentLang = 'en';
const fadeDuration = 300; // миллисекунды для анимации

async function loadLanguage(lang) {
  try {
    const res = await fetch(`libs/lang/${lang}.json?v=${Date.now()}`);
    const translations = await res.json();

    function translateElement(el) {
      const keys = el.getAttribute('data-i18n').split('.');
      let text = keys.reduce((obj, key) => obj?.[key], translations);

      if (!text) return;

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

    document.querySelectorAll('[data-i18n]').forEach(translateElement);
    document.querySelectorAll('.swiper-slide-duplicate [data-i18n]').forEach(translateElement);
  } catch (err) {
    console.error('Ошибка загрузки перевода:', err);
  }
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);

  // Получаем все элементы с data-i18n
  const elements = document.querySelectorAll('[data-i18n]');

  // Анимация исчезновения
  elements.forEach((el) => {
    el.style.transition = `opacity ${fadeDuration}ms`;
    el.style.opacity = 0;
  });

  // Ждём окончания исчезновения, затем меняем язык и показываем элементы
  setTimeout(() => {
    loadLanguage(lang);

    elements.forEach((el) => {
      el.style.opacity = 1; // плавное появление
    });
  }, fadeDuration);

  // Скрываем мобильное меню, если оно открыто
  if (document.body.classList.contains('mobile-nav-active')) {
    document.body.classList.remove('mobile-nav-active');

    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    if (mobileToggle && mobileToggle.classList.contains('bi-x')) {
      mobileToggle.classList.remove('bi-x');
      mobileToggle.classList.add('bi-list');
    }
  }
}

// Обработчик кнопок выбора языка
document.querySelectorAll('.language-switcher button').forEach((btn) => {
  btn.addEventListener('click', () => setLanguage(btn.getAttribute('data-lang') || btn.innerText.toLowerCase()));
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  let savedLang = localStorage.getItem('lang');

  if (!savedLang) {
    const systemLang = navigator.language.slice(0, 2).toLowerCase();
    savedLang = ['en', 'de', 'ua'].includes(systemLang) ? systemLang : 'de';
  }

  setLanguage(savedLang);

  // Если используешь Swiper — обновляем перевод после инициализации
  if (typeof Swiper !== 'undefined') {
    document.querySelectorAll('.swiper').forEach((swiperEl) => {
      if (swiperEl.swiper) {
        swiperEl.swiper.on('slideChange', () => loadLanguage(currentLang));
      }
    });
  }
});
