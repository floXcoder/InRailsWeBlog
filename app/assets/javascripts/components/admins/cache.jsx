'use strict';

import Container from '@mui/material/Container';
import Button from '@mui/material/Button/Button';
import Paper from '@mui/material/Paper';

import {
    flushCache
} from '../../actions/admin';

export default @connect(null, {
    flushCache
})
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
                    Notification.message.success(I18n.t('js.admin.cache.successful'));
                } else {
                    Notification.message.error(I18n.t('js.admin.cache.error'));
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

