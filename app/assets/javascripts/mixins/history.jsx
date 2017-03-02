'use strict';

const HistoryMixin = (superclass) => class extends superclass {
    addToHistory(params, pageUrl = '') {
        if (window.history && window.history.pushState) {
            history.pushState(params, '', pageUrl);
        }
    }

    watchHistory(paramName) {
        if (window.history) {
            window.addEventListener('popstate', (event) => {
                const data = (!!event.state && !!event.state[paramName]) ? event.state[paramName] : null;
                this._onHistoryChanged(data);
            });
        }
    }

    constructor() {
        super();
    }
};

export default HistoryMixin;
