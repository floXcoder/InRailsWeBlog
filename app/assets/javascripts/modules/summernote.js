'use strict';

import $ from 'jquery';

import './summernote/summernote-lite';

import 'summernote/dist/lang/summernote-fr-FR';
import 'summernote/dist/lang/summernote-de-DE';
import 'summernote/dist/lang/summernote-it-IT';
import 'summernote/dist/lang/summernote-es-ES';

import '../../stylesheets/components/summernote.scss';

import '@dsvllc/summernote-image-attributes';
import '@dsvllc/summernote-image-attributes/lang/fr-FR';
import '@dsvllc/summernote-image-attributes/lang/de-DE';
import '@dsvllc/summernote-image-attributes/lang/it-IT';
import '@dsvllc/summernote-image-attributes/lang/es-ES';

$.extend($.summernote.options, {
    cleanParseContent: true,
    advice: true,
    secret: true,
    icons: {
        'alignLeft': 'format_align_left',
        'alignCenter': 'format_align_center',
        'alignRight': 'format_align_right',
        'alignJustify': 'format_align_justify',
        'floatLeft': 'format_align_left',
        'floatRight': 'format_align_right',
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
        'video': 'video_library',
        'rollback': 'undo'
    },
    popover: {
        image: [
            ['custom', ['imageAttributes']],
            ['imagesize', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
            ['float', ['floatLeft', 'floatRight', 'floatNone']],
            ['remove', ['removeMedia']]
        ],
        link: [
            ['link', ['linkDialogShow', 'unlink']]
        ],
        table: [
            ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
            ['delete', ['deleteRow', 'deleteCol', 'deleteTable']]
        ],
        air: [
            ['color', ['color']],
            ['font', ['bold', 'underline', 'clear']],
            ['para', ['ul', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture']]
        ],
        code: [
            'code'
        ]
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
    imageAttributesDisableUpload: true
});

$.extend(true, $.summernote.lang, {
    'en-US': {
        style: {
            style: 'Style',
            p: 'Text',
            div: 'Text',
            b: 'Bold',
            i: 'Italic',
            u: 'Underline',
            li: 'List',
            blockquote: 'Quote',
            pre: 'Code',
            code: 'Code',
            h2: 'Title',
            h3: 'Subtitle',
            h4: 'Interline'
        }
    }
});

$.extend(true, $.summernote.lang, {
    'fr-FR': {
        style: {
            style: 'Style',
            p: 'Texte',
            div: 'Texte',
            b: 'Gras',
            i: 'Italique',
            u: 'Sous-ligné',
            li: 'Liste',
            blockquote: 'Citation',
            pre: 'Code source',
            code: 'Code source',
            h2: 'Titre',
            h3: 'Sous-titre',
            h4: 'Interligne'
        }
    }
});

$.extend(true, $.summernote.lang, {
    'de-DE': {
        style: {
            style: 'Stil',
            p: 'Text',
            div: 'Text',
            b: 'Fett',
            i: 'Kursivschrift',
            u: 'Unterstrichen',
            li: 'Liste',
            blockquote: 'Zitat',
            pre: 'Quellcode',
            code: 'Quellcode',
            h2: 'Titel',
            h3: 'Untertitel',
            h4: 'Interline'
        }
    }
});

$.extend(true, $.summernote.lang, {
    'es-ES': {
        style: {
            style: 'Estilo',
            p: 'Texto',
            div: 'Texto',
            b: 'Negrita',
            i: 'Cursiva',
            u: 'Sublimado',
            li: 'Lista',
            blockquote: 'Cita',
            pre: 'El código fuente',
            code: 'El código fuente',
            h2: 'Título',
            h3: 'Subtítulo',
            h4: 'Interlineado'
        }
    }
});

$.extend(true, $.summernote.lang, {
    'it-IT': {
        style: {
            style: 'Stile',
            p: 'Testo',
            div: 'Testo',
            b: 'In grassetto',
            i: 'Corsivo',
            u: 'Sottolineato',
            li: 'Elenco',
            blockquote: 'Preventivo',
            pre: 'Codice sorgente',
            code: 'Codice sorgente',
            h2: 'Titolo',
            h3: 'Sottotitolo',
            h4: 'Interline'
        }
    }
});

$.extend($.summernote.options.keyMap.pc, {
    'CTRL+NUM1': 'formatH2',
    'CTRL+NUM2': 'formatH3',
    'CTRL+NUM3': 'formatH4',
    'CTRL+NUM4': 'formatH4',
    'CTRL+NUM5': 'formatH4',
    'CTRL+NUM6': 'formatH4',
    'CTRL+L': 'insertUnorderedList',
    'CTRL+K': 'linkDialog.show',
    // 'CTRL+NUM0': 'removeFormat',
    'CTRL+ENTER': 'Save'
});

$.extend($.summernote.options.keyMap.mac, {
    'CMD+NUM1': 'formatH2',
    'CMD+NUM2': 'formatH3',
    'CMD+NUM3': 'formatH4',
    'CMD+NUM4': 'formatH4',
    'CMD+NUM5': 'formatH4',
    'CMD+NUM6': 'formatH4',
    'CMD+L': 'insertUnorderedList',
    'CMD+K': 'linkDialog.show',
    // 'CMD+NUM0': 'removeFormat',
    'CMD+ENTER': 'Save',
});

jQuery.fn.removeAttributes = function () {
    return this.each(function () {
        const attributes = $.map(this.attributes, function (item) {
            return item.name;
        });

        const element = $(this);
        $.each(attributes, function (i, item) {
            element.removeAttr(item);
        });
    });
}

const isPara = (node) => {
    return node && /^P|^LI|^H[1-7]/.test(node.nodeName.toUpperCase());
};

// const applyClass = (context, formatName) => {
//     let $node = $(context.invoke('restoreTarget'));
//     if ($node.length === 0) {
//         $node = $(document.getSelection().focusNode.parentElement, '.note-editable');
//     }
//
//     if ($node.hasClass('note-editable') || $node.hasClass('note-editing-area')) {
//         return;
//     }
//
//     $node.toggleClass(formatName);
// };

// const areDifferentBlockElements = (startEl, endEl) => {
//     const startElDisplay = getComputedStyle(startEl, null).display;
//     const endElDisplay = getComputedStyle(endEl, null).display;
//
//     return startElDisplay !== 'inline' && endElDisplay !== 'inline';
// };

// const isSelectionParsable = (startEl, endEl) => {
//     if (startEl.isSameNode(endEl)) {
//         return true;
//     }
//     if (areDifferentBlockElements(startEl, endEl)) {
//         return false;
//     }
//     // if they're not different block elements, then we need to check if they share a common block ancestor
//     // could do this recursively, if we want to back farther up the node chain...
//     const startElParent = startEl.parentElement;
//     const endElParent = endEl.parentElement;
//     if (startEl.isSameNode(endElParent)
//         || endEl.isSameNode(startElParent)
//         || startElParent.isSameNode(endElParent)) {
//         return true;
//     } else {
//         // console.error("Unable to parse across so many nodes. Sorry!");
//     }
//     return false;
// };

const applyTag = (context, tag, className) => {
    if (window.getSelection) {
        const selection = window.getSelection();
        const selected = (selection.rangeCount > 0) && selection.getRangeAt(0);

        // Only wrap tag around selected text
        if (selected.startOffset !== selected.endOffset) {
            const range = selected.cloneRange();

            const startParentElement = range.startContainer.parentElement;
            const endParentElement = range.endContainer.parentElement;

            // // if the selection starts and ends different elements, we could be in trouble
            // if (!startParentElement.isSameNode(endParentElement)) {
            //     if (!isSelectionParsable(startParentElement, endParentElement)) {
            //         return;
            //     }
            // }

            const newNode = document.createElement(tag);

            if (className) {
                newNode.className = className;
            }

            // https://developer.mozilla.org/en-US/docs/Web/API/Range/surroundContents
            // Parses inline nodes, but not block based nodes...blocks are handled above.
            newNode.appendChild(range.extractContents());
            range.insertNode(newNode);

            if (!startParentElement.isSameNode(endParentElement)) {
                // Remove empty surrounding para
                if (isPara(startParentElement) && isPara(endParentElement)) {
                    startParentElement.remove();
                    endParentElement.remove();
                }
            }

            // Restore the selections
            range.selectNodeContents(newNode);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
};

const formatCodeBlock = () => {
    if (window.getSelection) {
        const selection = window.getSelection();
        const selected = (selection.rangeCount > 0) && selection.getRangeAt(0);

        // Only wrap tag around selected text
        if (selected.startOffset !== selected.endOffset) {
            const range = selected.cloneRange();

            const startParentElement = range.startContainer.parentElement;
            const endParentElement = range.endContainer.parentElement;

            const content = range.extractContents();
            for (let idx = 0, len = content.childNodes.length; idx < len; idx++) {
                if (content.childNodes[idx].nodeName === 'BR') {
                    content.childNodes[idx].replaceWith("\n");
                } else if (content.childNodes[idx].nodeName === 'P' || content.childNodes[idx].nodeName === 'DIV') {
                    content.childNodes[idx].replaceWith(content.childNodes[idx].textContent + "\n");
                }
            }
            range.insertNode(document.createTextNode(content.textContent));

            if (!startParentElement.isSameNode(endParentElement)) {
                // Remove empty surrounding para
                if (isPara(startParentElement) && isPara(endParentElement)) {
                    startParentElement.remove();
                    endParentElement.remove();
                }
            }

            // Restore the selections
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
};

$.extend($.summernote.plugins, {
    'cleaner': function (context) {
        const ui = $.summernote.ui;
        const options = context.options;
        const $note = context.layoutInfo.note;

        if (options.cleanParseContent) {
            context.memo('button.cleaner', function () {
                const button = ui.button({
                    contents: '<i class="material-icons">format_clear</i>',
                    container: options.container,
                    tooltip: I18n.t('js.editor.buttons.cleaner'),
                    click: function () {
                        const range = $note.summernote('createRange');

                        $.each(range.nodes(null, {
                            includeAncestor: true,
                        }), (idx, element) => {
                            $(element).removeAttributes();
                            if (element.parentElement.className !== 'note-editable') {
                                $(element.parentElement).removeAttributes();
                            }

                            if (element.children) {
                                $.each(element.children, (id, child) => {
                                    $(child).removeAttributes();
                                })
                            }
                        });

                        context.triggerEvent('change', $note.summernote('code'));
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
        const $note = context.layoutInfo.note;

        if (options.advice) {
            context.memo('button.advice', function () {
                const button = ui.button({
                    contents: '<i class="material-icons">thumb_up</i>',
                    container: options.container,
                    tooltip: I18n.t('js.editor.buttons.advice'),
                    click: function (event) {
                        event.preventDefault();
                        applyTag(context, 'p', 'advice');
                        context.triggerEvent('change', $note.summernote('code'));
                    }
                });

                return button.render();
            });
        }
    }
});

$.extend($.summernote.plugins, {
    'code': function (context) {
        const ui = $.summernote.ui;
        const options = context.options;
        const $note = context.layoutInfo.note;

        context.memo('button.code', function () {
            const button = ui.button({
                contents: '<i class="material-icons">format_quote</i>',
                container: options.container,
                tooltip: I18n.t('js.editor.buttons.code'),
                click: function (event) {
                    event.preventDefault();
                    applyTag(context, 'code');
                    context.triggerEvent('change', $note.summernote('code'));
                }
            });

            return button.render();
        });

        this.events = {
            'summernote.keydown': function (we, event) {
                // CTRL+Y for simple code
                if (event.keyCode === 89 && event.ctrlKey) {
                    event.preventDefault();
                    applyTag(context, 'code');
                    context.triggerEvent('change', $note.summernote('code'));
                }
            }
        };
    }
});

$.extend($.summernote.plugins, {
    'pre': function (context) {
        const ui = $.summernote.ui;
        const options = context.options;
        const $note = context.layoutInfo.note;

        context.memo('button.pre', function () {
            const button = ui.button({
                contents: '<i class="material-icons">short_text</i>',
                container: options.container,
                tooltip: I18n.t('js.editor.buttons.pre'),
                click: function (event) {
                    event.preventDefault();
                    formatCodeBlock();
                    document.execCommand('FormatBlock', false, 'pre');
                    context.triggerEvent('change', $note.summernote('code'));
                }
            });

            return button.render();
        });

        this.events = {
            'summernote.keydown': function (we, event) {
                // CTRL+E for pre
                if (event.keyCode === 69 && event.ctrlKey) {
                    event.preventDefault();
                    formatCodeBlock();
                    document.execCommand('FormatBlock', false, 'pre');
                    context.triggerEvent('change', $note.summernote('code'));
                }
            }
        };
    }
});

$.extend($.summernote.plugins, {
    'secret': function (context) {
        const options = context.options;

        if (options.secret) {
            const ui = $.summernote.ui;
            const $note = context.layoutInfo.note;

            context.memo('button.secret', function () {
                const button = ui.button({
                    contents: '<i class="material-icons">security</i>',
                    container: options.container,
                    tooltip: I18n.t('js.editor.buttons.secret'),
                    click: function (event) {
                        event.preventDefault();
                        applyTag(context, 'p', 'secret');
                        context.triggerEvent('change', $note.summernote('code'));
                    }
                });

                return button.render();
            });
        }
    }
});
