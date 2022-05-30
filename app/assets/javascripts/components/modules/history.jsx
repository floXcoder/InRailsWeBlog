'use strict';

import {
    getDisplayName
} from './common';

import History from '../../modules/history';

export default function history(WrappedComponent) {
    return class HistoryComponent extends React.Component {
        static displayName = `HistoryComponent(${getDisplayName(WrappedComponent)})`;

        constructor(props) {
            super(props);

            this._isActive = true;
        }

        componentWillUnmount() {
            this._isActive = false;
        }

        getPreviousHistory = (paramName) => {
            const previousHistory = History.getPreviousState(paramName, {useUrlParams: true});

            if (previousHistory) {
                return previousHistory;
            }
        };

        addToHistory = (params, pageUrl = {}, replaceOnly = false) => {
            History.saveCurrentState(params, pageUrl, replaceOnly);

            // if (window.history && window.history.pushState) {
            //     if (replaceOnly) {
            //         window.history.replaceState(params, '', pageUrl);
            //     } else {
            //         window.history.pushState(params, '', pageUrl);
            //     }
            // }
        };

        watchHistory = (paramName, callback) => {
            if (window.history) {
                window.addEventListener('popstate', (event) => {
                    if (this._isActive) {
                        const data = (!!event.state && !!event.state[paramName]) ? event.state[paramName] : null;
                        callback(data);
                    }
                });
            }
        };

        render() {
            const propsProxy = {
                ...this.props,
                addToHistory: this.addToHistory,
                getPreviousHistory: this.getPreviousHistory,
                onHistoryChanged: this.watchHistory
            };

            return (
                <WrappedComponent {...propsProxy} />
            );
        }
    };
}
