'use strict';

import ErrorActions from '../../actions/errorActions';
import ErrorStore from '../../stores/errorStore';

export default class ErrorIndex extends Reflux.Component {
    state = {
        errors: []
    };

    constructor(props) {
        super(props);

        this.mapStoreToState(ErrorStore, this.onErrorChange);
    }

    componentWillMount() {
        ErrorActions.loadErrors();
    }

    componentDidMount() {
    }

    onErrorChange = (errors) => {
        this.setState({errors: errors.error_messages});
    };

    _renderOriginIcon = (error) => {
        if (error.origin === 'communication') {
            return (<i className="material-icons blue-text text-darken-4">compare_arrows</i>);
        } else if (error.origin === 'client') {
            return (<i className="material-icons red-text text-darken-4">phone_android</i>);
        } else {
            return (<i className="material-icons blue-text text-darken-4">desktop_windows</i>);
        }
    };

    render() {
        //:params, :user_agent, :user_info, :ip
        //Line number: {error.line_number} ; Column number: {error.column_number}

        let ErrorNodes = this.state.errors.map((error) => {
            return (
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
                        { error.trace ? <blockquote
                                dangerouslySetInnerHTML={{__html: error.message.replace(/\n/g, "<br />")}}/> : ''}
                        <h5>
                            {I18n.t('js.error_message.trace')}
                        </h5>
                        { error.trace ?
                            <blockquote dangerouslySetInnerHTML={{__html: error.trace.replace(/\n/g, "<br />")}}/> : ''}
                    </div>
                </li>
            );
        });

        return (
            <div className="blog-error-box">
                <ul className="collapsible popout"
                    data-collapsible="accordion">
                    {ErrorNodes}
                </ul>
            </div>
        );
    }
}
