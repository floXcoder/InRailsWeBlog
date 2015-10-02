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

    var SkyformValidation = require('./skyform');

    var LogInForm = (function ($) {

        var initialize = function () {

            // Validation
            $("form#login_user").validate({
                // Rules for form validation
                rules:
                {
                    'user[login]':
                    {
                        required: true,
                        remote: {
                            url: '/users/id',
                            type: 'get',
                            data:
                            {
                                login: function()
                                {
                                    return $('#user_login').val();
                                }
                            }
                        }
                    },
                    'user[password]':
                    {
                        required: true
                    }
                },

                // Messages for form validation
                messages:
                {
                    'user[login]':
                    {
                        required: I18n.t('js.user.form.errors.login.required'),
                        remote: $.validator.format("{0} " + I18n.t('js.user.form.errors.login.invalid'))
                    },
                    'user[password]':
                    {
                        required: I18n.t('js.user.form.errors.password.required')
                    }
                },

                validClass: SkyformValidation.validClass(),
                errorClass: SkyformValidation.errorClass(),
                errorElement: SkyformValidation.errorElement(),
                errorPlacement: SkyformValidation.errorPlacement,
                highlight: SkyformValidation.highlight,
                unhighlight: SkyformValidation.unhighlight
            });
        };

        return {
            initialize: initialize
        };

    })($);

    return LogInForm;
}));




