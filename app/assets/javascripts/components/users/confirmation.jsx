import React from 'react';
import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import I18n from '@js/modules/translations';


export default class UserConfirmation extends React.Component {
    static propTypes = {
        confirmationToken: PropTypes.string
    };

    static defaultProps = {
        confirmationToken: (new URL(window.location)).searchParams.get('confirmation_token') || null
    };

    constructor(props) {
        super(props);

        this._confirmationForm = React.createRef();
    }

    componentDidMount() {
        this._confirmationForm.current.submit();
    }

    render() {
        const csrfToken = document.getElementsByName('csrf-token')[0];
        const token = csrfToken?.getAttribute('content');

        return (
            <Container style={{margin: '2rem auto'}}
                       maxWidth="md">
                <form ref={this._confirmationForm}
                      action="/api/v1/users/confirmation"
                      autoComplete="off"
                      noValidate="novalidate"
                      acceptCharset="UTF-8"
                      method="GET">
                    <input type="hidden"
                           name="authenticity_token"
                           value={token}/>

                    <input type="hidden"
                           name="confirmation_token"
                           value={this.props.confirmationToken}/>

                    <div className="center-align margin-top-35 margin-bottom-25">
                        <h3>
                            {I18n.t('js.user.password.edit.title')}
                        </h3>
                    </div>
                </form>
            </Container>
        );
    }
}

