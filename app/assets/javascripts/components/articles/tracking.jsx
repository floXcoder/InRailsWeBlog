'use strict';

import '../../../stylesheets/pages/article/tracking.scss';

import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import VisibilityIcon from '@mui/icons-material/Visibility';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';

import {
    fetchArticleTracking
} from '../../actions';

import Loader from '../theme/loader';

const TRACKING_VIEWS = {
    STATS: 0,
    VIEWS: 1,
    ORIGINS: 2,
    REFERRERS: 3
};


export default @connect((state) => ({
    article: state.articleState.article,
    articleTracking: state.articleState.articleTracking
}), {
    fetchArticleTracking
})
class TrackingArticleModal extends React.Component {
    static propTypes = {
        trackingView: PropTypes.number,
        articleId: PropTypes.number,
        onClose: PropTypes.func,
        // from connect
        article: PropTypes.object,
        articleTracking: PropTypes.object,
        fetchArticleTracking: PropTypes.func
    };

    static defaultProps = {
        trackingView: TRACKING_VIEWS.STATS
    };

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

        if (this.props.onClose) {
            this.props.onClose();
        }
    };

    _renderListDetails = (listDetails, title) => {
        if (!listDetails) {
            return null;
        }

        return (
            <div className="col s12 margin-top-40">
                {
                    !!title &&
                    <h3 className="margin-top-0 margin-bottom-5">
                        {title}
                    </h3>
                }

                <List className="article-tracking-list-container"
                      dense={true}>
                    {
                        Object.entries(listDetails).map(([element, count], i) => (
                            <ListItem key={i}>
                                <ListItemText className="article-tracking-list-item"
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
                                    className={classNames('article-tracking-list-item', {
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
    };

    _renderStats = (tracker) => {
        return (
            <div className="center-align margin-top-20">
                <List dense={true}>
                    <ListItem>
                        <ListItemIcon>
                            <VisibilityIcon/>
                        </ListItemIcon>

                        <ListItemText className="article-tracking-list-item"
                                      primary={I18n.t('js.article.tracking.stats.visits')}/>

                        <ListItemSecondaryAction className="article-tracking-list-item">
                            {tracker.visitsCount}
                        </ListItemSecondaryAction>
                    </ListItem>

                    <ListItem>
                        <ListItemIcon>
                            <VisibilityIcon/>
                        </ListItemIcon>

                        <ListItemText className="article-tracking-list-item"
                                      primary={I18n.t('js.article.tracking.stats.views')}/>

                        <ListItemSecondaryAction className="article-tracking-list-item">
                            {tracker.viewsCount}
                        </ListItemSecondaryAction>
                    </ListItem>

                    <ListItem>
                        <ListItemIcon>
                            <TouchAppIcon/>
                        </ListItemIcon>

                        <ListItemText className="article-tracking-list-item"
                                      primary={I18n.t('js.article.tracking.stats.clicks')}/>

                        <ListItemSecondaryAction className="article-tracking-list-item">
                            {tracker.clicksCount}
                        </ListItemSecondaryAction>
                    </ListItem>

                    <ListItem>
                        <ListItemIcon>
                            <SearchIcon/>
                        </ListItemIcon>

                        <ListItemText className="article-tracking-list-item"
                                      primary={I18n.t('js.article.tracking.stats.searches')}/>

                        <ListItemSecondaryAction className="article-tracking-list-item">
                            {tracker.searchesCount}
                        </ListItemSecondaryAction>
                    </ListItem>

                    <ListItem>
                        <ListItemIcon>
                            <FavoriteIcon/>
                        </ListItemIcon>

                        <ListItemText className="article-tracking-list-item"
                                      primary={I18n.t('js.article.tracking.stats.bookmarks')}/>

                        <ListItemSecondaryAction className="article-tracking-list-item">
                            {this.props.article.bookmarksCount}
                        </ListItemSecondaryAction>
                    </ListItem>

                    <ListItem>
                        <ListItemIcon>
                            <CommentIcon/>
                        </ListItemIcon>

                        <ListItemText className="article-tracking-list-item"
                                      primary={I18n.t('js.article.tracking.stats.comments')}/>

                        <ListItemSecondaryAction className="article-tracking-list-item">
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
                    <p className="article-tracking-list-item">
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
                                <ListItemText className="article-tracking-list-item"
                                              primary={date}/>

                                <ListItemSecondaryAction className="article-tracking-list-item">
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
                    <p className="article-tracking-list-item">
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

    _renderReferrers = () => {
        if (!this.props.articleTracking.referrers) {
            return (
                <div className="margin-top-30">
                    <p className="article-tracking-list-item">
                        <em>{I18n.t('js.article.tracking.undefined')}</em>
                    </p>
                </div>
            );
        }

        return this._renderListDetails(this.props.articleTracking.referrers);
    };

    render() {
        if (!this.props.article) {
            return null;
        }

        return (
            <Modal open={this.state.isOpen}
                   onClose={this._handleClose}>
                <div className="article-tracking-modal">
                    <Typography className="article-tracking-title"
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
                        <Tab className="article-tracking-tab-item"
                             label={I18n.t('js.article.tracking.stats.title')}
                             disableRipple={true}/>

                        <Tab className="article-tracking-tab-item"
                             label={I18n.t('js.article.tracking.views.title')}
                             disableRipple={true}/>

                        <Tab className="article-tracking-tab-item"
                             label={I18n.t('js.article.tracking.origins.title')}
                             disableRipple={true}/>

                        <Tab className="article-tracking-tab-item"
                             label={I18n.t('js.article.tracking.referrers.title')}
                             disableRipple={true}/>
                    </Tabs>

                    <div className="article-tracking-container">
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
                            this.state.tabIndex === TRACKING_VIEWS.REFERRERS &&
                            this._renderReferrers()
                        }
                    </div>

                    <div className="center-align margin-top-45">
                        <Button variant="outlined" size="small" href="#" onClick={this._handleClose}>
                            {I18n.t('js.article.tracking.cancel')}
                        </Button>
                    </div>
                </div>
            </Modal>
        );
    }
}
