import React from 'react';
import PropTypes from 'prop-types';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import I18n from '@js/modules/translations';


export default class ShareFormTopic extends React.Component {
    static propTypes = {
        onCancel: PropTypes.func.isRequired,
        onShare: PropTypes.func.isRequired,
        onUserChange: PropTypes.func,
        errorText: PropTypes.string
    };

    constructor(props) {
        super(props);
    }

    state = {
        userLogin: ''
    };

    _handleUserLoginChange = (event) => {
        this.setState({
            userLogin: event.target.value
        });

        if (this.props.onUserChange) {
            this.props.onUserChange(event.target.value);
        }
    };

    _handleTopicSubmit = (event) => {
        event.preventDefault();

        this.props.onShare(this.state.userLogin);
    };

    render() {
        return (
            <form id="topic-share"
                  onSubmit={this._handleTopicSubmit}>
                <TextField className="topic-share-input"
                           fullWidth={true}
                           autoFocus={true}
                           required={true}
                           label={I18n.t('js.topic.share.form.user_name')}
                           variant="outlined"
                           value={this.state.userLogin}
                           error={!!this.props.errorText}
                           helperText={this.props.errorText}
                           onChange={this._handleUserLoginChange}/>

                <div className="center-align margin-top-20">
                    <Button color="primary"
                            variant="outlined"
                            onClick={this._handleTopicSubmit}>
                        {I18n.t('js.topic.share.form.submit')}
                    </Button>

                    <div className="center-align margin-top-15">
                        <a href="#"
                           onClick={this.props.onCancel}>
                            {I18n.t('js.topic.share.cancel')}
                        </a>
                    </div>
                </div>
            </form>
        );
    }
}
