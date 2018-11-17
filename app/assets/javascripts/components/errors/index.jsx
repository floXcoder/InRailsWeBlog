'use strict';

import {
    fetchErrors,
    deleteError,
    deleteAllErrors
} from '../../actions';

import {
    getFailures
} from '../../selectors';

export default @connect((state) => ({
    errors: getFailures(state)
}), {
    fetchErrors,
    deleteError,
    deleteAllErrors
})
class ErrorIndex extends React.PureComponent {
    static propTypes = {
        // from connect
        errors: PropTypes.array,
        fetchErrors: PropTypes.func,
        deleteError: PropTypes.func,
        deleteAllErrors: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchErrors();
    }

    componentDidUpdate() {
        const collapsibles = document.querySelectorAll('.collapsible');
        M.Collapsible.init(collapsibles, {
            accordion: false
        });
    }

    _handleDeleteError = (errorId, event) => {
        event.preventDefault();

        this.props.deleteError(errorId);
    };

    _handleDeleteAllErrors = (event) => {
        event.preventDefault();

        this.props.deleteAllErrors();
    };

    _isJS = (error) => {
        return error.origin === 'client';
    };

    _renderOriginIcon = (error) => {
        if (error.origin === 'communication') {
            return (
                <span className="material-icons text-matisse"
                      data-icon="compare_arrows"
                      aria-hidden="true"/>
            );
        } else if (error.origin === 'client') {
            return (
                <span className="material-icons text-error"
                      data-icon="phone_android"
                      aria-hidden="true"/>
            );
        } else {
            return (
                <span className="material-icons text-matisse"
                      data-icon="desktop_windows"
                      aria-hidden="true"/>
            );
        }
    };

    render() {
        return (
            <div className="row error-box">
                <div className="col s12">
                    <div className="card-panel center-align">
                        <h3 className="heading-2">
                            {I18n.t('js.admin.managers.errors.title')}
                        </h3>

                        <div className="row center-align">
                            <div className="col s12">
                                <a className="btn-large btn-full-text waves-effect waves-light text-error error-btn"
                                   href="#"
                                   onClick={this._handleDeleteAllErrors}>
                                    <span className="material-icons right"
                                          data-icon="remove_circle"
                                          aria-hidden="true"/>
                                    {I18n.t('js.admin.managers.errors.clear.button')}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col s12">
                    <ul className="collapsible popout"
                        data-collapsible="accordion">
                        {
                            this.props.errors.map((error) => (
                                <li key={error.id}>
                                    <div className="collapsible-header">
                                        {this._renderOriginIcon(error)}

                                        {`${error.className} (${error.requestFormat})`}

                                        <div className="error-time">
                                            {error.occurredAt}
                                        </div>

                                        <div className="error-delete">
                                            <a className="btn-small waves-effect waves-light text-error error-btn"
                                               href="#"
                                               onClick={this._handleDeleteError.bind(this, error.id)}>
                                                    <span className="material-icons right"
                                                          data-icon="remove_circle"
                                                          aria-hidden="true"/>
                                                {I18n.t('js.admin.managers.errors.delete.button')}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="collapsible-body">
                                        <h5>
                                            {I18n.t('js.error_message.url')}
                                        </h5>
                                        <blockquote>
                                            {
                                                this._isJS(error)
                                                    ?
                                                    error.refererUrl
                                                    :
                                                    error.targetUrl
                                            }
                                        </blockquote>

                                        <p>
                                            {
                                                !this._isJS(error) &&
                                                `=> ${error.refererUrl}`
                                            }
                                        </p>

                                        <p>
                                            <table>
                                                <thead>
                                                <tr>
                                                    <th>{I18n.t('js.error_message.details.user_id')}</th>
                                                    <th>{I18n.t('js.error_message.details.user_name')}</th>
                                                    <th>{I18n.t('js.error_message.details.user_locale')}</th>
                                                    <th>{I18n.t('js.error_message.details.user_ip')}</th>
                                                    <th>{I18n.t('js.error_message.details.browser')}</th>
                                                    <th>{I18n.t('js.error_message.details.system')}</th>
                                                </tr>
                                                </thead>

                                                <tbody>
                                                <tr>
                                                    <td>{error.userId}</td>
                                                    <td>{error.userPseudo}</td>
                                                    <td>{error.userLocale}</td>
                                                    <td>{error.userIp}</td>
                                                    <td>{error.botAgent || error.userAgent}</td>
                                                    <td>{error.osAgent}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </p>

                                        <h5>
                                            {I18n.t('js.error_message.message')}
                                        </h5>
                                        {
                                            error.trace
                                                ?
                                                <blockquote
                                                    dangerouslySetInnerHTML={{__html: error.message.replace(/\n/g, "<br />") + ` (${error.lineNumber}:${error.columnNumber})`}}/>
                                                :
                                                ''
                                        }

                                        <h5>
                                            {I18n.t('js.error_message.trace')}
                                        </h5>
                                        {
                                            error.trace
                                                ?
                                                <blockquote
                                                    dangerouslySetInnerHTML={{__html: error.trace.replace(/\n/g, "<br />")}}/>
                                                :
                                                ''
                                        }

                                        {
                                            !this._isJS(error) &&
                                            <div>
                                                <h5>
                                                    {I18n.t('js.error_message.parameters')}
                                                </h5>
                                                {
                                                    error.params
                                                        ?
                                                        <blockquote
                                                            dangerouslySetInnerHTML={{__html: error.params.replace(/\n/g, "<br />")}}/>
                                                        :
                                                        ''
                                                }
                                            </div>
                                        }

                                        <em>
                                            {error.appVersion}
                                        </em>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        );
    }
}

