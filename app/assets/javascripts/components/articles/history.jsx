'use strict';

import {
    hot
} from 'react-hot-loader';

import {
    Link
} from 'react-router-dom';

import {
    fetchArticle,
    fetchArticleHistory,
    restoreArticle
} from '../../actions';

import {
    getArticleVersions
} from '../../selectors';

import highlight from '../modules/highlight';

import Loader from '../theme/loader';

import ArticleCardDisplay from './display/card';
import ArticleVersionsDisplay from './display/versions';

export default @connect((state) => ({
    isUserConnected: state.userState.isConnected,
    isFetching: state.articleState.isFetching,
    article: state.articleState.article,
    articleVersions: getArticleVersions(state)
}), {
    fetchArticle,
    fetchArticleHistory,
    restoreArticle
})
@highlight(true)
@hot(module)
class ArticleHistory extends React.Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        // From connect
        isFetching: PropTypes.bool,
        article: PropTypes.object,
        articleVersions: PropTypes.array,
        isUserConnected: PropTypes.bool,
        fetchArticle: PropTypes.func,
        fetchArticleHistory: PropTypes.func,
        restoreArticle: PropTypes.func
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
                    return this.props.history.push(`/article/${response.article.slug}`);
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
            <div className="articles-history">
                <ArticleCardDisplay article={this.props.article}
                                    hasActions={false}/>

                <ArticleVersionsDisplay currentArticle={this.props.article}
                                        articleVersions={this.props.articleVersions}
                                        onRestore={this._handleRestore}/>
            </div>
        );
    }
}
