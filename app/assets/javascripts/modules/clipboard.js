'use strict';

// Clipboard event
const ClipboardManager = (function () {
    const _model = {
        clipboardInput: null,
        callback: null
    };

    const _focusHiddenArea = function () {
        _model.clipboardInput.value = '';
        _model.clipboardInput.focus();
    };

    const _pasteByEvent = function (event) {
        event.preventDefault();

        const clipboardData = event.clipboardData;

        if (_model.callback) {
            _model.callback(clipboardData.getData('text/html') || clipboardData.getData('text/plain'));
        }
    };

    const initialize = function (callback) {
        _model.clipboardInput = document.getElementById('clipboard');
        _model.callback = callback;

        document.addEventListener('keydown', (event) => {
            if (!event.ctrlKey) {
                return;
            }

            if(event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.className.includes('note-editable')) {
                return;
            }

            // Abort if it looks like they've selected some text
            if (window.getSelection && !Utils.isEmpty(window.getSelection().toString())) {
                return;
            }
            if (document.selection && !Utils.isEmpty(document.selection.createRange().text)) {
                return;
            }

            if (event.ctrlKey && (event.keyCode === 86 || event.keyCode === 118)) {
                _focusHiddenArea();
            }
        });

        // document.addEventListener('keyup', (event) => {
        //     if ($(event.target).is('#clipboard')) {
        //         return $('#clipboard').val('');
        //     }
        // });

        if (_model.clipboardInput) {
            _model.clipboardInput.addEventListener('paste', _pasteByEvent);
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
})();

export default ClipboardManager;
