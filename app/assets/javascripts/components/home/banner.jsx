import React from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';

import I18n from '@js/modules/translations';

import bannerWebp from '@/images/home/banner.webp';
import bannerPng from '@/images/home/banner.png';


const HomeBanner = function ({
                                 onLoginClick,
                                 onSignupClick
                             }) {
    return (
        <section className="home-banner">
            <div className="home-home-content">
                <div className="home-banner-title">
                    <h1 className="home-banner-motto">
                        {I18n.t('js.views.home.banner.motto')}
                    </h1>

                    <h2 className="home-banner-motto-sub">
                        {I18n.t('js.views.home.banner.submotto')}
                    </h2>
                </div>

                <Grid container={true}
                      spacing={2}
                      direction="row"
                      justifyContent="space-around"
                      alignItems="center">
                    <Grid size={{
                        xs: 12,
                        sm: 6,
                        lg: 4
                    }}>
                        <div className="home-banner-background">
                            <picture>
                                <source srcSet={bannerWebp}
                                        type="image/webp"/>
                                <img className="home-banner-background-img"
                                     srcSet={bannerPng}
                                     src={bannerPng}
                                     alt={`${window.settings.website_name} logo`}
                                     fetchpriority="high"/>
                            </picture>
                        </div>
                    </Grid>

                    <Grid size={{
                        xs: 12,
                        sm: 6
                    }}>
                        <div className="home-banner-buttons">
                            <Button className="home-banner-button"
                                    color="primary"
                                    variant="contained"
                                    onClick={onSignupClick}>
                                {I18n.t('js.views.home.banner.sign_up')}
                            </Button>

                            <Button className="home-banner-button"
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
