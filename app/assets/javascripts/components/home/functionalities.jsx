'use strict';

import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

import ClassIcon from '@material-ui/icons/Class';
import LabelIcon from '@material-ui/icons/Label';
import AssignmentIcon from '@material-ui/icons/Assignment';
import TimelineIcon from '@material-ui/icons/Timeline';
import TocIcon from '@material-ui/icons/Toc';
import SpeakerNotesIcon from '@material-ui/icons/SpeakerNotes';
import SearchIcon from '@material-ui/icons/Search';
import ShareIcon from '@material-ui/icons/Share';
import AnalyticsIcon from '@material-ui/icons/Assessment';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import MobileFriendlyIcon from '@material-ui/icons/MobileFriendly';
import VisibilityIcon from '@material-ui/icons/Visibility';

const _renderListItem = (classes, title, details, Icon, reverse = false) => (
    <Grid className={classes.functionalitiesItem}
          container={true}
          spacing={6}
          direction={reverse ? 'row-reverse' : 'row'}
          justify="space-evenly"
          alignItems="center">
        <Grid item={true}
              xs={12}
              sm={12}
              md={9}
              lg={9}>
            <h3 className={classes.functionalitiesSubtitle}>
                {title}
            </h3>

            <div className={classes.functionalitiesDetails}>
                {details}
            </div>
        </Grid>

        <Grid className={classes.functionalitiesIconItem}
              item={true}
              xs={false}
              sm={false}
              md={3}
              lg={3}>
            <Avatar className={classes.functionalitiesIconContainer}>
                <Icon className={classes.functionalitiesIcon}
                      variant="rounded"/>
            </Avatar>
        </Grid>
    </Grid>
);

const HomeFunctionalities = ({classes, onSignupClick}) => (
    <section className={classes.functionalities}>
        <div className={classes.homeContent}>
            <h2 className={classes.functionalitiesTitle}>
                {I18n.t('js.views.home.functionalities.title')}
            </h2>

            <div className={classes.functionalitiesList}>
                {_renderListItem(classes, I18n.t('js.views.home.functionalities.topics.title'), I18n.t('js.views.home.functionalities.topics.details'), ClassIcon)}

                {_renderListItem(classes, I18n.t('js.views.home.functionalities.tags.title'), I18n.t('js.views.home.functionalities.tags.details'), LabelIcon, true)}

                {_renderListItem(classes, I18n.t('js.views.home.functionalities.articles.title'), I18n.t('js.views.home.functionalities.articles.details'), AssignmentIcon)}

                {_renderListItem(classes, I18n.t('js.views.home.functionalities.stories.title'), I18n.t('js.views.home.functionalities.stories.details'), TimelineIcon)}

                {_renderListItem(classes, I18n.t('js.views.home.functionalities.inventories.title'), I18n.t('js.views.home.functionalities.inventories.details'), TocIcon)}

                {_renderListItem(classes, I18n.t('js.views.home.functionalities.multilang.title'), I18n.t('js.views.home.functionalities.multilang.details'), SpeakerNotesIcon)}

                {_renderListItem(classes, I18n.t('js.views.home.functionalities.search.title'), I18n.t('js.views.home.functionalities.search.details'), SearchIcon, true)}

                {_renderListItem(classes, I18n.t('js.views.home.functionalities.share.title'), I18n.t('js.views.home.functionalities.share.details'), ShareIcon)}

                {_renderListItem(classes, I18n.t('js.views.home.functionalities.tracking.title'), I18n.t('js.views.home.functionalities.tracking.details'), AnalyticsIcon)}

                {_renderListItem(classes, I18n.t('js.views.home.functionalities.outdated.title'), I18n.t('js.views.home.functionalities.outdated.details'), LinkOffIcon, true)}

                {_renderListItem(classes, I18n.t('js.views.home.functionalities.device.title'), I18n.t('js.views.home.functionalities.device.details'), MobileFriendlyIcon)}

                {_renderListItem(classes, I18n.t('js.views.home.functionalities.open.title'), I18n.t('js.views.home.functionalities.open.details'), VisibilityIcon, true)}
            </div>
        </div>

        {
            onSignupClick &&
            <div className={classes.functionalitiesButton}>
                <Button color="primary"
                        variant="contained"
                        onClick={onSignupClick}>
                    {I18n.t('js.views.home.functionalities.button')}
                </Button>
            </div>
        }
    </section>
);

HomeFunctionalities.propTypes = {
    classes: PropTypes.object.isRequired,
    onSignupClick: PropTypes.func
}

export default React.memo(HomeFunctionalities);
