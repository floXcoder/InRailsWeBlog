import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

import ClassIcon from '@mui/icons-material/Class';
import LabelIcon from '@mui/icons-material/Label';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TimelineIcon from '@mui/icons-material/Timeline';
import TocIcon from '@mui/icons-material/Toc';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import SearchIcon from '@mui/icons-material/Search';
import ShareIcon from '@mui/icons-material/Share';
import AnalyticsIcon from '@mui/icons-material/Assessment';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import MobileFriendlyIcon from '@mui/icons-material/MobileFriendly';
import VisibilityIcon from '@mui/icons-material/Visibility';

import I18n from '@js/modules/translations';


const _renderListItem = function (title, details, Icon, reverse = false) {
    return (
        <Grid className="home-functionalities-item"
              container={true}
              spacing={6}
              direction={reverse ? 'row-reverse' : 'row'}
              justifyContent="space-evenly"
              alignItems="center">
            <Grid size={{
                xs: 12,
                sm: 9
            }}>
                <h3 className="home-functionalities-subtitle">
                    {title}
                </h3>

                <div className="home-functionalities-details">
                    {details}
                </div>
            </Grid>

            <Grid className="home-functionalities-icon-item"
                  size={{
                      md: 3,
                      lg: 3
                  }}>
                <Avatar className="home-functionalities-icon-container">
                    <Icon className="home-functionalities-icon"
                          variant="rounded"/>
                </Avatar>
            </Grid>
        </Grid>
    );
};

const HomeFunctionalities = function ({onSignupClick}) {
    return (
        <section className="home-functionalities">
            <div className="home-home-content">
                <h2 className="home-functionalities-title">
                    {I18n.t('js.views.home.functionalities.title')}
                </h2>

                <div className="home-functionalitiesList">
                    {_renderListItem(I18n.t('js.views.home.functionalities.topics.title'), I18n.t('js.views.home.functionalities.topics.details'), ClassIcon)}

                    {_renderListItem(I18n.t('js.views.home.functionalities.tags.title'), I18n.t('js.views.home.functionalities.tags.details'), LabelIcon, true)}

                    {_renderListItem(I18n.t('js.views.home.functionalities.articles.title'), I18n.t('js.views.home.functionalities.articles.details'), AssignmentIcon)}

                    {_renderListItem(I18n.t('js.views.home.functionalities.stories.title'), I18n.t('js.views.home.functionalities.stories.details'), TimelineIcon)}

                    {_renderListItem(I18n.t('js.views.home.functionalities.inventories.title'), I18n.t('js.views.home.functionalities.inventories.details'), TocIcon)}

                    {_renderListItem(I18n.t('js.views.home.functionalities.multilang.title'), I18n.t('js.views.home.functionalities.multilang.details'), SpeakerNotesIcon)}

                    {_renderListItem(I18n.t('js.views.home.functionalities.search.title'), I18n.t('js.views.home.functionalities.search.details'), SearchIcon, true)}

                    {_renderListItem(I18n.t('js.views.home.functionalities.share.title'), I18n.t('js.views.home.functionalities.share.details'), ShareIcon)}

                    {_renderListItem(I18n.t('js.views.home.functionalities.tracking.title'), I18n.t('js.views.home.functionalities.tracking.details'), AnalyticsIcon)}

                    {_renderListItem(I18n.t('js.views.home.functionalities.outdated.title'), I18n.t('js.views.home.functionalities.outdated.details'), LinkOffIcon, true)}

                    {_renderListItem(I18n.t('js.views.home.functionalities.device.title'), I18n.t('js.views.home.functionalities.device.details'), MobileFriendlyIcon)}

                    {_renderListItem(I18n.t('js.views.home.functionalities.open.title'), I18n.t('js.views.home.functionalities.open.details'), VisibilityIcon, true)}
                </div>
            </div>

            {
                !!onSignupClick &&
                <div className="home-functionalities-button">
                    <Button color="primary"
                            variant="contained"
                            onClick={onSignupClick}>
                        {I18n.t('js.views.home.functionalities.button')}
                    </Button>
                </div>
            }
        </section>
    );
};

HomeFunctionalities.propTypes = {
    onSignupClick: PropTypes.func
};

export default React.memo(HomeFunctionalities);
