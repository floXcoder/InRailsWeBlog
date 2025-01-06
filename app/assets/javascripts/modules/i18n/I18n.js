import {Locales} from '@js/modules/i18n/Locales';
import {MissingTranslation} from '@js/modules/i18n/MissingTranslation';
import {Pluralization} from '@js/modules/i18n/Pluralization';

import {createTranslationOptions} from '@js/modules/i18n/helpers/createTranslationOptions';
import {lookup} from '@js/modules/i18n/helpers/lookup';
import {interpolate} from '@js/modules/i18n/helpers/interpolate';
import {propertyFlatList} from '@js/modules/i18n/helpers/propertyFlatList';
import {getFullScope} from '@js/modules/i18n/helpers/getFullScope';
import {inferType} from '@js/modules/i18n/helpers/inferType';
import {isSet} from '@js/modules/i18n/helpers/isSet';
import {pluralize} from '@js/modules/i18n/helpers/pluralize';
import {get} from '@js/modules/i18n/helpers/get';
import {has} from '@js/modules/i18n/helpers/has';
import {set} from '@js/modules/i18n/helpers/set';

// var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
//     function adopt(value) {
//         return value instanceof P ? value : new P(function (resolve) {
//             resolve(value);
//         });
//     }
//
//     return new (P || (P = Promise))(function (resolve, reject) {
//         function fulfilled(value) {
//             try {
//                 step(generator.next(value));
//             } catch (e) {
//                 reject(e);
//             }
//         }
//
//         function rejected(value) {
//             try {
//                 step(generator['throw'](value));
//             } catch (e) {
//                 reject(e);
//             }
//         }
//
//         function step(result) {
//             result.done ? resolve(result.value) : adopt(result.value)
//                 .then(fulfilled, rejected);
//         }
//
//         step((generator = generator.apply(thisArg, _arguments || [])).next());
//     });
// };

const DEFAULT_I18N_OPTIONS = {
    defaultLocale: 'en',
    availableLocales: ['en'],
    locale: 'en',
    defaultSeparator: '.',
    placeholder: /(?:\{\{|%\{)(.*?)(?:\}\}?)/gm,
    enableFallback: false,
    missingBehavior: 'message',
    missingTranslationPrefix: '',
    missingPlaceholder: (_i18n, placeholder) => `[missing "${placeholder}" value]`,
    nullPlaceholder: (i18n, placeholder, message, options) => i18n.missingPlaceholder(i18n, placeholder, message, options),
    transformKey: (key) => key,
};

export class I18n {
    constructor(translations = {}, options = {}) {
        this._locale = DEFAULT_I18N_OPTIONS.locale;
        this._defaultLocale = DEFAULT_I18N_OPTIONS.defaultLocale;
        this._version = 0;
        this.onChangeHandlers = [];
        this.translations = {};
        this.availableLocales = [];
        this.t = this.translate;
        this.p = pluralize;
        // this.l = this.localize;
        const {
            locale,
            enableFallback,
            missingBehavior,
            missingTranslationPrefix,
            missingPlaceholder,
            nullPlaceholder,
            defaultLocale,
            defaultSeparator,
            placeholder,
            transformKey,
        } = {...DEFAULT_I18N_OPTIONS, ...options};
        this.locale = locale;
        this.defaultLocale = defaultLocale;
        this.defaultSeparator = defaultSeparator;
        this.enableFallback = enableFallback;
        this.locale = locale;
        this.missingBehavior = missingBehavior;
        this.missingTranslationPrefix = missingTranslationPrefix;
        this.missingPlaceholder = missingPlaceholder;
        this.nullPlaceholder = nullPlaceholder;
        this.placeholder = placeholder;
        this.pluralization = new Pluralization(this);
        this.locales = new Locales(this);
        this.missingTranslation = new MissingTranslation(this);
        this.transformKey = transformKey;
        this.interpolate = interpolate;
        this.store(translations);
    }

    store(translations) {
        const map = propertyFlatList(translations);
        map.forEach((path) => set(this.translations, path, get(translations, path)));
        this.hasChanged();
    }

    get locale() {
        return this._locale || this.defaultLocale || 'en';
    }

    set locale(newLocale) {
        if (typeof newLocale !== 'string') {
            throw new Error(`Expected newLocale to be a string; got ${inferType(newLocale)}`);
        }
        const changed = this._locale !== newLocale;
        this._locale = newLocale;
        if (changed) {
            this.hasChanged();
        }
    }

    get defaultLocale() {
        return this._defaultLocale || 'en';
    }

    set defaultLocale(newLocale) {
        if (typeof newLocale !== 'string') {
            throw new Error(`Expected newLocale to be a string; got ${inferType(newLocale)}`);
        }
        const changed = this._defaultLocale !== newLocale;
        this._defaultLocale = newLocale;
        if (changed) {
            this.hasChanged();
        }
    }

    translate(scope, options = {}) {
        options = {...options};
        const translationOptions = createTranslationOptions(this, scope, options);
        let translation;
        const hasFoundTranslation = translationOptions.some((translationOption) => {
            if (isSet(translationOption.scope)) {
                translation = lookup(this, translationOption.scope, options);
            } else if (isSet(translationOption.message)) {
                translation = translationOption.message;
            }
            return translation !== undefined && translation !== null;
        });
        if (!hasFoundTranslation) {
            return this.missingTranslation.get(scope, options);
        }
        if (typeof translation === 'string') {
            translation = this.interpolate(this, translation, options);
        } else if (typeof translation === 'object' &&
            translation &&
            isSet(options.count)) {
            translation = pluralize({
                i18n: this,
                count: options.count || 0,
                scope: translation,
                options,
                baseScope: getFullScope(this, scope, options),
            });
        }
        if (options && translation instanceof Array) {
            translation = translation.map((entry) => typeof entry === 'string'
                ? interpolate(this, entry, options)
                : entry);
        }
        return translation;
    }

    // withLocale(locale, callback) {
    //     return __awaiter(this, void 0, void 0, function* () {
    //         const originalLocale = this.locale;
    //         try {
    //             this.locale = locale;
    //             yield callback();
    //         } finally {
    //             this.locale = originalLocale;
    //         }
    //     });
    // }

    update(path, override, options = {strict: false}) {
        if (options.strict && !has(this.translations, path)) {
            throw new Error(`The path "${path}" is not currently defined`);
        }
        const currentNode = get(this.translations, path);
        const currentType = inferType(currentNode);
        const overrideType = inferType(override);
        if (options.strict && currentType !== overrideType) {
            throw new Error(`The current type for "${path}" is "${currentType}", but you're trying to override it with "${overrideType}"`);
        }
        let newNode;
        if (overrideType === 'object') {
            newNode = {...currentNode, ...override};
        } else {
            newNode = override;
        }
        set(this.translations, path, newNode);
        this.hasChanged();
    }

    onChange(callback) {
        this.onChangeHandlers.push(callback);
        return () => {
            this.onChangeHandlers.splice(this.onChangeHandlers.indexOf(callback), 1);
        };
    }

    get version() {
        return this._version;
    }

    get(scope) {
        return lookup(this, scope);
    }

    runCallbacks() {
        this.onChangeHandlers.forEach((callback) => callback(this));
    }

    hasChanged() {
        this._version += 1;
        this.runCallbacks();
    }
}
