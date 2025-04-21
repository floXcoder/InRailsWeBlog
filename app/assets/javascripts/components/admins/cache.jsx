import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

import I18n from '@js/modules/translations';
import Notification from '@js/modules/notification';

import {
    flushCache
} from '@js/actions/admin';


class AdminCache extends React.Component {
    static propTypes = {
        // from connect
        flushCache: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    _handleCacheSubmit = () => {
        this.props.flushCache()
            .then((json) => {
                if (json.success) {
                    Notification.success(I18n.t('js.admin.cache.successful'));
                } else {
                    Notification.error(I18n.t('js.admin.cache.error'));
                }
            });
    };

    render() {
        return (
            <div className="center-align">
                <h1>
                    {I18n.t('js.admin.cache.title')}
                </h1>

                <Container style={{margin: '2rem auto'}}
                           maxWidth="sm">
                    <Paper style={{padding: '1.2rem'}}
                           square={true}>
                        <Button color="primary"
                                variant="outlined"
                                onClick={this._handleCacheSubmit}>
                            {I18n.t('js.admin.cache.button')}
                        </Button>
                    </Paper>
                </Container>
            </div>
        );
    }
}

export default connect(null, {
    flushCache
})(AdminCache);
