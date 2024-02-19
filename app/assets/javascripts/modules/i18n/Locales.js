export const defaultLocaleResolver = (i18n, locale) => {
    const locales = [];
    const list = [];
    locales.push(locale);
    if (!locale) {
        locales.push(i18n.locale);
    }
    if (i18n.enableFallback) {
        locales.push(i18n.defaultLocale);
    }
    locales
        .filter(Boolean)
        .map((entry) => entry.toString())
        .forEach(function (currentLocale) {
            if (!list.includes(currentLocale)) {
                list.push(currentLocale);
            }
            if (!i18n.enableFallback) {
                return;
            }
            const codes = currentLocale.split('-');
            if (codes.length === 3) {
                list.push(`${codes[0]}-${codes[1]}`);
            }
            list.push(codes[0]);
        });
    return [...new Set(list)];
};

export class Locales {
    constructor(i18n) {
        this.i18n = i18n;
        this.registry = {};
        this.register('default', defaultLocaleResolver);
    }

    register(locale, localeResolver) {
        if (typeof localeResolver !== 'function') {
            const result = localeResolver;
            localeResolver = (() => result);
        }
        this.registry[locale] = localeResolver;
    }

    get(locale) {
        let locales = this.registry[locale] ||
            this.registry[this.i18n.locale] ||
            this.registry.default;
        if (typeof locales === 'function') {
            locales = locales(this.i18n, locale);
        }
        if (!(locales instanceof Array)) {
            locales = [locales];
        }
        return locales;
    }
}
