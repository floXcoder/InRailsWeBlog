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

import VisibilityIcon from '@material-ui/icons/Visibility';
import TouchAppIcon from '@material-ui/icons/TouchApp';
import SearchIcon from '@material-ui/icons/Search';
import FavoriteIcon from '@material-ui/icons/Favorite';
import CommentIcon from '@material-ui/icons/Comment';

import {
    fetchArticle
} from '../../actions';

import styles from '../../../jss/article/tracking';

export default @withRouter
@connect((state) => ({
    article: state.articleState.article
}), {
    fetchArticle
})
@hot
@withStyles(styles)
class TrackingArticleModal extends React.Component {
    static propTypes = {
        // from router
        history: PropTypes.object,
        // from connect
        article: PropTypes.object,
        fetchArticle: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    state = {
        isOpen: true
    };

    componentDidMount() {
        if (this.props.article) {
            this.props.fetchArticle(this.props.article.user.id, this.props.article.id, {complete: true});
        }
    }

    _handleClose = () => {
        this.setState({
            isOpen: false
        });

        this.props.history.push({
            hash: undefined
        });
    };

    render() {
        if (!this.props.article || !this.props.article.tracker) {
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

                    <div className="center-align margin-top-20">
                        <List className={this.props.classes.root}
                              dense={true}>
                            <ListItem>
                                <ListItemIcon>
                                    <VisibilityIcon/>
                                </ListItemIcon>

                                <ListItemText primary={I18n.t('js.article.tracking.visits')}/>

                                <ListItemSecondaryAction>
                                    {this.props.article.tracker.visitsCount}
                                </ListItemSecondaryAction>
                            </ListItem>

                            <ListItem>
                                <ListItemIcon>
                                    <VisibilityIcon/>
                                </ListItemIcon>

                                <ListItemText primary={I18n.t('js.article.tracking.views')}/>

                                <ListItemSecondaryAction>
                                    {this.props.article.tracker.viewsCount}
                                </ListItemSecondaryAction>
                            </ListItem>

                            <ListItem>
                                <ListItemIcon>
                                    <TouchAppIcon/>
                                </ListItemIcon>

                                <ListItemText primary={I18n.t('js.article.tracking.clicks')}/>

                                <ListItemSecondaryAction>
                                    {this.props.article.tracker.clicksCount}
                                </ListItemSecondaryAction>
                            </ListItem>

                            <ListItem>
                                <ListItemIcon>
                                    <SearchIcon/>
                                </ListItemIcon>

                                <ListItemText primary={I18n.t('js.article.tracking.searches')}/>

                                <ListItemSecondaryAction>
                                    {this.props.article.tracker.searchesCount}
                                </ListItemSecondaryAction>
                            </ListItem>

                            <ListItem>
                                <ListItemIcon>
                                    <FavoriteIcon/>
                                </ListItemIcon>

                                <ListItemText primary={I18n.t('js.article.tracking.bookmarks')}/>

                                <ListItemSecondaryAction>
                                    {this.props.article.bookmarksCount}
                                </ListItemSecondaryAction>
                            </ListItem>

                            <ListItem>
                                <ListItemIcon>
                                    <CommentIcon/>
                                </ListItemIcon>

                                <ListItemText primary={I18n.t('js.article.tracking.comments')}/>

                                <ListItemSecondaryAction>
                                    {this.props.article.commentsCount}
                                </ListItemSecondaryAction>
                            </ListItem>
                        </List>
                    </div>

                    <div className="center-align margin-top-20">
                        <div className="center-align margin-top-25">
                            <a href="#"
                               onClick={this._handleClose}>
                                {I18n.t('js.article.tracking.cancel')}
                            </a>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}
