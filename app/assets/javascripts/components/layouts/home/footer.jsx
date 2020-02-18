'use strict';

import {
    withRouter,
    Link
} from 'react-router-dom';

import {
    withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import {
    about,
    terms,
    policy
} from '../../../constants/routesHelper';

import styles from '../../../../jss/home/footer';

export default @withRouter
@connect((state) => ({
    metaTags: state.uiState.metaTags
}))
@withStyles(styles)
class FooterLayoutHome extends React.PureComponent {
    static propTypes = {
        // from router
        location: PropTypes.object,
        history: PropTypes.object,
        // from connect
        metaTags: PropTypes.object,
        // from styles
        classes: PropTypes.object
    };

    _handleSearchClose = () => {
        if (this.props.location.hash === '#search') {
            this.props.history.push({
                hash: undefined
            });
        }
    };

    _handleCoverClick = (event) => {
        event.preventDefault();

        this._handleSearchClose();
    };

    render() {
        const isSearchActive = this.props.location.hash === '#search';

        const {'x-default': xDefault, ...alternates} = this.props.metaTags.alternate || {};

        return (
            <>
                <div className={classNames('blog-cover-layer', {
                    'search-form-visible': isSearchActive
                })}
                     onClick={this._handleCoverClick}/>

                <Grid className={this.props.classes.footer}
                      container={true}
                      direction="row"
                      justify="space-around"
                      alignItems="stretch">
                    {/*<Grid item={true}*/}
                    {/*      xs={12}>*/}
                    {/*    <h2 className={this.props.classes.footerTitle}>*/}
                    {/*        <Link className="header-brand-logo"*/}
                    {/*              to={rootPath()}*/}
                    {/*              title={window.settings.website_name}*/}
                    {/*              itemProp="url">*/}
                    {/*            {window.settings.website_name}*/}
                    {/*        </Link>*/}
                    {/*    </h2>*/}
                    {/*</Grid>*/}

                    <Grid item={true}
                          md={6}>
                        <h3 className={this.props.classes.footerSubtitle}>
                            {I18n.t('js.views.footer.languages')}
                        </h3>

                        {
                            alternates &&
                            Object.keys(alternates).map((locale) => (
                                <p key={locale}>
                                    <a className={this.props.classes.footerLink}
                                       href={alternates[locale]}>
                                        {I18n.t(`js.views.footer.locales.${locale}`)}
                                    </a>
                                </p>
                            ))
                        }
                    </Grid>

                    <Grid item={true}
                          md={6}>
                        <h3 className={this.props.classes.footerSubtitle}>
                            {I18n.t('js.views.footer.links.title')}
                        </h3>

                        <p>
                            <a className={this.props.classes.footerLink}
                               href={"mailto:" + window.settings.website_email}>
                                {I18n.t('js.views.footer.links.contact')}
                            </a>
                        </p>

                        <p>
                            <Link className={this.props.classes.footerLink}
                                  to={about()}>
                                {I18n.t('js.views.footer.links.about')}
                            </Link>
                        </p>

                        <p>
                            <Link className={this.props.classes.footerLink}
                                  to={terms()}>
                                {I18n.t('js.views.footer.links.terms')}
                            </Link>
                        </p>

                        <p>
                            <Link className={this.props.classes.footerLink}
                                  to={policy()}>
                                {I18n.t('js.views.footer.links.policy')}
                            </Link>
                        </p>
                    </Grid>

                    <Grid item={true}
                          xs={12}>
                        <div className="footer-copyright">
                            <a className={this.props.classes.footerLink}
                               href={I18n.t('js.views.footer.links.github_src')}>
                                {I18n.t('js.views.footer.links.github')}
                            </a>

                            <div className="container center-align margin-top-15">
                                &copy; {I18n.t('js.views.footer.copyright', {version: window.revision})}
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </>
        );
    }
}
