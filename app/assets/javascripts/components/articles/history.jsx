'use strict';

import {
    hot
} from 'react-hot-loader';

import {
    withStyles
} from '@material-ui/core/styles';

import {
    fetchArticle,
    fetchArticleHistory,
    restoreArticle
} from '../../actions';

import {
    getCurrentUserTopic,
    getCurrentUser,
    getArticleVersions
} from '../../selectors';

import highlight from '../modules/highlight';

import Loader from '../theme/loader';

import ArticleBreadcrumbDisplay from './display/breadcrumb';
import ArticleCardDisplay from './display/card';
import ArticleVersionsDisplay from './display/versions';

import styles from '../../../jss/article/history';

export default @hot(module)

@connect((state) => ({
    currentUser: getCurrentUser(state),
    currentTopic: getCurrentUserTopic(state),
    article: state.articleState.article,
    articleVersions: getArticleVersions(state)
}), {
    fetchArticle,
    fetchArticleHistory,
    restoreArticle
})
@highlight(true)
@withStyles(styles)
class ArticleHistory extends React.Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
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
        this.props.fetchArticle(this.props.params.articleSlug);
        this.props.fetchArticleHistory(this.props.params.articleSlug);
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
                    return this.props.history.push(`/users/${response.article.user.slug}/articles/${response.article.slug}`);
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

                <ArticleCardDisplay article={this.props.article}
                                    hasActions={false}/>

                <ArticleVersionsDisplay currentArticle={this.props.article}
                                        articleVersions={this.props.articleVersions}
                                        onRestore={this._handleRestore}/>
            </div>
        );
    }
}
