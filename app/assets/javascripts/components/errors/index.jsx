'use strict';

// import ErrorActions from '../../actions/errorActions';
// import ErrorStore from '../../stores/errorStore';

export default class ErrorIndex extends React.Component {
    state = {
        errors: []
    };

    constructor(props) {
        super(props);

        // TODO
        // this.mapStoreToState(ErrorStore, this.onErrorChange);

        // TODO
        // ErrorActions.loadErrors();
    }

    onErrorChange = (errors) => {
        this.setState({errors: errors.error_messages});
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
        //:params, :user_agent, :user_info, :ip
        //Line number: {error.line_number} ; Column number: {error.column_number}

        return (
            <div className="blog-error-box">
                <ul className="collapsible popout"
                    data-collapsible="accordion">
                    {
                        this.state.errors.map((error) => (
                            <li key={error.id}>
                                <div className="collapsible-header">
                                    {this._renderOriginIcon(error)}
                                    {error.class_name}
                                    <div className="error-time">
                                        {error.occurred_at}
                                    </div>
                                </div>

                                <div className="collapsible-body">
                                    <h5>
                                        {I18n.t('js.error_message.url')}
                                    </h5>
                                    <blockquote>
                                        {error.target_url}
                                    </blockquote>
                                    <h5>
                                        {I18n.t('js.error_message.message')}
                                    </h5>
                                    {error.trace ? <blockquote
                                        dangerouslySetInnerHTML={{__html: error.message.replace(/\n/g, "<br />")}}/> : ''}
                                    <h5>
                                        {I18n.t('js.error_message.trace')}
                                    </h5>
                                    {error.trace ?
                                        <blockquote
                                            dangerouslySetInnerHTML={{__html: error.trace.replace(/\n/g, "<br />")}}/> : ''}
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
        );
    }
}
