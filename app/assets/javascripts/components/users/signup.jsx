'use strict';

import {
    Modal
} from 'semantic-ui-react';

import {
    signupUser
} from '../../actions';

import SignupForm from './form/signup';

@connect(null, {
    signupUser
})
export default class Signup extends React.Component {
    static propTypes = {
        isOpened: PropTypes.bool.isRequired,
        onModalChange: PropTypes.func.isRequired,
        // from connect
        signupUser: PropTypes.func

    };

    constructor(props) {
        super(props);
    }

    _handleSubmit = (values) => {
        this.props.signupUser(values.toJS());
    };

    render() {
        return (
            <Modal open={this.props.isOpened}
                   onClose={this.props.onModalChange}>
                <Modal.Header>
                    {I18n.t('js.user.signup.title')}
                </Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <SignupForm onCancel={this.props.onModalChange}
                                    onSubmit={this._handleSubmit}/>
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        );
    }
}

