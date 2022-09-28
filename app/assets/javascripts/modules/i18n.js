'use strict';

import {
    I18n
} from 'i18n-js';


const i18n = new I18n();

let localeTranslations = [];
const localeTranslationsElement = document.getElementById('translations');
if (localeTranslationsElement) {
    localeTranslations = JSON.parse(localeTranslationsElement.innerText);
}

i18n.store(localeTranslations);
i18n.defaultLocale = window.defaultLocale;
i18n.locale = window.locale;
// window.I18n = i18n;

export default i18n;
