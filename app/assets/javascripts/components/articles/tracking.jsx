'use strict';

import {
    hot
} from 'react-hot-loader/root';

import {
    withRouter
} from 'react-router-dom';

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

export default @withRouter
@connect((state) => ({
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
        // from router
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
        if (this.props.article) {
            this.props.fetchArticleTracking(this.props.article.user.id, this.props.article.id);
        }
    }

    componentDidUpdate() {
        if (this.props.article && !this.props.articleTracking) {
            this.props.fetchArticleTracking(this.props.article.user.id, this.props.article.id);
        }
    }

    _handleTabChange = (event, value) => {
        this.setState({tabIndex: value});
    };

    _handleClose = () => {
        this.setState({
            isOpen: false
        });

        this.props.history.push({
            hash: undefined
        });
    };

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
        if (!this.props.articleTracking?.datesCount) {
            return null;
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
        return (
            <div className="row margin-top-20">
                {
                    this.props.articleTracking.countries &&
                    <div className="col s12">
                        <h3 className="margin-top-0 margin-bottom-5">
                            {I18n.t('js.article.tracking.origins.countries')}
                        </h3>

                        <List dense={true}>
                            {
                                Object.entries(this.props.articleTracking.countries).map(([country, count], i) => (
                                    <ListItem key={i}>
                                        <ListItemText className={this.props.classes.listItem}
                                                      primary={
                                                          <div>
                                                              {
                                                                  !country &&
                                                                  <Divider className="margin-top-5 margin-bottom-20"/>
                                                              }

                                                              {
                                                                  country ||
                                                                  <em>{I18n.t('js.article.tracking.undefined')}</em>
                                                              }
                                                          </div>
                                                      }/>

                                        <ListItemSecondaryAction className={classNames(this.props.classes.listItem, {
                                            'margin-top-10': !country
                                        })}>
                                            {count}
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))
                            }
                        </List>
                    </div>
                }

                {
                    this.props.articleTracking.browsers &&
                    <div className="col s12">
                        <h3 className="margin-top-15 margin-bottom-5">
                            {I18n.t('js.article.tracking.origins.browser')}
                        </h3>

                        <List dense={true}>
                            {
                                Object.entries(this.props.articleTracking.browsers).map(([browser, count], i) => (
                                    <ListItem key={i}>
                                        <ListItemText className={this.props.classes.listItem}
                                                      primary={
                                                          <div>
                                                              {
                                                                  !browser &&
                                                                  <Divider className="margin-top-5 margin-bottom-20"/>
                                                              }

                                                              {
                                                                  browser ||
                                                                  <em>{I18n.t('js.article.tracking.undefined')}</em>
                                                              }
                                                          </div>
                                                      }/>

                                        <ListItemSecondaryAction className={classNames(this.props.classes.listItem, {
                                            'margin-top-10': !browser
                                        })}>
                                            {count}
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))
                            }
                        </List>
                    </div>
                }

                {
                    this.props.articleTracking.os &&
                    <div className="col s12">
                        <h3 className="margin-top-15 margin-bottom-5">
                            {I18n.t('js.article.tracking.origins.os')}
                        </h3>

                        <List dense={true}>
                            {
                                Object.entries(this.props.articleTracking.os).map(([os, count], i) => (
                                    <ListItem key={i}>
                                        <ListItemText className={this.props.classes.listItem}
                                                      primary={
                                                          <div>
                                                              {
                                                                  !os &&
                                                                  <Divider className="margin-top-5 margin-bottom-20"/>
                                                              }

                                                              {
                                                                  os ||
                                                                  <em>{I18n.t('js.article.tracking.undefined')}</em>
                                                              }
                                                          </div>
                                                      }/>

                                        <ListItemSecondaryAction className={classNames(this.props.classes.listItem, {
                                            'margin-top-10': !os
                                        })}>
                                            {count}
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))
                            }
                        </List>
                    </div>
                }

                {
                    this.props.articleTracking.utmSources &&
                    <div className="col s12">
                        <h3 className="margin-top-15 margin-bottom-5">
                            {I18n.t('js.article.tracking.origins.utm')}
                        </h3>

                        <List dense={true}>
                            {
                                Object.entries(this.props.articleTracking.utmSources).map(([utm, count], i) => (
                                    <ListItem key={i}>
                                        <ListItemText className={this.props.classes.listItem}
                                                      primary={
                                                          <div>
                                                              {
                                                                  !utm &&
                                                                  <Divider className="margin-top-5 margin-bottom-20"/>
                                                              }

                                                              {
                                                                  utm ||
                                                                  <em>{I18n.t('js.article.tracking.undefined')}</em>
                                                              }
                                                          </div>
                                                      }/>

                                        <ListItemSecondaryAction className={classNames(this.props.classes.listItem, {
                                            'margin-top-10': !utm
                                        })}>
                                            {count}
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))
                            }
                        </List>
                    </div>
                }
            </div>
        );
    };

    _renderReferers = () => {
        return (
            <div className="margin-top-20">
                <div className="row margin-top-20">
                    <div className="col s12">
                        <List dense={true}>
                            {
                                Object.entries(this.props.articleTracking.referers).map(([referer, count], i) => (
                                    <ListItem key={i}>
                                        <ListItemText className={this.props.classes.listItem}
                                                      primary={
                                                          <div>
                                                              {
                                                                  (!referer || referer === 'internal') &&
                                                                  <Divider className="margin-top-5 margin-bottom-20"/>
                                                              }

                                                              {
                                                                  referer === 'internal'
                                                                      ?
                                                                      <em>{I18n.t('js.article.tracking.referers.internal')}</em>
                                                                      :
                                                                      referer ||
                                                                      <em>{I18n.t('js.article.tracking.undefined')}</em>
                                                              }
                                                          </div>
                                                      }/>

                                        <ListItemSecondaryAction className={classNames(this.props.classes.listItem, {
                                            'margin-top-10': (!referer || referer === 'internal')
                                        })}>
                                            {count}
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))
                            }
                        </List>
                    </div>
                </div>
            </div>
        );
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
