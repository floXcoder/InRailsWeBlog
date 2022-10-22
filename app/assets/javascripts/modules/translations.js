'use strict';

import I18n from './i18n';


let localeTranslations = [];
const localeTranslationsElement = document.getElementById('translations');
if (localeTranslationsElement) {
    localeTranslations = JSON.parse(localeTranslationsElement.innerText);
}

// const i18n = new I18n();
// i18n.store(localeTranslations);
// i18n.defaultLocale = window.defaultLocale;
// i18n.locale = window.locale;
// // window.I18n = i18n;

I18n.defaultLocale = window.defaultLocale;
I18n.locale = window.locale;
I18n.translations = localeTranslations;
window.I18n = I18n;

export default I18n;
