'use strict';

require('../common');

// Init select
$('#user_age').material_select();
$('#user_country').material_select();

// Check user image size
$('input[id^="user_picture_attributes_image"], input[id^="user_picture_attributes_remote_image_url"]').bind('change', function () {
    if($.isEmpty(this.files)) {
        return;
    }

    var sizeInMegabytes = this.files[0].size / (1024 * 1024);
    if (sizeInMegabytes * 1000000 > window.parameters.image_size) {
        Materialize.toast(I18n.t('js.picture.model.errors.text'));

        $(this).val('');
    }
});
