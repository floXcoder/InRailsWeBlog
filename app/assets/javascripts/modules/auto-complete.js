'use strict';

$.fn.autoComplete = function (options) {
    const configuration = $.extend({}, $.fn.autoComplete.defaults, options);

    // public methods
    if (typeof options === 'string') {
        this.each(function () {
            const that = $(this);
            if (options === 'destroy') {
                $(window).off('resize.autocomplete', that.updateSC);
                that.off('blur.autocomplete focus.autocomplete keydown.autocomplete keyup.autocomplete');
                if (that.data('autocomplete'))
                    that.attr('autocomplete', that.data('autocomplete'));
                else
                    that.removeAttr('autocomplete');
                $(that.data('sc')).remove();
                that.removeData('sc').removeData('autocomplete');
            }
        });
        return this;
    }

    return this.each(function () {
        const that = $(this);
        // sc = 'suggestions container'
        that.sc = $('<div class="autocomplete-suggestions ' + configuration.menuClass + '"></div>');
        that.data('sc', that.sc).data('autocomplete', that.attr('autocomplete'));
        that.attr('autocomplete', 'off');
        that.cache = {};
        that.last_val = '';

        that.updateSC = function (resize, next) {
            that.sc.css({
                top: that.offset().top + that.outerHeight(),
                left: that.offset().left,
                width: parseInt(that.sc.css('max-width')) || that.outerWidth()
            });
            if (!resize) {
                that.sc.show();
                if (!that.sc.maxHeight) that.sc.maxHeight = parseInt(that.sc.css('max-height'));
                if (!that.sc.suggestionHeight) that.sc.suggestionHeight = $('.autocomplete-suggestion', that.sc).first().outerHeight();
                if (that.sc.suggestionHeight)
                    if (!next) that.sc.scrollTop(0);
                    else {
                        const scrTop = that.sc.scrollTop(), selTop = next.offset().top - that.sc.offset().top;
                        if (selTop + that.sc.suggestionHeight - that.sc.maxHeight > 0)
                            that.sc.scrollTop(selTop + that.sc.suggestionHeight + scrTop - that.sc.maxHeight);
                        else if (selTop < 0)
                            that.sc.scrollTop(selTop + scrTop);
                    }
            }
        };

        $(window).on('resize.autocomplete', that.updateSC);

        that.sc.appendTo('body');

        that.sc.on('mouseleave', '.autocomplete-suggestion', function () {
            $('.autocomplete-suggestion.selected').removeClass('selected');
        });

        that.sc.on('mouseenter', '.autocomplete-suggestion', function () {
            $('.autocomplete-suggestion.selected').removeClass('selected');
            $(this).addClass('selected');
        });

        that.sc.on('mousedown', '.autocomplete-suggestion', function (event) {
            const item = $(this), v = item.data('val');
            if (v || item.hasClass('autocomplete-suggestion')) { // else outside click
                that.val(v);
                configuration.onSelect(event, v, item);
                that.sc.hide();
            }
            return false;
        });

        that.on('blur.autocomplete', function () {
            try {
                var over_sb = $('.autocomplete-suggestions:hover').length;
            } catch (e) {
                over_sb = 0;
            } // IE7 fix :hover
            if (!over_sb) {
                that.last_val = that.val();
                that.sc.hide();
                setTimeout(function () {
                    that.sc.hide();
                }, 350); // hide suggestions on fast input
            } else if (!that.is(':focus')) setTimeout(function () {
                that.focus();
            }, 20);
        });

        if (!configuration.minChars) that.on('focus.autocomplete', function () {
            that.last_val = '\n';
            that.trigger('keyup.autocomplete');
        });

        function suggest(data) {
            const val = that.val();
            that.cache[val] = data;
            if (data.length && val.length >= configuration.minChars) {
                let s = '';
                for (let i = 0; i < data.length; i++) s += configuration.renderItem(data[i], val);
                that.sc.html(s);
                that.updateSC(0);
            }
            else
                that.sc.hide();
        }

        that.on('keydown.autocomplete', function (event) {
            let next, $selector;

            // down (40), up (38)
            if ((event.which === 40 || event.which === 38) && that.sc.html()) {
                $selector = $('.autocomplete-suggestion.selected', that.sc);

                if (!$selector.length) {
                    next = (event.which === 40) ? $('.autocomplete-suggestion', that.sc).first() : $('.autocomplete-suggestion', that.sc).last();
                    that.val(next.addClass('selected').data('val'));
                } else {
                    next = (event.which === 40) ? $selector.next('.autocomplete-suggestion') : $selector.prev('.autocomplete-suggestion');
                    if (next.length) {
                        $selector.removeClass('selected');
                        that.val(next.addClass('selected').data('val'));
                    }
                    else {
                        $selector.removeClass('selected');
                        that.val(that.last_val);
                        next = 0;
                    }
                }

                that.updateSC(0, next);
                return false;
            }
            // esc
            else if (event.which === 27) that.val(that.last_val).sc.hide();
            // enter or tab
            else if (event.which === 13 || event.which === 9) {
                $selector = $('.autocomplete-suggestion.selected', that.sc);
                if ($selector.length && that.sc.is(':visible')) {
                    configuration.onSelect(event, $selector.data('val'), $selector);
                    setTimeout(function () {
                        that.sc.hide();
                    }, 20);
                }
            }
        });

        that.on('keyup.autocomplete', function (event) {
            if (!~$.inArray(event.which, [13, 27, 35, 36, 37, 38, 39, 40])) {
                let val = that.val();
                if (val.length >= configuration.minChars) {
                    if (val !== that.last_val) {
                        that.last_val = val;
                        if (configuration.delay) {
                            clearTimeout(that.timer);
                        }
                        if (configuration.cache) {
                            if (val in that.cache) {
                                suggest(that.cache[val]);
                                return;
                            }

                            // no requests if previous suggestions were empty
                            if (!configuration.isFetchingIfPreviousIsNil) {
                                for (let i = 1; i < val.length - configuration.minChars; i++) {
                                    const part = val.slice(0, val.length - i);
                                    if (part in that.cache && !that.cache[part].length) {
                                        suggest([]);
                                        return;
                                    }
                                }
                            }
                        }

                        if (configuration.delay) {
                            that.timer = setTimeout(function () {
                                configuration.source(val, suggest);
                            }, configuration.delay);
                        } else {
                            configuration.source(val, suggest)
                        }
                    }
                } else {
                    that.last_val = val;
                    that.sc.hide();
                }
            }
        });
    });
};

$.fn.autoComplete.defaults = {
    source: 0,
    minChars: 2,
    isFetchingIfPreviousIsNil: true,
    delay: null,
    cache: 1,
    menuClass: '',
    renderItem: function (item, search) {
        // escape special characters
        search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
        return '<div class="autocomplete-suggestion" data-val="' + item + '">' + item.replace(re, "<b>$1</b>") + '</div>';
    },
    onSelect: function (e, term, item) {
    }
};
