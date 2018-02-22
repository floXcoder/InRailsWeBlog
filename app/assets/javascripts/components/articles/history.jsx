'use strict';

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

import Spinner from '../materialize/spinner';

import ArticleCardDisplay from './display/card';
import ArticleVersionsDisplay from './display/versions';

@connect((state) => ({
    isUserConnected: state.userState.isConnected,
    isFetching: state.articleState.isFetching,
    article: state.articleState.article,
    articleVersions: getArticleVersions(state)
}), {
    fetchArticle,
    fetchArticleHistory,
    restoreArticle
})
@highlight
export default class ArticleHistory extends React.Component {
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

        props.fetchArticle(props.params.articleSlug);
        props.fetchArticleHistory(props.params.articleSlug);
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.articleVersions && nextProps.articleVersions && nextProps.articleVersions.length === 0) {
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
                    <Spinner size="big"/>
                </div>
            );
        }

        return (
            <div className="articles-history">
                <ArticleCardDisplay article={this.props.article}
                                    hasActions={false}/>

                <ArticleVersionsDisplay articleVersions={this.props.articleVersions}
                                        onRestore={this._handleRestore}/>
            </div>
        );
    }
}
