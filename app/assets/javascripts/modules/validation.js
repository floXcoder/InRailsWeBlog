(function (root, factory) {
    if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory(require('jquery'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], function ($) {
            return (root.returnExportsGlobal = factory($));
        });
    } else {
        // Global Variables
        root.returnExportsGlobal = factory(root.$);
    }
}(this, function ($) {
    'use strict';

    window.ParsleyConfig = {
        trigger: 'blur'
    };

    require('parsleyjs');
    require('parsleyjs/dist/i18n/fr.js');

    window.Parsley.setLocale(I18n.locale);

    // Validator: data-parsley-strip-html
    // Value : everything containing html tags is stripped
    window.Parsley
        .addValidator('stripHtml', {
            requirementType: 'string',
            validateString: function(value, minCount, maxCount) {
                var strippedValue = value.replace(/<(?:.|\n)*?>/gm, '').length;

                return !!(strippedValue >= minCount && strippedValue < maxCount);
            },
            messages: {
                en: I18n.t('js.form.errors.stripped_text_size', {minCount: '%s', maxCount: '%s'}),
                fr: I18n.t('js.form.errors.stripped_text_size', {minCount: '%s', maxCount: '%s'})
            }
        });

    // Validator: data-parsley-phone-number
    // Value: '0606060606' or '06 06 06 06 06' or '06.06.06.06.06' or '06-06-06-06-06'
    window.Parsley
        .addValidator('phoneNumber', {
            requirementType: 'string',
            validateString: function(value) {
                return !!/^0[1-5]([-. ]?[0-9]{2}){4}$/.test(value.trim());
            },
            messages: {
                en: I18n.t('js.form.errors.phone_number'),
                fr: I18n.t('js.form.errors.phone_number')
            }
        });

    window.Parsley
        .addValidator('mobilePhoneNumber', {
            requirementType: 'string',
            validateString: function(value) {
                return !!/^0[6-7]([-. ]?[0-9]{2}){4}$/.test(value.trim());
            },
            messages: {
                en: I18n.t('js.form.errors.phone_number'),
                fr: I18n.t('js.form.errors.phone_number')
            }
        });
}));
