require('imports?require=>false!imports?define=>false!history.js/history');

(function (window, undefined) {
    "use strict";

    // Localise Globals
    var
        History = window.History = window.History || {},
        jQuery = window.jQuery;

    // Check Existence
    if (typeof History.Adapter !== 'undefined') {
        throw new Error('History.js Adapter has already been loaded...');
    }

    // Add the Adapter
    History.Adapter = {
        /**
         * History.Adapter.bind(el,event,callback)
         * @param {Element|string} el
         * @param {string} event - custom and standard events
         * @param {function} callback
         * @return {void}
         */
        bind: function (el, event, callback) {
            jQuery(el).bind(event, callback);
        },

        /**
         * History.Adapter.trigger(el,event)
         * @param {Element|string} el
         * @param {string} event - custom and standard events
         * @param {Object=} extra - a object of extra event data (optional)
         * @return {void}
         */
        trigger: function (el, event, extra) {
            jQuery(el).trigger(event, extra);
        },

        /**
         * History.Adapter.extractEventData(key,event,extra)
         * @param {string} key - key for the event data to extract
         * @param {string} event - custom and standard events
         * @param {Object=} extra - a object of extra event data (optional)
         * @return {mixed}
         */
        extractEventData: function (key, event, extra) {
            // jQuery Native then jQuery Custom
            var result = (event && event.originalEvent && event.originalEvent[key]) || (extra && extra[key]) || undefined;

            // Return
            return result;
        },

        /**
         * History.Adapter.onDomLoad(callback)
         * @param {function} callback
         * @return {void}
         */
        onDomLoad: function (callback) {
            jQuery(callback);
        }
    };

    // Try and Initialise History
    if (typeof History.init !== 'undefined') {
        History.init();
    }

})(window);

$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results[1] || 0;
};


var HistoryJSMixin = {
    _historyjs_recoverState: function (state) {
        var receivedStateSerialized, receivedState;
        receivedStateSerialized = state.data;

        if ($.isEmptyObject(receivedStateSerialized)) {
            var params = $(location).attr('search');

            if (!$.isEmpty(params)) {
                receivedStateSerialized = JSON.parse('{"' + decodeURI(decodeURIComponent(params)
                        .replace(/^\?/, '')
                        .replace(/&/g, '","')
                        .replace(/\+/g, ' ')
                        .replace(/=/g, '":"')) + '"}');
            }
        }

        if (this.deserializeParams !== undefined) {
            receivedState = this.deserializeParams(receivedStateSerialized);
        }
        else {
            receivedState = receivedStateSerialized;
        }

        this.handleParams(receivedState);
    },

    saveState: function (states, options) {
        var serializedState = _.pick(states, _.identity);

        this._historyjs_localUpdate = true;

        if (!this._historyjs_has_saved) {
            this._historyjs_has_saved = true;
            if (options) {
                History.replaceState(serializedState, options.title, encodeURI($(location).attr('pathname') + '?' + $.param(serializedState)));
            } else {
                History.replaceState(serializedState);
            }
        }
        else {
            if (options) {
                History.pushState(serializedState, options.title, encodeURI($(location).attr('pathname') + '?' + $.param(serializedState)));
            } else {
                History.pushState(serializedState);
            }
        }
    },

    bindToBrowserhistory: function () {
        this._historyjs_has_saved = false;
        this._historyjs_localUpdate = false;

        History.Adapter.bind(window, 'statechange', function () {
            if(!this._historyjs_localUpdate) {
                this._historyjs_recoverState(History.getState());
            }

            this._historyjs_localUpdate = false;
        }.bind(this));
        this._historyjs_recoverState(History.getState());
    }
};

module.exports = HistoryJSMixin;
