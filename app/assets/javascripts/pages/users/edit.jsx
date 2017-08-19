'use strict';

import '../common';

// Init select
$('#user_country').material_select();

// Check user image size
$('input[id^="user_picture_attributes_image"], input[id^="user_picture_attributes_remote_image_url"]').bind('change', (event) => {
    if ($.isEmpty(event.target.files)) {
        return;
    }

    const size_in_megabytes = event.target.files[0].size / (1024 * 1024);
    if (size_in_megabytes * 1000000 > window.settings.image_size) {
        Notification.error(I18n.t('js.picture.model.errors.text'));
        $(event.target).val('');
    }
});

$('#user_birth_date').pickadate({
    format: I18n.t('js.date.formats.date'),
    formatSubmit: I18n.t('js.date.formats.date'),
    closeOnSelect: true,
    closeOnClear: true,
    firstDay: 1,
    selectMonths: true,
    selectYears: 80,
    labelMonthPrev: I18n.t('js.date.ranges.previous_month'),
    labelMonthNext: I18n.t('js.date.ranges.next_month'),
    labelMonthSelect: I18n.t('js.date.ranges.select_month'),
    labelYearSelect: I18n.t('js.date.ranges.select_year'),
    monthsFull: I18n.t('js.date.month_names'),
    monthsShort: I18n.t('js.date.abbr_month_names'),
    weekdaysFull: I18n.t('js.date.day_names'),
    weekdaysShort: I18n.t('js.date.abbr_day_names'),
    weekdaysLetter: I18n.t('js.date.letter_day_names'),
    today: I18n.t('js.date.ranges.today_short'),
    clear: I18n.t('js.date.buttons.clear'),
    close: I18n.t('js.date.buttons.close')
});

// import '../common';
//
// // Init select
// $('#user_age').material_select();
// $('#user_country').material_select();
//
// // Check user image size
// $('input[id^="user_picture_attributes_image"], input[id^="user_picture_attributes_remote_image_url"]').bind('change', function () {
//     if($.isEmpty(this.files)) {
//         return;
//     }
//
//     const sizeInMegabytes = this.files[0].size / (1024 * 1024);
//     if (sizeInMegabytes * 1000000 > window.settings.image_size) {
//         Notification.error(I18n.t('js.picture.model.errors.text'));
//
//         $(this).val('');
//     }
// });
