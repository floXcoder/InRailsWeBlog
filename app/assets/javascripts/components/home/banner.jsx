'use strict';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const HomeBanner = ({classes, onLoginClick, onSignupClick}) => (
    <section className={classes.banner}>
        <div className={classes.homeContent}>
            <div className={classes.bannerTitle}>
                <h1 className={classes.bannerMotto}>
                    {I18n.t('js.views.home.banner.motto')}
                </h1>

                <h2 className={classes.bannerMottoSub}>
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
                    <div className={classes.bannerBackground}>
                        <picture>
                            <source srcSet={`${window.settings.assets_url}/home/banner.webp`}
                                    type="image/webp"/>
                            <img className={classes.bannerBackgroundImg}
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
                    <div className={classes.bannerButtons}>
                        <Button className={classes.bannerButton}
                                color="primary"
                                variant="contained"
                                onClick={onSignupClick}>
                            {I18n.t('js.views.home.banner.sign_up')}
                        </Button>

                        <Button className={classes.bannerButton}
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

HomeBanner.propTypes = {
    classes: PropTypes.object.isRequired,
    onLoginClick: PropTypes.func.isRequired,
    onSignupClick: PropTypes.func.isRequired
};

export default React.memo(HomeBanner);
