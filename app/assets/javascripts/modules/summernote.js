'use strict';

// import 'summernote/dist/summernote-lite';
// For now, use local summernote to correct errors:
// - Air popover not display
// - fromOffsetPath: current not defined for the last undo
// - Improve pasteHTML
// - Comment method to avoid duplication history when pasting
import './summernote/summernote-lite';

import 'summernote/dist/lang/summernote-fr-FR';

import SanitizePaste from './sanitizePaste';

$.extend($.summernote.options, {
    cleanParseContent: true,
    advice: true,
    secret: true,
    // TODO: override icons
    // icons: {
    //     'bold': 'format_bold'
    // }
});

$.extend($.summernote.options.keyMap.pc, {
    'CTRL+ENTER': 'save'
});

$.extend($.summernote.options.keyMap.mac, {
    'CMD+ENTER': 'save'
});

// const ui = $.summernote.ui;
// ui.icon = function (iconClassName, tagName) {
//     return '<span class="material-icons">' + iconClassName + '</span>';
// };

const applyFormat = (context, formatName) => {
    let $node = $(context.invoke('restoreTarget'));
    if ($node.length === 0) {
        $node = $(document.getSelection().focusNode.parentElement, '.note-editable');
    }

    if ($node.hasClass('note-editable') || $node.hasClass('note-editing-area')) {
        return;
    }

    $node.toggleClass(formatName);
};

$.extend($.summernote.plugins, {
    'cleaner': function (context) {
        const ui = $.summernote.ui;
        const $note = context.layoutInfo.note;
        const options = context.options;

        if (options.cleanParseContent) {
            context.memo('button.cleaner', function () {
                const button = ui.button({
                    contents: '<i class="material-icons">format_clear</i>',
                    container: options.container,
                    tooltip: 'Clean content',
                    click: function () {
                        if ($note.summernote('createRange').toString()) {
                            $note.summernote('pasteHTML', $note.summernote('createRange').toString());
                        } else {
                            let formattedCode = SanitizePaste.parse($note.summernote('code'));
                            formattedCode = formattedCode.replace(/<\/li><br\s?\/?><li/g, '</li><li');
                            formattedCode = formattedCode.replace(/<ul><br\s?\/?><li/g, '<ul><li');
                            formattedCode = formattedCode.replace(/<\/li><br\s?\/?><\/ul>/g, '</li></ul>');
                            $note.summernote('code', formattedCode);
                        }
                    }
                });

                return button.render();
            });
        }
    }
});

$.extend($.summernote.plugins, {
    'advice': function (context) {
        const ui = $.summernote.ui;
        const options = context.options;

        if (options.advice) {
            context.memo('button.advice', function () {
                const button = ui.button({
                    contents: '<i class="material-icons">thumb_up</i>',
                    container: options.container,
                    tooltip: 'Advice',
                    click: function (event) {
                        event.preventDefault();
                        applyFormat(context, 'advice');
                    }
                });

                return button.render();
            });
        }
    }
});

$.extend($.summernote.plugins, {
    'secret': function (context) {
        const ui = $.summernote.ui;
        const options = context.options;

        if (options.secret) {
            context.memo('button.secret', function () {
                const button = ui.button({
                    contents: '<i class="material-icons">security</i>',
                    container: options.container,
                    tooltip: 'Secret',
                    click: function (event) {
                        event.preventDefault();
                        applyFormat(context, 'secret');
                    }
                });

                return button.render();
            });
        }
    }
});
