'use strict';

// Current version: 0.8.10

// import 'summernote/dist/summernote-lite';
// For now, use local summernote to correct errors:
// - Air popover not display
// - fromOffsetPath: current not defined for the last undo
// - Improve pasteHTML
// - Change dropdownButtonContents to use ui icon method
import './summernote/summernote-lite';

import 'summernote/dist/lang/summernote-fr-FR';

import '@dsvllc/summernote-image-attributes';
import '@dsvllc/summernote-image-attributes/lang/fr-FR';

import SanitizePaste from './sanitizePaste';

$.extend($.summernote.options, {
    cleanParseContent: true,
    advice: true,
    secret: true,
    icons: {
        'alignLeft': 'format_align_left',
        'alignCenter': 'format_align_center',
        'alignRight': 'format_align_right',
        'alignJustify': 'format_align_justify',
        'arrowsAlt': 'fullscreen',
        'rowBelow': 'expand_more',
        'colBefore': 'chevron_left',
        'colAfter': 'chevron_right',
        'rowAbove': 'expand_less',
        'rowRemove': 'more_horiz',
        'colRemove': 'more_vert',
        'bold': 'format_bold',
        'caret': 'arrow_drop_down',
        'circle': 'arrow_drop_down_circle',
        'code': 'code',
        'close': 'close',
        'eraser': 'format_clear',
        'font': 'font_download',
        'frame': 'filter_frames',
        'italic': 'format_italic',
        'indent': 'format_indent_increase',
        'link': 'link',
        'magic': 'text_fields',
        'menuCheck': 'check_circle',
        'minus': 'minimize',
        'unlink': 'link_off',
        'orderedlist': 'format_list_numbered',
        'outdent': 'format_indent_decrease',
        'pencil': 'create',
        'picture': 'insert_photo',
        'question': 'help',
        'redo': 'redo',
        'square': 'crop_square',
        'strikethrough': 'format_strikethrough',
        'superscript': 'vertical_align_top',
        'subscript': 'vertical_align_bottom',
        'table': 'border_all',
        'textHeight': 'format_line_spacing',
        'trash': 'delete',
        'underline': 'format_underlined',
        'undo': 'undo',
        'unorderedlist': 'format_list_bulleted',
        'video': 'video_library'
    },
    popover: {
        image: [
            ['custom', ['imageAttributes']],
            ['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
            ['float', ['floatLeft', 'floatRight', 'floatNone']],
            ['remove', ['removeMedia']]
        ],
    },
    imageAttributesIcon: '<span class="material-icons">create</span>',
    imageAttributesRemoveEmpty: true,
    imageAttributesDisableImageSource: true,
    imageAttributesDisableImageTitle: true,
    imageAttributesDisableImageAltText: false,
    imageAttributesDisableImageDimensions: true,
    imageAttributesDisableAttributes: true,
    imageAttributesDisableAttributesClass: true,
    imageAttributesDisableAttributesStyle: true,
    imageAttributesDisableAttributesRole: true,
    imageAttributesDisableLink: true,
    imageAttributesDisableLinkUrl: true,
    imageAttributesDisableLinkTarget: true,
    imageAttributesDisableUpload: true,
});

const ui = $.summernote.ui;
ui.icon = function (iconClassName, tagName) {
    return '<span class="material-icons">' + iconClassName + '</span>';
};

$.extend($.summernote.options.keyMap.pc, {
    'CTRL+ENTER': 'Save'
});

$.extend($.summernote.options.keyMap.mac, {
    'CMD+ENTER': 'Save'
});

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

// $.extend($.summernote.plugins, {
//     'cleaner': function (context) {
//         const ui = $.summernote.ui;
//         const options = context.options;
//         const $note = context.layoutInfo.note;
//
//         if (options.cleanParseContent) {
//             context.memo('button.cleaner', function () {
//                 const button = ui.button({
//                     contents: '<i class="material-icons">clear</i>',
//                     container: options.container,
//                     tooltip: I18n.t('js.editor.buttons.cleaner'),
//                     click: function () {
//                         if ($note.summernote('createRange').toString()) {
//                             $note.summernote('pasteHTML', $note.summernote('createRange').toString());
//                         } else {
//                             let formattedCode = SanitizePaste.parse($note.summernote('code'));
//                             formattedCode = formattedCode.replace(/<\/li><br\s?\/?><li/g, '</li><li');
//                             formattedCode = formattedCode.replace(/<ul><br\s?\/?><li/g, '<ul><li');
//                             formattedCode = formattedCode.replace(/<\/li><br\s?\/?><\/ul>/g, '</li></ul>');
//                             $note.summernote('code', formattedCode);
//                         }
//                         context.triggerEvent('change', $note.summernote('code'));
//                     }
//                 });
//
//                 return button.render();
//             });
//         }
//     }
// });

$.extend($.summernote.plugins, {
    'advice': function (context) {
        const ui = $.summernote.ui;
        const options = context.options;
        const $note = context.layoutInfo.note;

        if (options.advice) {
            context.memo('button.advice', function () {
                const button = ui.button({
                    contents: '<i class="material-icons">thumb_up</i>',
                    container: options.container,
                    tooltip: I18n.t('js.editor.buttons.advice'),
                    click: function (event) {
                        event.preventDefault();
                        applyFormat(context, 'advice');
                        context.triggerEvent('change', $note.summernote('code'));
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
        const $note = context.layoutInfo.note;

        if (options.secret) {
            context.memo('button.secret', function () {
                const button = ui.button({
                    contents: '<i class="material-icons">security</i>',
                    container: options.container,
                    tooltip: I18n.t('js.editor.buttons.secret'),
                    click: function (event) {
                        event.preventDefault();
                        applyFormat(context, 'secret');
                        context.triggerEvent('change', $note.summernote('code'));
                    }
                });

                return button.render();
            });
        }
    }
});
