let currentLang = 'en';

async function loadLanguage(lang) {
  try {
    const res = await fetch(`libs/lang/${lang}.json`);
    const translations = await res.json();

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const keys = el.getAttribute('data-i18n').split('.');
      let text = keys.reduce((obj, key) => obj?.[key], translations);

      // fallback: если перевода нет, оставляем текущий текст
      if (text) el.innerText = text;
    });
  } catch (err) {
    console.error('Ошибка загрузки перевода:', err);
  }
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang); // сохраняем выбор
  loadLanguage(lang);
}

// загрузка выбранного языка при старте
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('lang') || 'en';
  setLanguage(savedLang);
});
