'use strict';

import {
    Modal
} from 'semantic-ui-react';

import {
    loginUser
} from '../../actions';

import LoginForm from './form/login';

@connect(null, {
    loginUser
})
export default class Login extends React.PureComponent {
    static propTypes = {
        isOpened: PropTypes.bool.isRequired,
        onModalChange: PropTypes.func.isRequired,
        // from connect
        loginUser: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    _handleSubmit = (values) => {
        this.props.loginUser(values.toJS())
            // to get crsf token in meta tag
            .then(() => location.reload(true));
    };

    render() {
        return (
            <Modal open={this.props.isOpened}
                   onClose={this.props.onModalChange}>
                <Modal.Header>
                    {I18n.t('js.user.login.title')}
                </Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <LoginForm onCancel={this.props.onModalChange}
                                   onSubmit={this._handleSubmit}/>
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        );
    }
}

