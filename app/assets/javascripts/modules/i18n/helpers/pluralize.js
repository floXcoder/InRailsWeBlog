import {isSet} from '@js/modules/i18n/helpers/isSet';
import {lookup} from '@js/modules/i18n/helpers/lookup';

export function pluralize({
                              i18n,
                              count,
                              scope,
                              options,
                              baseScope,
                          }) {
    options = {...options};
    let translations;
    let message;
    if (typeof scope === 'object' && scope) {
        translations = scope;
    } else {
        translations = lookup(i18n, scope, options);
    }
    if (!translations) {
        return i18n.missingTranslation.get(scope, options);
    }
    const pluralizer = i18n.pluralization.get(options.locale);
    const keys = pluralizer(i18n, count);
    const missingKeys = [];
    while (keys.length) {
        const key = keys.shift();
        if (isSet(translations[key])) {
            message = translations[key];
            break;
        }
        missingKeys.push(key);
    }
    if (!isSet(message)) {
        return i18n.missingTranslation.get(baseScope.split(i18n.defaultSeparator)
            .concat([missingKeys[0]]), options);
    }
    options.count = count;
    return i18n.interpolate(i18n, message, options);
}
