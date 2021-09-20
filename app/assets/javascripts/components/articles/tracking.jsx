'use strict';

import {
    hot
} from 'react-hot-loader/root';

import {
    withStyles
} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import VisibilityIcon from '@material-ui/icons/Visibility';
import TouchAppIcon from '@material-ui/icons/TouchApp';
import SearchIcon from '@material-ui/icons/Search';
import FavoriteIcon from '@material-ui/icons/Favorite';
import CommentIcon from '@material-ui/icons/Comment';

import {
    fetchArticleTracking
} from '../../actions';

import Loader from '../theme/loader';

import styles from '../../../jss/article/tracking';

const TRACKING_VIEWS = {
    STATS: 0,
    VIEWS: 1,
    ORIGINS: 2,
    REFERERS: 3
};

export default @connect((state) => ({
    article: state.articleState.article,
    articleTracking: state.articleState.articleTracking
}), {
    fetchArticleTracking
})
@hot
@withStyles(styles)
class TrackingArticleModal extends React.Component {
    static propTypes = {
        trackingView: PropTypes.number,
        articleId: PropTypes.number,
        history: PropTypes.object,
        // from connect
        article: PropTypes.object,
        articleTracking: PropTypes.object,
        fetchArticleTracking: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    static defaultProps = {
        trackingView: TRACKING_VIEWS.STATS
    }

    constructor(props) {
        super(props);
    }

    state = {
        isOpen: true,
        tabIndex: this.props.trackingView
    };

    componentDidMount() {
        if (this.props.articleId) {
            this.props.fetchArticleTracking(this.props.articleId, undefined, {withArticle: true});
        } else if (this.props.article) {
            this.props.fetchArticleTracking(this.props.article.id, this.props.article.user.id);
        }
    }

    componentDidUpdate() {
        if (!this.props.articleTracking) {
            if (this.props.articleId) {
                this.props.fetchArticleTracking(this.props.articleId, this.props.article.user.id);
            } else if (this.props.article) {
                this.props.fetchArticleTracking(this.props.article.id, this.props.article.user.id);
            }
        }
    }

    _handleTabChange = (event, value) => {
        this.setState({tabIndex: value});
    };

    _handleClose = () => {
        this.setState({
            isOpen: false
        });

        this.props.history?.push({
            hash: undefined
        });
    };

    _renderListDetails = (listDetails, title) => {
        if (!listDetails) {
            return null;
        }

        return (
            <div className="col s12 margin-top-40">
                {
                    title &&
                    <h3 className="margin-top-0 margin-bottom-5">
                        {title}
                    </h3>
                }

                <List className={this.props.classes.listContainer}
                      dense={true}>
                    {
                        Object.entries(listDetails).map(([element, count], i) => (
                            <ListItem key={i}>
                                <ListItemText className={this.props.classes.listItem}
                                              primary={
                                                  <div>
                                                      {
                                                          (!element || element === 'internal' || element === 'others') &&
                                                          <Divider className="margin-top-5 margin-bottom-20"/>
                                                      }

                                                      {
                                                          !element &&
                                                          <em>{I18n.t('js.article.tracking.undefined')}</em>
                                                      }

                                                      {
                                                          element === 'others' &&
                                                          <em>{I18n.t('js.article.tracking.others')}</em>
                                                      }

                                                      {
                                                          element === 'internal' &&
                                                          <em>{I18n.t('js.article.tracking.internal')}</em>
                                                      }

                                                      {
                                                          (element !== 'others' && element !== 'internal') &&
                                                          element
                                                      }
                                                  </div>
                                              }/>

                                <ListItemSecondaryAction
                                    className={classNames(this.props.classes.listItem, {
                                        'margin-top-10': (!element || element === 'internal' || element === 'others')
                                    })}>
                                    {count}
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))
                    }
                </List>
            </div>
        );
    }

    _renderStats = (tracker) => {
        return (
            <div className="center-align margin-top-20">
                <List dense={true}>
                    <ListItem>
                        <ListItemIcon>
                            <VisibilityIcon/>
                        </ListItemIcon>

                        <ListItemText className={this.props.classes.listItem}
                                      primary={I18n.t('js.article.tracking.stats.visits')}/>

                        <ListItemSecondaryAction className={this.props.classes.listItem}>
                            {tracker.visitsCount}
                        </ListItemSecondaryAction>
                    </ListItem>

                    <ListItem>
                        <ListItemIcon>
                            <VisibilityIcon/>
                        </ListItemIcon>

                        <ListItemText className={this.props.classes.listItem}
                                      primary={I18n.t('js.article.tracking.stats.views')}/>

                        <ListItemSecondaryAction className={this.props.classes.listItem}>
                            {tracker.viewsCount}
                        </ListItemSecondaryAction>
                    </ListItem>

                    <ListItem>
                        <ListItemIcon>
                            <TouchAppIcon/>
                        </ListItemIcon>

                        <ListItemText className={this.props.classes.listItem}
                                      primary={I18n.t('js.article.tracking.stats.clicks')}/>

                        <ListItemSecondaryAction className={this.props.classes.listItem}>
                            {tracker.clicksCount}
                        </ListItemSecondaryAction>
                    </ListItem>

                    <ListItem>
                        <ListItemIcon>
                            <SearchIcon/>
                        </ListItemIcon>

                        <ListItemText className={this.props.classes.listItem}
                                      primary={I18n.t('js.article.tracking.stats.searches')}/>

                        <ListItemSecondaryAction className={this.props.classes.listItem}>
                            {tracker.searchesCount}
                        </ListItemSecondaryAction>
                    </ListItem>

                    <ListItem>
                        <ListItemIcon>
                            <FavoriteIcon/>
                        </ListItemIcon>

                        <ListItemText className={this.props.classes.listItem}
                                      primary={I18n.t('js.article.tracking.stats.bookmarks')}/>

                        <ListItemSecondaryAction className={this.props.classes.listItem}>
                            {this.props.article.bookmarksCount}
                        </ListItemSecondaryAction>
                    </ListItem>

                    <ListItem>
                        <ListItemIcon>
                            <CommentIcon/>
                        </ListItemIcon>

                        <ListItemText className={this.props.classes.listItem}
                                      primary={I18n.t('js.article.tracking.stats.comments')}/>

                        <ListItemSecondaryAction className={this.props.classes.listItem}>
                            {this.props.article.commentsCount}
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
            </div>
        );
    };

    _renderViews = () => {
        if (!this.props.articleTracking?.datesCount || Object.keys(this.props.articleTracking.datesCount).length === 0) {
            return (
                <div className="margin-top-30">
                    <p className={this.props.classes.listItem}>
                        <em>{I18n.t('js.article.tracking.undefined')}</em>
                    </p>
                </div>
            );
        }

        return (
            <div className="margin-top-20">
                <List dense={true}>
                    {
                        Object.entries(this.props.articleTracking.datesCount).map(([date, count], i) => (
                            <ListItem key={i}>
                                <ListItemText className={this.props.classes.listItem}
                                              primary={date}/>

                                <ListItemSecondaryAction className={this.props.classes.listItem}>
                                    {count}
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))
                    }
                </List>
            </div>
        );
    };

    _renderOrigins = () => {
        if (!this.props.articleTracking.countries && !this.props.articleTracking.browsers && !this.props.articleTracking.os && !this.props.articleTracking.utmSources) {
            return (
                <div className="margin-top-30">
                    <p className={this.props.classes.listItem}>
                        <em>{I18n.t('js.article.tracking.undefined')}</em>
                    </p>
                </div>
            );
        }

        return (
            <div className="row margin-top-20">
                {this._renderListDetails(this.props.articleTracking.countries, I18n.t('js.article.tracking.origins.country'))}
                {this._renderListDetails(this.props.articleTracking.browsers, I18n.t('js.article.tracking.origins.browser'))}
                {this._renderListDetails(this.props.articleTracking.os, I18n.t('js.article.tracking.origins.os'))}
                {this._renderListDetails(this.props.articleTracking.utmSources, I18n.t('js.article.tracking.origins.utm'))}
            </div>
        );
    };

    _renderReferers = () => {
        if (!this.props.articleTracking.referers) {
            return (
                <div className="margin-top-30">
                    <p className={this.props.classes.listItem}>
                        <em>{I18n.t('js.article.tracking.undefined')}</em>
                    </p>
                </div>
            );
        }

        return this._renderListDetails(this.props.articleTracking.referers);
    };

    render() {
        if (!this.props.article) {
            return null;
        }

        return (
            <Modal open={this.state.isOpen}
                   onClose={this._handleClose}>
                <div className={this.props.classes.modal}>
                    <Typography className={this.props.classes.title}
                                variant="h6">
                        {I18n.t('js.article.tracking.title')}
                    </Typography>

                    {
                        !this.props.articleTracking &&
                        <div className="center">
                            <Loader size="big"/>
                        </div>
                    }

                    <Tabs value={this.state.tabIndex}
                          onChange={this._handleTabChange}
                          indicatorColor="primary"
                          variant="fullWidth">
                        <Tab className={this.props.classes.tabItem}
                             label={I18n.t('js.article.tracking.stats.title')}
                             disableRipple={true}/>

                        <Tab className={this.props.classes.tabItem}
                             label={I18n.t('js.article.tracking.views.title')}
                             disableRipple={true}/>

                        <Tab className={this.props.classes.tabItem}
                             label={I18n.t('js.article.tracking.origins.title')}
                             disableRipple={true}/>

                        <Tab className={this.props.classes.tabItem}
                             label={I18n.t('js.article.tracking.referers.title')}
                             disableRipple={true}/>
                    </Tabs>

                    <div className={this.props.classes.container}>
                        {
                            this.state.tabIndex === TRACKING_VIEWS.STATS &&
                            this._renderStats(this.props.articleTracking?.tracker || this.props.article.tracker)
                        }

                        {
                            this.state.tabIndex === TRACKING_VIEWS.VIEWS &&
                            this._renderViews()
                        }

                        {
                            this.state.tabIndex === TRACKING_VIEWS.ORIGINS &&
                            this._renderOrigins()
                        }

                        {
                            this.state.tabIndex === TRACKING_VIEWS.REFERERS &&
                            this._renderReferers()
                        }
                    </div>

                    <div className="center-align margin-top-45">
                        <Button color="default"
                                variant="outlined"
                                size="small"
                                href="#"
                                onClick={this._handleClose}>
                            {I18n.t('js.article.tracking.cancel')}
                        </Button>
                    </div>
                </div>
            </Modal>
        );
    }
}
