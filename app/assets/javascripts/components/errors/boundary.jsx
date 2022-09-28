'use strict';

import {
    pushError
} from '../../actions';


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
        }

        pushError(error, info);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.errorType === 'text') {
                return (
                    <h3 className={this.props.className}
                        style={{margin: '1rem 0', textAlign: 'center'}}>
                        {this.state.errorTitle}
                    </h3>
                );
            } else if (this.props.errorType === 'card') {
                return (
                    <div>
                        <h3 className={this.props.className}
                            style={{margin: '1rem 0', textAlign: 'center'}}>
                            {this.state.errorTitle}
                        </h3>

                        <p style={{margin: '2rem', fontStyle: 'italic', textAlign: 'center'}}>
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

