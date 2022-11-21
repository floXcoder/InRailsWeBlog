'use strict';

import $ from 'jquery';

const SanitizePaste = (function ($) {
    return {
        _replaceParagraphsToBr: function (html) {
            html = html.replace(/<p\s(.*?)>/gi, '<p>');
            // html = html.replace(/<p><br\s?\/?><\/p>/gi, '');
            // Keep paragraphs as is (for instance, copy from another article with p)
            // html = html.replace(/<p>([\w\W]*?)<\/p>/gi, '$1<br />');
            html = html.replace(/(<br\s?\/?>){1,}\n?<\/blockquote>/gi, '</blockquote>');

            return html;
        },

        _replaceDivs: function (html) {
            html = html.replace(/<div><br\s?\/?><\/div>/gi, '');
            html = html.replace(/<div(.*?)>([\w\W]*?)<\/div>/gi, '<p>$2</p>');

            html = html.replace(/<div(.*?[^>])>/gi, '');
            html = html.replace(/<\/div>/gi, '');

            return html;
        },

        _replaceTitles: function (html) {
            html = html.replace(/<h6/gi, '<h4');
            html = html.replace(/<\/h6>/gi, '</h4>');

            html = html.replace(/<h5/gi, '<h4');
            html = html.replace(/<\/h5>/gi, '</h4>');

            if (html.search(/<h1(.*?)>(.*?)<\/h1>/i) === 0) {
                html = html.replace(/<h3/gi, '<h4');
                html = html.replace(/<\/h3>/gi, '</h4>');

                html = html.replace(/<h2/gi, '<h3');
                html = html.replace(/<\/h2>/gi, '</h3>');

                html = html.replace(/<h1/gi, '<h2');
                html = html.replace(/<\/h1>/gi, '</h2>');
            }

            return html;
        },

        _onPasteWord: function (html) {
            // comments
            html = html.replace(/<!--[\s\S]*?-->/gi, '');

            // style
            html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

            if (html.match(/class="?Mso|style="[^"]*\bmso-|style='[^'']*\bmso-|w:WordDocument/i)) {
                // comments
                html = html.replace(/<!--[\s\S]+?-->/gi, '');

                // scripts
                html = html.replace(/<(!|script[^>]*>.*?<\/script(?=[>\s])|\/?(\?xml(:\w+)?|img|meta|link|style|\w:\w+)(?=[\s\/>]))[^>]*>/gi, '');

                // Convert <s> into <strike>
                html = html.replace(/<(\/?)s>/gi, '<$1strike>');

                // Replace nbsp entites to char since it's easier to handle
                html = html.replace(/ /gi, ' ');

                // Convert <span style="mso-spacerun:yes">___</span> to string of alternating
                // breaking/non-breaking spaces of same length
                html = html.replace(/<span\s+style\s*=\s*"\s*mso-spacerun\s*:\s*yes\s*;?\s*"\s*>([\s\u00a0]*)<\/span>/gi, function (str, spaces) {
                    return (spaces.length > 0) ? spaces.replace(/./, ' ')
                        .slice(Math.floor(spaces.length / 2))
                        .split('')
                        .join('\u00a0') : '';
                });

                const userAgent = window.navigator.userAgent;
                const isMSIE = /MSIE|Trident/i.test(userAgent);
                if (isMSIE) {
                    const tmp = trim(html.trim());
                    if (tmp.search(/^<a(.*?)>(.*?)<\/a>$/i) === 0) {
                        html = html.replace(/^<a(.*?)>(.*?)<\/a>$/i, '$2');
                    }
                }

                // shapes
                html = html.replace(/<img(.*?)v:shapes=(.*?)>/gi, '');
                html = html.replace(/src="file:\/\/(.*?)"/, 'src=""');

                // lists
                const $div = $('<div/>')
                    .html(html);

                let lastList = false;
                let lastLevel = 1;
                const listsIds = [];

                $div.find('p[style]')
                    .each(function () {
                        const matches = $(this)
                            .attr('style')
                            .match(/mso-list:l([0-9]+)\slevel([0-9]+)/);

                        if (matches) {
                            const currentList = parseInt(matches[1]);
                            const currentLevel = parseInt(matches[2]);
                            const listType = $(this)
                                .html()
                                .match(/^[\w]+\./) ? 'ol' : 'ul';

                            const $li = $('<li/>')
                                .html($(this)
                                    .html());

                            $li.html($li.html()
                                .replace(/^([\w.]+)</, '<'));
                            $li.find('span:first')
                                .remove();

                            let $list;
                            if (currentLevel === 1 && $.inArray(currentList, listsIds) === -1) {
                                $list = $('<' + listType + '/>')
                                    .attr({
                                        'data-level': currentLevel,
                                        'data-list': currentList
                                    })
                                    .html($li);

                                $(this)
                                    .replaceWith($list);

                                lastList = currentList;
                                listsIds.push(currentList);
                            } else {
                                let $prevList;
                                if (currentLevel > lastLevel) {
                                    $prevList = $div.find('[data-level="' + lastLevel + '"][data-list="' + lastList + '"]');

                                    let $lastList = $prevList;

                                    for (let i = lastLevel; i < currentLevel; i++) {
                                        $list = $('<' + listType + '/>');

                                        $list.appendTo($lastList.find('li')
                                            .last());

                                        $lastList = $list;
                                    }

                                    $lastList.attr({
                                        'data-level': currentLevel,
                                        'data-list': currentList
                                    })
                                        .html($li);
                                } else {
                                    $prevList = $div.find('[data-level="' + currentLevel + '"][data-list="' + currentList + '"]')
                                        .last();

                                    $prevList.append($li);
                                }

                                lastLevel = currentLevel;
                                lastList = currentList;

                                $(this)
                                    .remove();
                            }
                        }
                    });

                $div.find('[data-level][data-list]')
                    .removeAttr('data-level data-list');
                html = $div.html();

                // remove ms word's bullet
                html = html.replace(/·/g, '');
                html = html.replace(/<p class="Mso(.*?)"/gi, '<p');

                // classes
                html = html.replace(/ class="(mso[^"]*)"/gi, '');
                html = html.replace(/ class=(mso\w+)/gi, '');

                // remove ms word tags
                html = html.replace(/<o:p(.*?)>([\w\W]*?)<\/o:p>/gi, '$2');

                // ms word break lines
                // html = html.replace(/\n/g, ' ');

                // ms word lists break lines
                html = html.replace(/<p>\n?<li>/gi, '<li>');
            }

            return html;
        },

        _onPasteExtra: function (html) {
// remove google docs markers
            html = html.replace(/<b\sid="internal-source-marker(.*?)">([\w\W]*?)<\/b>/gi, '$2');
            html = html.replace(/<b(.*?)id="docs-internal-guid(.*?)">([\w\W]*?)<\/b>/gi, '$3');

            // google docs styles
            html = html.replace(/<span[^>]*(font-style: italic; font-weight: bold|font-weight: bold; font-style: italic)[^>]*>/gi, '<span style="font-weight: bold;"><span style="font-style: italic;">');
            html = html.replace(/<span[^>]*font-style: italic[^>]*>/gi, '<span style="font-style: italic;">');
            html = html.replace(/<span[^>]*font-weight: bold[^>]*>/gi, '<span style="font-weight: bold;">');
            html = html.replace(/<span[^>]*text-decoration: underline[^>]*>/gi, '<span style="text-decoration: underline;">');

            html = html.replace(/<img>/gi, '');
            html = html.replace(/\n{3,}/gi, '\n');
            html = html.replace(/<font(.*?)>([\w\W]*?)<\/font>/gi, '$2');

            // remove dirty p
            html = html.replace(/<p><p>/gi, '<p>');
            html = html.replace(/<\/p><\/p>/gi, '</p>');
            html = html.replace(/<li>(\s*|\t*|\n*)<p>/gi, '<li>');
            html = html.replace(/<\/p>(\s*|\t*|\n*)<\/li>/gi, '</li>');

            // remove space between paragraphs
            html = html.replace(/<\/p>\s<p/gi, '</p><p');

            // remove safari local images
            html = html.replace(/<img src="webkit-fake-url:\/\/(.*?)"(.*?)>/gi, '');

            // bullets
            html = html.replace(/<p>•([\w\W]*?)<\/p>/gi, '<li>$1</li>');

            // FF fix
            const userAgent = navigator.userAgent;
            if (/firefox/i.test(userAgent)) {
                html = html.replace(/<br\s?\/?>$/gi, '');
            }

            return html;
        },

        _onPasteRemoveEmpty: function (html) {
            // html = html.replace(/<(p|h[1-6])>(|\s|\n|\t|<br\s?\/?>)<\/(p|h[1-6])>/gi, '');
            html = html.replace(/<(h[1-6])>(|\s|\n|\t|<br\s?\/?>)<\/(h[1-6])>/gi, '');

            html = html.replace(/<form(.*?)>([\w\W]*?)<\/form>/gi, '<p>$2</p>');

            //html = html.replace(/<br\s?\/?><br\s?\/?>/gi, '');
            html = html.replace(/<p\s?><\/p>/gi, '');

            return html;
        },

        parse: function (html, type = 'html', $context = null) {
            html = $.trim(html);

            // html = html.replace(/\$/g, '&#36;');

            // convert dirty spaces
            html = html.replace(/<span class="s1">/gi, '<span>');
            html = html.replace(/<span class="Apple-converted-space">&nbsp;<\/span>/gi, ' ');
            html = html.replace(/<span class="Apple-tab-span"[^>]*>\t<\/span>/gi, '\t');
            html = html.replace(/<span[^>]*>(\s|&nbsp;)<\/span>/gi, ' ');

            html = html.replace(/”/g, '"');
            html = html.replace(/“/g, '"');
            html = html.replace(/‘/g, '\'');
            html = html.replace(/’/g, '\'');

            if (type === 'html') {
                // Replace returns to line by br except for code blocks (keep basic return to line for highlighting)
                html = html.replace(/(?:\r\n|\r|\n)/g, '%BREAKLINE%');

                html = html.replace(/<code(.*?)>.*?(?:%BREAKLINE%)?.*?<\/code>/g, function (match) {
                    return match.replace(/(?:%BREAKLINE%)/g, '\n');
                });
                html = html.replace(/<pre(.*?)>.*?(?:%BREAKLINE%)?.*?<\/pre>/g, function (match) {
                    return match.replace(/(?:%BREAKLINE%)/g, '\n');
                });

                html = html.replace(/(?:%BREAKLINE%)/g, '');

                // Sanitize
                html = this._replaceParagraphsToBr(html);
                html = this._replaceDivs(html);
                html = this._replaceTitles(html);

                html = this._onPasteWord(html);
                html = this._onPasteExtra(html);

                html = this._onPasteRemoveEmpty(html);

                // Remove multi-br
                html = html.replace(/(<br\s?\/?>){1,}/g, '<br/>');

                // Change pre to pre/code
                html = html.replace(/<pre(.*?)>/g, '<pre$1><code>');
                html = html.replace(/<\/pre>/g, '</code></pre>');

                // Do not include other tag directly inside para to avoid creation of empty line
                // html = html.replace(/<p>(<\w.*?>)<\/p>/g, '$1');

                // Remove br after tags
                html = html.replace(/(<\/(?:h1|h2|h3|h4|h5|p)>)<br\s?\/?>/g, '$1');

                // // Replace line-break by para
                // // html = html.replace(/(.*?)(?:\r\n|\r|\n)/g, '<p>$1</p>');
                // html = html.replace(/(.*?)(?:\r\n|\r|\n)/g, '$1<br/>');
                // Remove all line breaks by space if not at the start
                // while(/<pre(.*?)(?:\r\n|\r|\n)/.exec(html)) {
                //     html = html.replace(/<pre(.*?)(?:\r\n|\r|\n)/gm, '<pre$1BREAKLINE');
                // }
                // html = html.replace(/(.*?)(?:\r\n|\r|\n)/gm, '$1');
                // html = html.replace(/BREAKLINE/gm, '\n');
            } else {
                // Do not replace as insertion type is text only
                // html = html.replace(/(?:\r\n|\r|\n)/g, '<br/>');
            }

            if ($context) {
                if ($context.prop('tagName') !== 'UL' && html.startsWith('<li') && html.endsWith('</li>')) {
                    html = '<ul>' + html + '</ul>';
                }
            }

            return html;
        }
    };
})($);

export default SanitizePaste;
