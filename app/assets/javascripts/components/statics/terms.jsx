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
class Terms extends React.Component {
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
        this.props.fetchMetaTags('terms');
    }

    render() {
        return (
            <div className={this.props.classes.root}>
                <h1 className={this.props.classes.title}>
                    {I18n.t('statics.terms.title')}
                </h1>

                <p>
                    {I18n.t('statics.terms.content_1', {website: window.settings.website_name})}
                </p>

                <p>
                    {I18n.t('statics.terms.content_2')}
                </p>

                <div>
                    <h2 className={this.props.classes.subtitle}>
                        {I18n.t('statics.terms.conditions.title')}
                    </h2>

                    <p>
                        {I18n.t('statics.terms.conditions.content_1')}
                    </p>
                    <p>
                        {I18n.t('statics.terms.conditions.content_2')}
                    </p>
                    <p>
                        {I18n.t('statics.terms.conditions.content_3')}
                    </p>
                </div>

                <div>
                    <h2 className={this.props.classes.subtitle}>
                        {I18n.t('statics.terms.change.title')}
                    </h2>

                    <p>
                        {I18n.t('statics.terms.change.content_1')}
                    </p>
                    <p>
                        {I18n.t('statics.terms.change.content_2')}
                    </p>
                </div>

                <div>
                    <h2 className={this.props.classes.subtitle}>
                        {I18n.t('statics.terms.usage.title')}
                    </h2>

                    <p>
                        {I18n.t('statics.terms.usage.content_1')}
                    </p>
                    <p>
                        {I18n.t('statics.terms.usage.content_2')}
                    </p>
                </div>

                <div>
                    <h2 className={this.props.classes.subtitle}>
                        {I18n.t('statics.terms.share.title')}
                    </h2>

                    <p>
                        {I18n.t('statics.terms.share.content_1')}
                    </p>
                </div>

                <div>
                    <h2 className={this.props.classes.subtitle}>
                        {I18n.t('statics.terms.rights.title')}
                    </h2>

                    <p>
                        {I18n.t('statics.terms.rights.content_1')}
                    </p>
                </div>

                <div>
                    <h2 className={this.props.classes.subtitle}>
                        {I18n.t('statics.terms.ownership.title')}
                    </h2>

                    <p>
                        {I18n.t('statics.terms.ownership.content_1')}
                    </p>
                </div>

                <div>
                    <h2 className={this.props.classes.subtitle}>
                        {I18n.t('statics.terms.license.title')}
                    </h2>

                    <p>
                        {I18n.t('statics.terms.license.content_1')}
                    </p>
                    <p>
                        {I18n.t('statics.terms.license.content_2')}
                    </p>
                    <p>
                        {I18n.t('statics.terms.license.content_3')}
                    </p>
                    <p>
                        {I18n.t('statics.terms.license.content_4')}
                    </p>
                </div>

                <div>
                    <h2 className={this.props.classes.subtitle}>
                        {I18n.t('statics.terms.insurance.title')}
                    </h2>

                    <p>
                        {I18n.t('statics.terms.insurance.content_1')}
                    </p>
                </div>

                <div>
                    <h2 className={this.props.classes.subtitle}>
                        {I18n.t('statics.terms.site_rights.title')}
                    </h2>

                    <p>
                        {I18n.t('statics.terms.site_rights.content_1')}
                    </p>
                    <p>
                        {I18n.t('statics.terms.site_rights.content_2')}
                    </p>
                    <p>
                        {I18n.t('statics.terms.site_rights.content_3')}
                    </p>
                    <p>
                        {I18n.t('statics.terms.site_rights.content_4')}
                    </p>
                </div>

                <div>
                    <h2 className={this.props.classes.subtitle}>
                        {I18n.t('statics.terms.copyrights.title')}
                    </h2>

                    <p>
                        {I18n.t('statics.terms.copyrights.content_1')}
                    </p>
                </div>

                <div>
                    <h2 className={this.props.classes.subtitle}>
                        {I18n.t('statics.terms.storage.title')}
                    </h2>

                    <p>
                        {I18n.t('statics.terms.storage.content_1')}
                    </p>
                </div>

                <div>
                    <h2 className={this.props.classes.subtitle}>
                        {I18n.t('statics.terms.closed.title')}
                    </h2>

                    <p>
                        {I18n.t('statics.terms.closed.content_1')}
                    </p>
                    <p>
                        {I18n.t('statics.terms.closed.content_2')}
                    </p>
                    <p>
                        {I18n.t('statics.terms.closed.content_3')}
                    </p>
                </div>

                <div>
                    <h2 className={this.props.classes.subtitle}>
                        {I18n.t('statics.terms.ad.title')}
                    </h2>

                    <p>
                        {I18n.t('statics.terms.ad.content_1')}
                    </p>
                </div>

                <div>
                    <h2 className={this.props.classes.subtitle}>
                        {I18n.t('statics.terms.price.title')}
                    </h2>

                    <p>
                        {I18n.t('statics.terms.price.content_1')}
                    </p>
                </div>

                <div>
                    <h2 className={this.props.classes.subtitle}>
                        {I18n.t('statics.terms.closed.title')}
                    </h2>

                    <p>
                        {I18n.t('statics.terms.other.content_1')}
                    </p>
                    <p>
                        {I18n.t('statics.terms.other.content_2')}
                    </p>
                    <p>
                        {I18n.t('statics.terms.other.content_3')}
                    </p>
                    <p>
                        {I18n.t('statics.terms.other.content_4')}
                    </p>
                </div>

                <div>
                    <h2 className={this.props.classes.subtitle}>
                        {I18n.t('statics.terms.claim.title')}
                    </h2>

                    <p>
                        {I18n.t('statics.terms.claim.content_1')}
                    </p>
                    <p>
                        {I18n.t('statics.terms.claim.content_2')}
                    </p>
                    <p>
                        {I18n.t('statics.terms.claim.content_3')}
                    </p>
                </div>
            </div>
        );
    }
}
