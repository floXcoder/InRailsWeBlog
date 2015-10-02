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

    var SignUpForm = (function ($) {

        var initialize = function () {
            // Validation
            $("form#signup_user").validate({
                // Rules for form validation
                rules: {
                    'user[pseudo]': {
                        required: true,
                        minlength: 3,
                        maxlength: 50,
                        remote: {
                            url: '/users/id',
                            type: 'get',
                            data: {
                                pseudo: function () {
                                    return $('#user_pseudo').val();
                                }
                            }
                        }
                    },
                    'user[email]': {
                        required: true,
                        email: true,
                        remote: {
                            url: '/users/id',
                            type: 'get',
                            data: {
                                email: function () {
                                    return $('#user_email').val();
                                }
                            }
                        }
                    },
                    'user[password]': {
                        required: true,
                        minlength: 6,
                        maxlength: 60
                    },
                    'user[password_confirmation]': {
                        required: true,
                        minlength: 6,
                        maxlength: 60,
                        equalTo: "#user_password"
                    },
                    terms: {
                        required: true
                    }
                },

                // Messages for form validation
                messages: {
                    'user[pseudo]': {
                        required: I18n.t('js.user.form.errors.pseudo.required'),
                        minlength: I18n.t('js.user.form.errors.pseudo.short'),
                        maxlength: I18n.t('js.user.form.errors.pseudo.long'),
                        remote: $.validator.format("{0} " + I18n.t('js.user.form.errors.pseudo.taken'))
                    },
                    'user[email]': {
                        required: I18n.t('js.user.form.errors.email.required'),
                        email: I18n.t('js.user.form.errors.email.format'),
                        remote: $.validator.format("{0} " + I18n.t('js.user.form.errors.email.taken'))
                    },
                    'user[password]': {
                        required: I18n.t('js.user.form.errors.password.required'),
                        minlength: I18n.t('js.user.form.errors.password.short'),
                        maxlength: I18n.t('js.user.form.errors.password.long')
                    },
                    'user[password_confirmation]': {
                        required: I18n.t('js.user.form.errors.password.required'),
                        minlength: I18n.t('js.user.form.errors.password.short'),
                        maxlength: I18n.t('js.user.form.errors.password.long'),
                        equalTo: I18n.t('js.user.form.errors.password.mismatch')
                    },
                    terms: {
                        required: I18n.t('js.user.form.errors.policy')
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

    return SignUpForm;
}));
