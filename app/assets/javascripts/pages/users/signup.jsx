'use strict';

import '../full-page';

$('#user_professional_type').material_select();

$('#connection-pro').click((event) => {
    event.preventDefault();

    if ($('.connection-pro-type').is(':visible')) {
        $('#user_professional').val(0);
        $('.connection-pro-type').hide();
        $('#user_professional_type').prop('required', false);
    } else {
        $('#user_professional').val(1);
        $('.connection-pro-type').show();
        $('#user_professional_type').prop('required', true);
    }
});
