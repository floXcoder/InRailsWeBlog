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
class About extends React.Component {
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
        this.props.fetchMetaTags('about');
    }

    render() {
        return (
            <div className={this.props.classes.root}>
                <h1 className={this.props.classes.title}>
                    {I18n.t('statics.about.title')}
                </h1>

                <div>
                    <h2 className={this.props.classes.subtitle}>
                        {I18n.t('statics.about.info.title', {website: window.settings.website_name})}
                    </h2>

                    <p>
                        {I18n.t('statics.about.info.content_1')}
                    </p>

                    <p>
                        {I18n.t('statics.about.info.content_2', {email: window.settings.website_email})}
                    </p>
                </div>

                <div>
                    <h2 className={this.props.classes.subtitle}>
                        {I18n.t('statics.about.host.title')}
                    </h2>

                    <p>
                        {I18n.t('statics.about.host.content_1')}
                    </p>

                    <p>
                        {I18n.t('statics.about.host.content_2')}
                    </p>

                    <p>
                        {I18n.t('statics.about.host.content_3')}
                    </p>
                </div>
            </div>
        );
    }
}
