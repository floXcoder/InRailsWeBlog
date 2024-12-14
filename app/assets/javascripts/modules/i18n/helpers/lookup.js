import {isSet} from '@js/modules/i18n/helpers/isSet';
import {getFullScope} from '@js/modules/i18n/helpers/getFullScope';
import {inferType} from '@js/modules/i18n/helpers/inferType';
import {get} from '@js/modules/i18n/helpers/get';

export function lookup(i18n, scope, options = {}) {
    options = {...options};
    const locale = 'locale' in options ? options.locale : i18n.locale;
    const localeType = inferType(locale);
    const locales = i18n.locales
        .get(localeType === 'string' ? locale : typeof locale)
        .slice();
    scope = getFullScope(i18n, scope, options)
        .split(i18n.defaultSeparator)
        .map((component) => i18n.transformKey(component))
        .join('.');
    const entries = locales.map((l) => get(i18n.translations, [l, scope].join('.')));
    entries.push(options.defaultValue);
    return entries.find((entry) => isSet(entry));
}
