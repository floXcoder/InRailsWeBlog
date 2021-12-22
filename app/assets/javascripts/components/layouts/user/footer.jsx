'use strict';

import Grid from '@mui/material/Grid';

import {
    about,
    terms,
    privacy
} from '../../../constants/routesHelper';

import withRouter from '../../modules/router';


export default @connect((state) => ({
    metaTags: state.uiState.metaTags
}))
@withRouter({location: true, navigate: true})
class FooterLayoutUser extends React.Component {
    static propTypes = {
        // from router
        routeLocation: PropTypes.object,
        routeNavigate: PropTypes.func,
        // from connect
        metaTags: PropTypes.object
    };

    _handleSearchClose = () => {
        if (this.props.routeLocation.hash === '#search') {
            this.props.routeNavigate({
                hash: undefined
            });
        }
    };

    _handleCoverClick = (event) => {
        event.preventDefault();

        this._handleSearchClose();
    };

    _handleAlternateClick = (alternateLink, locale, event) => {
        event.preventDefault();

        window.document.location.href = alternateLink + (alternateLink.includes('?') ? '&' : '?') + 'force_locale=' + locale;
    };

    render() {
        const isSearchActive = this.props.routeLocation.hash === '#search';

        const {'x-default': xDefault, ...alternates} = this.props.metaTags.alternate || {};

        return (
            <>
                <div className={classNames('blog-cover-layer', {
                    'search-form-visible': isSearchActive
                })}
                     onClick={this._handleCoverClick}/>

                <div className="layout-footer-footer">
                    <Grid className="layout-footer-footerContainer"
                          container={true}
                          direction="row"
                          justifyContent="space-around"
                          alignItems="stretch">
                        {/*<Grid item={true}*/}
                        {/*      xs={12}>*/}
                        {/*    <h2 className={layout-footer-footerTitle}>*/}
                        {/*        <Link className="header-brand-logo"*/}
                        {/*              to={rootPath()}*/}
                        {/*              title={window.settings.website_name}*/}
                        {/*              itemProp="url">*/}
                        {/*            {window.settings.website_name}*/}
                        {/*        </Link>*/}
                        {/*    </h2>*/}
                        {/*</Grid>*/}

                        {
                            !!Object.keys(alternates).length &&
                            <Grid item={true}
                                  md={6}>
                                <h3 className="layout-footer-footerSubtitle">
                                    {I18n.t('js.views.footer.languages')}
                                </h3>

                                {
                                    Object.keys(alternates).map((locale) => (
                                        <p key={locale}>
                                            <a className="layout-footer-footerLink"
                                               href={alternates[locale]}
                                               onClick={this._handleAlternateClick.bind(this, alternates[locale], locale)}>
                                                {I18n.t(`js.views.footer.locales.${locale}`)}
                                            </a>
                                        </p>
                                    ))
                                }
                            </Grid>
                        }

                        <Grid item={true}
                              md={6}>
                            <h3 className="layout-footer-footerSubtitle">
                                {I18n.t('js.views.footer.links.title')}
                            </h3>

                            <p>
                                <a className="layout-footer-footerLink"
                                   href={`mailto:${window.settings.website_email}`}>
                                    {I18n.t('js.views.footer.links.contact')}
                                </a>
                            </p>

                            <p>
                                <a className="layout-footer-footerLink"
                                   href={about()}>
                                    {I18n.t('js.views.footer.links.about')}
                                </a>
                            </p>

                            <p>
                                <a className="layout-footer-footerLink"
                                   href={terms()}>
                                    {I18n.t('js.views.footer.links.terms')}
                                </a>
                            </p>

                            <p>
                                <a className="layout-footer-footerLink"
                                   href={privacy()}>
                                    {I18n.t('js.views.footer.links.privacy')}
                                </a>
                            </p>
                        </Grid>

                        <Grid item={true}
                              xs={12}>
                            <div className="margin-top-30">
                                <a className="layout-footer-githubLink"
                                   rel="noopener noreferrer"
                                   target="_blank"
                                   href={I18n.t('js.views.footer.links.github_src')}>
                                    {I18n.t('js.views.footer.links.github')}
                                </a>

                                <div className="container center-align margin-top-15"
                                     style={{marginTop: '2rem', fontSize: '1rem'}}>
                                    &copy; {I18n.t('js.views.footer.copyright', {version: window.revision})}
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </>
        );
    }
}
