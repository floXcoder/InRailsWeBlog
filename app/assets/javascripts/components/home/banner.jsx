'use strict';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

var HomeBanner = function ({onLoginClick, onSignupClick}) {
    return (
        <section className="home-banner">
            <div className="home-homeContent">
                <div className="home-bannerTitle">
                    <h1 className="home-bannerMotto">
                        {I18n.t('js.views.home.banner.motto')}
                    </h1>

                    <h2 className="home-bannerMottoSub">
                        {I18n.t('js.views.home.banner.submotto')}
                    </h2>
                </div>

                <Grid container={true}
                      spacing={2}
                      direction="row"
                      justifyContent="space-around"
                      alignItems="center">
                    <Grid item={true}
                          xs={12}
                          sm={12}
                          md={6}
                          lg={6}>
                        <div className="home-bannerBackground">
                            <picture>
                                <source srcSet={`${window.settings.assets_url}/home/banner.webp`}
                                        type="image/webp"/>
                                <img className="home-bannerBackgroundImg"
                                     srcSet={`${window.settings.assets_url}/home/banner.png`}
                                     src={`${window.settings.assets_url}/home/banner.png`}
                                     alt={`${window.settings.website_name} logo`}/>
                            </picture>
                        </div>
                    </Grid>

                    <Grid item={true}
                          xs={12}
                          sm={12}
                          md={6}
                          lg={6}>
                        <div className="home-bannerButtons">
                            <Button className="home-bannerButton"
                                    color="primary"
                                    variant="contained"
                                    onClick={onSignupClick}>
                                {I18n.t('js.views.home.banner.sign_up')}
                            </Button>

                            <Button className="home-bannerButton"
                                    color="primary"
                                    onClick={onLoginClick}>
                                {I18n.t('js.views.home.banner.log_in')}
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </div>
        </section>
    );
};

HomeBanner.propTypes = {
    onLoginClick: PropTypes.func.isRequired,
    onSignupClick: PropTypes.func.isRequired
};

export default React.memo(HomeBanner);
