'use strict';

// I18n-js package is over-bloated
import {I18n} from './i18n/I18n';

let localeTranslations = [];
const localeTranslationsElement = document.getElementById('translations');
if (localeTranslationsElement?.innerText) {
    localeTranslations = JSON.parse(localeTranslationsElement.innerText);
}

const i18n = new I18n(localeTranslations);

i18n.defaultLocale = window.defaultLocale;
i18n.locale = window.locale;
i18n.translations = localeTranslations;
window.I18n = i18n;

export default i18n;
