'use strict';

import {
    pushError
} from '../../actions/errorActions';

export default class ErrorBoundary extends React.Component {
    static propTypes = {
        children: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.array
        ]).isRequired,
        errorType: PropTypes.oneOf(['text', 'card']),
        errorTitle: PropTypes.string,
        errorMessage: PropTypes.string,
        className: PropTypes.string
    };

    static defaultProps = {
        errorType: 'card',
        errorTitle: I18n.t('js.helpers.errors.boundary.title'),
        errorMessage: I18n.t('js.helpers.errors.boundary.message')
    };

    constructor(props) {
        super(props);
    }

    state = {
        hasError: false
    };

    componentDidCatch(error, info) {
        this.setState({
            hasError: true
        });

        pushError({
            ...error,
            trace: error.stack,
            origin: 'client'
        });
    }

    render() {
        if (this.state.hasError) {
            if (this.props.errorType === 'text') {
                return (
                    <h3 className={this.props.className}
                        style={{margin: '1rem 0', textAlign: 'center'}}>
                        {this.props.errorTitle}
                    </h3>
                );
            } else {
                return (
                    <div className="card-panel">
                        <h3 className={this.props.className}
                            style={{margin: '1rem 0', textAlign: 'center'}}>
                            {this.props.errorTitle}
                        </h3>

                        <p style={{margin: '2rem', fontStyle: 'italic', textAlign: 'center'}}>
                            {this.props.errorMessage}
                        </p>
                    </div>
                );
            }
        } else {
            return this.props.children;
        }
    }
}

