'use strict';

window.ParsleyConfig = {
    trigger: 'blur',
    classHandler: function (element) {
        return element.$element.parent();
    }
};

// ParsleyConfig undefined if import syntax is used
require('parsleyjs');
require('parsleyjs/dist/i18n/fr.js');

window.Parsley.setLocale(I18n.locale);

// Validator: data-parsley-duration-range
// Value: '12:12'
// Min in minutes
// Max in hours
window.Parsley
    .addValidator('durationRange', {
        requirementType: 'string',
        validateString: function (value, min, max) {
            const ref = value.split(':');
            const hour = ref[0];
            const minute = ref[1];
            const sec_duration = ((parseInt(hour) * 60 + parseInt(minute)) * 60);

            return !!(sec_duration >= min * 60 && sec_duration < max * 3600);
        },
        messages: {
            en: I18n.t('js.rideable.errors.duration', {min: '%s', max: '%s'}),
            fr: I18n.t('js.rideable.errors.duration', {min: '%s', max: '%s'})
        }
    });


// Validator: data-parsley-date-format
// Value: '2012-12-12'
window.Parsley
    .addValidator('dateFormat', {
        requirementType: 'string',
        validateString: function (value) {
            return !!/\d{1,4}-\d{1,2}-\d{1,2}/.test(value);
        },
        messages: {
            en: I18n.t('js.form.errors.date'),
            fr: I18n.t('js.form.errors.date')
        }
    });

// Validator: data-parsley-distance-range
// Value: 1236
// Min in km
// Max in km
window.Parsley
    .addValidator('distanceRange', {
        requirementType: 'number',
        validateNumber: function (distance, min, max) {
            distance = distance / 1000;
            return !!(distance >= min && distance < max);
        },
        messages: {
            en: I18n.t('js.rideable.errors.distance.range', {min: '%s', max: '%s'}),
            fr: I18n.t('js.rideable.errors.distance.range', {min: '%s', max: '%s'})
        }
    });

// Validator: data-parsley-ways-range
// Value: 1236
// Min in km
// Max in km
window.Parsley
    .addValidator('waysRange', {
        requirementType: 'number',
        validateNumber: function (waysNumber, min, max) {
            return !!(waysNumber >= min && waysNumber < max);
        },
        messages: {
            en: I18n.t('js.rideable.errors.ways_number.range', {min: '%s', max: '%s'}),
            fr: I18n.t('js.rideable.errors.ways_number.range', {min: '%s', max: '%s'})
        }
    });

// Validator: data-parsley-ways-length
// Value: 1236
// Min in km
// Max in km
window.Parsley
    .addValidator('waysLength', {
        requirementType: 'number',
        validateNumber: function (wayLength, min, max) {
            return !!(wayLength >= min && wayLength < max);
        },
        messages: {
            en: I18n.t('js.rideable.errors.ways_length.range', {min: '%s', max: '%s'}),
            fr: I18n.t('js.rideable.errors.ways_length.range', {min: '%s', max: '%s'})
        }
    });

// Validator: data-parsley-phone-number
// Value: '0606060606' or '06 06 06 06 06' or '06.06.06.06.06' or '06-06-06-06-06'
window.Parsley
    .addValidator('phoneNumber', {
        requirementType: 'string',
        validateString: function (value) {
            return !!/^0[1-5|8-9]([-. ]?[0-9]{2}){4}$/.test(value.trim());
        },
        messages: {
            en: I18n.t('js.form.errors.phone_number'),
            fr: I18n.t('js.form.errors.phone_number')
        }
    });

window.Parsley
    .addValidator('mobilePhoneNumber', {
        requirementType: 'string',
        validateString: function (value) {
            return !!/^0[6-7]([-. ]?[0-9]{2}){4}$/.test(value.trim());
        },
        messages: {
            en: I18n.t('js.form.errors.mobile_number'),
            fr: I18n.t('js.form.errors.mobile_number')
        }
    });

// Validator: data-parsley-postcode
// Value: '73100' or '73 100'
window.Parsley
    .addValidator('postcode', {
        requirementType: 'string',
        validateString: function (value) {
            return !!/^\d{2} *\d{3}$/.test(value.trim());
        },
        messages: {
            en: I18n.t('js.form.errors.postcode'),
            fr: I18n.t('js.form.errors.postcode')
        }
    });

// Validator: data-parsley-siret
// Value: '73100' or '73 100'
window.Parsley
    .addValidator('siret', {
        requirementType: 'string',
        validateString: function (value) {
            return !!/^\d{3} *\d{3} *\d{3} *\d{5}$/.test(value.trim());
        },
        messages: {
            en: I18n.t('js.form.errors.siret'),
            fr: I18n.t('js.form.errors.siret')
        }
    });

// Validator: data-parsley-strip-html
// Value: everything containing html tags is stripped
window.Parsley
    .addValidator('stripHtml', {
        requirementType: 'string',
        validateString: function (value, minCount, maxCount) {
            const strippedValue = value.replace(/<(?:.|\n)*?>/gm, '').length;

            return !!(strippedValue >= minCount && strippedValue < maxCount);
        },
        messages: {
            en: I18n.t('js.form.errors.stripped_text_size', {minCount: '%s', maxCount: '%s'}),
            fr: I18n.t('js.form.errors.stripped_text_size', {minCount: '%s', maxCount: '%s'})
        }
    });
