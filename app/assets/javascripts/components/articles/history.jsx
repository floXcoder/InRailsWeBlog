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

import {
    userArticlePath
} from '../../constants/routesHelper';

import {
    fetchArticle,
    fetchArticleHistory,
    restoreArticle
} from '../../actions';

import {
    getCurrentUser
} from '../../selectors';

import highlight from '../modules/highlight';

import Loader from '../theme/loader';

import ArticleBreadcrumbDisplay from './display/breadcrumb';
import ArticleCardDisplay from './display/items/card';
import ArticleVersionsDisplay from './display/versions';

import styles from '../../../jss/article/history';

export default @withRouter
@connect((state) => ({
    currentUser: getCurrentUser(state),
    currentTopic: state.topicState.currentTopic,
    article: state.articleState.article,
    articleVersions: state.articleState.articleVersions
}), {
    fetchArticle,
    fetchArticleHistory,
    restoreArticle
})
@hot
@highlight(true)
@withStyles(styles)
class ArticleHistory extends React.Component {
    static propTypes = {
        routeParams: PropTypes.object.isRequired,
        // from router
        history: PropTypes.object,
        // from connect
        currentUser: PropTypes.object,
        currentTopic: PropTypes.object,
        article: PropTypes.object,
        articleVersions: PropTypes.array,
        fetchArticle: PropTypes.func,
        fetchArticleHistory: PropTypes.func,
        restoreArticle: PropTypes.func,
        // from highlight
        // onShow: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchArticle(this.props.routeParams.userSlug, this.props.routeParams.articleSlug)
            .fetch
            .then(() => this.props.fetchArticleHistory(this.props.routeParams.articleSlug));
    }

    componentDidUpdate(prevProps) {
        if (!this.props.articleVersions && prevProps.articleVersions && prevProps.articleVersions.length === 0) {
            Notification.alert(I18n.t('js.article.history.none'));
        }
    }

    _handleRestore = (articleId, versionId) => {
        this.props.restoreArticle(articleId, versionId)
            .then((response) => {
                if (response.article) {
                    return this.props.history.push(userArticlePath(response.article.user.slug, response.article.slug));
                }
            });
    };

    render() {
        if (!this.props.article || !this.props.articleVersions) {
            return (
                <div className="center margin-top-20">
                    <Loader size="big"/>
                </div>
            );
        }

        return (
            <div className={this.props.classes.history}>
                <div className={this.props.classes.breadcrumb}>
                    <ArticleBreadcrumbDisplay user={this.props.currentUser}
                                              topic={this.props.currentTopic}
                                              article={this.props.article}/>
                </div>

                <div className={this.props.classes.currentArticle}>
                    <ArticleCardDisplay article={this.props.article}
                                        isMinimized={true}
                                        hasActions={false}/>
                </div>

                <ArticleVersionsDisplay currentArticle={this.props.article}
                                        articleVersions={this.props.articleVersions}
                                        onRestore={this._handleRestore}/>
            </div>
        );
    }
}
