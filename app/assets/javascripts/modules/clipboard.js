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

    // Clipboard event
    var ClipboardManager = (function ($) {
        var _model = {
            $clipboardInput: null,
            callback: null
        };

        var _focusHiddenArea = function () {
            _model.$clipboardInput.val('');
            _model.$clipboardInput.focus().select();
        };

        var _pasteByEvent = function (event) {
            event.preventDefault();
            var clipboardData = event.originalEvent.clipboardData;
            if(_model.callback) {
                _model.callback(clipboardData.getData('text/html'));
            }
        };

        var initialize = function (callback) {
            _model.$clipboardInput = $('#clipboard');
            _model.callback = callback;

            $(document).keydown(function (event) {
                if (!event.ctrlKey) {
                    return;
                }

                if ($(event.target).is('input:visible,textarea:visible') || $(event.target).hasClass('note-editable')) {
                    return;
                }

                // Abort if it looks like they've selected some text
                if (window.getSelection && !$.isEmpty(window.getSelection().toString())) {
                    return;
                }
                if (document.selection && !$.isEmpty(document.selection.createRange().text)) {
                    return;
                }

                if (event.ctrlKey && (event.keyCode == 86 || event.keyCode == 118)) {
                    _focusHiddenArea();
                }
            });

            $(document).keyup(function (event) {
                if ($(event.target).is('#clipboard')) {
                    return $('#clipboard').val('');
                }
            });

            if(_model.$clipboardInput.length) {
                _model.$clipboardInput.on('paste', _pasteByEvent);
            }

            //['cut', 'copy', 'paste'].forEach(function (event) {
            //    document.addEventListener(event, function (e) {
            //        standardClipboardEvent(event, e);
            //        focusHiddenArea();
            //        e.preventDefault();
            //    });
            //});
        };

        return {
            initialize: initialize
        };
    })($);

    return ClipboardManager;
}));
