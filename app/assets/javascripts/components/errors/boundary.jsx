import React from 'react';
import PropTypes from 'prop-types';

import I18n from '@js/modules/translations';
import Notification from '@js/modules/notification';

import {
    pushError
} from '@js/actions/errorActions';

import PWAManager from '@js/modules/pwaManager';


export default class ErrorBoundary extends React.Component {
    static propTypes = {
        children: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.array
        ]).isRequired,
        errorType: PropTypes.oneOf(['text', 'card', 'notification']),
        errorTitle: PropTypes.string,
        errorMessage: PropTypes.string,
        className: PropTypes.string
    };

    static defaultProps = {
        errorType: 'card'
    };

    constructor(props) {
        super(props);

        // Cannot use I18n in static mode in defaultProps
        this.state.errorTitle = this.props.errorTitle || I18n.t('js.helpers.errors.boundary.title');
        this.state.errorMessage = this.props.errorMessage || I18n.t('js.helpers.errors.boundary.title');
    }

    state = {
        hasError: false,
        errorTitle: undefined,
        errorMessage: undefined
    };

    componentDidCatch(error, info) {
        this.setState({
            hasError: true
        });

        if (this.props.errorType === 'notification') {
            Notification.error(this.state.errorTitle);
        } else {
            // If PWA, try to clear caches then force reload page
            if (PWAManager.isActive()) {
                PWAManager.clearServiceWorkerCaches(() => {
                    // Add timestamp to ensure page is not cached
                    const timestamp = Date.now();
                    const urlParams = window.location.search;
                    const newUrl = location + (urlParams ? urlParams + '&' : '?') + `_=${timestamp}`;
                    window.location.replace(newUrl);
                });
            }
        }

        pushError(error, info);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.errorType === 'text') {
                return (
                    <h3 className={this.props.className}
                        style={{
                            margin: '1rem 0',
                            textAlign: 'center'
                        }}>
                        {this.state.errorTitle}
                    </h3>
                );
            } else if (this.props.errorType === 'card') {
                return (
                    <div>
                        <h3 className={this.props.className}
                            style={{
                                margin: '1rem 0',
                                textAlign: 'center'
                            }}>
                            {this.state.errorTitle}
                        </h3>

                        <p style={{
                            margin: '2rem',
                            fontStyle: 'italic',
                            textAlign: 'center'
                        }}>
                            {this.state.errorMessage}
                        </p>
                    </div>
                );
            } else {
                return null;
            }
        } else {
            return this.props.children;
        }
    }
}

