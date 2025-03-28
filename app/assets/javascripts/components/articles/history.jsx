import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import I18n from '@js/modules/translations';
import Notification from '@js/modules/notification';

import {
    userArticlePath
} from '@js/constants/routesHelper';

import {
    fetchArticle,
    fetchArticleHistory,
    restoreArticle
} from '@js/actions/articleActions';

import withRouter from '@js/components/modules/router';

import highlight from '@js/components/modules/highlight';

import Loader from '@js/components/theme/loader';

import ArticleBreadcrumbDisplay from '@js/components/articles/display/breadcrumb';
import ArticleCardDisplay from '@js/components/articles/display/items/card';
import ArticleVersionsDisplay from '@js/components/articles/display/versions';

import '@css/pages/article/history.scss';


class ArticleHistory extends React.Component {
    static propTypes = {
        // from router
        routeParams: PropTypes.object,
        routeNavigate: PropTypes.func,
        // from connect
        currentUser: PropTypes.object,
        currentTopic: PropTypes.object,
        article: PropTypes.object,
        articleVersions: PropTypes.array,
        fetchArticle: PropTypes.func,
        fetchArticleHistory: PropTypes.func,
        restoreArticle: PropTypes.func,
        // from highlight
        // onShow: PropTypes.func
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
                    return this.props.routeNavigate(userArticlePath(response.article.userSlug, response.article.slug));
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
            <div className="article-version-history">
                <div className="article-version-breadcrumb">
                    <ArticleBreadcrumbDisplay user={this.props.currentUser}
                                              topic={this.props.currentTopic}
                                              article={this.props.article}/>
                </div>

                <div className="article-version-current-article">
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

export default connect((state) => ({
    currentUser: state.userState.user,
    currentTopic: state.topicState.currentTopic,
    article: state.articleState.article,
    articleVersions: state.articleState.articleVersions
}), {
    fetchArticle,
    fetchArticleHistory,
    restoreArticle
})(withRouter({
    params: true,
    navigate: true
})(highlight(true)(ArticleHistory)));