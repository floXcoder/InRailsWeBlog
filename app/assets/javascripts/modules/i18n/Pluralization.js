import {en} from 'make-plural';

export function useMakePlural({
                                  pluralizer,
                                  includeZero = true,
                                  ordinal = false,
                              }) {
    return function (_i18n, count) {
        return [
            includeZero && count === 0 ? 'zero' : '',
            pluralizer(count, ordinal),
        ].filter(Boolean);
    };
}

export const defaultPluralizer = useMakePlural({
    pluralizer: en,
    includeZero: true,
});

export class Pluralization {
    constructor(i18n) {
        this.i18n = i18n;
        this.registry = {};
        this.register('default', defaultPluralizer);
    }

    register(locale, pluralizer) {
        this.registry[locale] = pluralizer;
    }

    get(locale) {
        return (this.registry[locale] ||
            this.registry[this.i18n.locale] ||
            this.registry['default']);
    }
}
