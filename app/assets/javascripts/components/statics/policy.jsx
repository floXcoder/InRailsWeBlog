'use strict';

import {
    hot
} from 'react-hot-loader/root';

import {
    withStyles
} from '@material-ui/core/styles';

import {
    fetchMetaTags
} from '../../actions';

import styles from '../../../jss/statics';

require('../../translations/statics-' + I18n.locale);

export default @connect(null, {
    fetchMetaTags
})
@hot
@withStyles(styles)
class Policy extends React.Component {
    static propTypes = {
        // from connect
        fetchMetaTags: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchMetaTags('policy');
    }

    render() {
        return (
            <div className={this.props.classes.root}>
                <h1 className={this.props.classes.title}>
                    {I18n.t('statics.policy.title')}
                </h1>

                <div>
                    <h2 className={this.props.classes.subtitle}>
                        {I18n.t('statics.policy.privacy.title')}
                    </h2>

                    <p>
                        {I18n.t('statics.policy.privacy.content_1', {website: window.settings.website_name})}
                    </p>

                    <p>
                        {I18n.t('statics.policy.privacy.content_2')}
                    </p>
                    <p>
                        {I18n.t('statics.policy.privacy.content_3')}
                    </p>
                    <p>
                        {I18n.t('statics.policy.privacy.content_4')}
                    </p>
                    <p>
                        {I18n.t('statics.policy.privacy.content_5')}
                    </p>
                    <p>
                        {I18n.t('statics.policy.privacy.content_6')}
                    </p>
                    <p>
                        {I18n.t('statics.policy.privacy.content_7')}
                    </p>
                    <p>
                        {I18n.t('statics.policy.privacy.content_8')}
                    </p>
                </div>

                <div>
                    <h2 className={this.props.classes.subtitle}>
                        {I18n.t('statics.policy.cookies.title')}
                    </h2>

                    <p>
                        {I18n.t('statics.policy.cookies.content_1')}
                    </p>

                    <p>
                        {I18n.t('statics.policy.cookies.content_2')}
                    </p>
                    <p>
                        {I18n.t('statics.policy.cookies.content_3')}
                    </p>
                    <p>
                        {I18n.t('statics.policy.cookies.content_4')}
                    </p>
                </div>
            </div>
        );
    }
}
