// I18n-js package is over-bloated
import {I18n} from '@js/modules/i18n/I18n';

let localeTranslations = [];
const localeTranslationsElement = document.getElementById('translations');
if (localeTranslationsElement && !!localeTranslationsElement.innerText) {
    localeTranslations = JSON.parse(localeTranslationsElement.innerText);
}

const i18n = new I18n(localeTranslations);

i18n.defaultLocale = window.defaultLocale;
i18n.locale = window.locale;
i18n.availableLocales = window.locales;

export default i18n;
