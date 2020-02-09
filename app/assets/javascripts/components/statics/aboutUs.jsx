'use strict';

import {
    hot
} from 'react-hot-loader/root';

import {
    withStyles
} from '@material-ui/core/styles';

import styles from '../../../jss/statics';

require('../../translations/statics-' + I18n.locale);

export default @hot
@withStyles(styles)
class HomeHome extends React.Component {
    static propTypes = {
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.classes.root}>
                <h1 className={this.props.classes.title}>
                    {I18n.t('statics.about_us.title')}
                </h1>

                <div>
                    <h2 className={this.props.classes.subtitle}>
                        {I18n.t('statics.about_us.info.title')}
                    </h2>

                    <p>
                        {I18n.t('statics.about_us.info.content_1')}
                    </p>

                    <p>
                        {I18n.t('statics.about_us.info.content_2', {email: window.settings.website_email})}
                    </p>
                </div>

                <div>
                    <h2 className={this.props.classes.subtitle}>
                        {I18n.t('statics.about_us.host.title')}
                    </h2>

                    <p>
                        {I18n.t('statics.about_us.host.content_1')}
                    </p>

                    <p>
                        {I18n.t('statics.about_us.host.content_2')}
                    </p>

                    <p>
                        {I18n.t('statics.about_us.host.content_3')}
                    </p>
                </div>
            </div>
        );
    }
}
