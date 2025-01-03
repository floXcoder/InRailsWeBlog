import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import * as Utils from '@js/modules/utils';

import {
    topicArticlesPath
} from '@js/constants/routesHelper';

import {
    fetchArticles,
    updateArticlePriority
} from '@js/actions/articleActions';

import withRouter from '@js/components/modules/router';

import {
    sortItemLimit
} from '@js/components/modules/constants';

import Loader from '@js/components/theme/loader';

import ArticleSorterDisplay from '@js/components/articles/sort/sorter';

import '@css/pages/article/sort.scss';


class ArticleSort extends React.Component {
    static propTypes = {
        // from router
        routeParams: PropTypes.object,
        routeNavigate: PropTypes.func,
        // from connect
        currentUserId: PropTypes.number,
        currentUserSlug: PropTypes.string,
        currentUserTopicId: PropTypes.number,
        currentUserTopicSlug: PropTypes.string,
        isFetching: PropTypes.bool,
        isProcessing: PropTypes.bool,
        articles: PropTypes.array,
        fetchArticles: PropTypes.func,
        updateArticlePriority: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchArticles({
            userId: this.props.routeParams.currentUserId || this.props.currentUserId,
            topicId: this.props.routeParams.currentUserTopicId || this.props.currentUserTopicId,
            order: 'priority_desc',
            ...this.props.routeParams
        }, {
            summary: true,
            limit: sortItemLimit
        });
    }

    _handleUpdatePriority = (articleIds) => {
        this.props.updateArticlePriority(articleIds)
            .then(() => this.props.routeNavigate(topicArticlesPath(this.props.currentUserSlug, this.props.currentUserTopicSlug)));
    };

    render() {
        if (this.props.isFetching || this.props.articles.length === 0) {
            return (
                <div className="center margin-top-20">
                    <Loader size="big"/>
                </div>
            );
        }

        return (
            <div className="article-sort-root">
                {
                    !!this.props.isProcessing &&
                    <div className="center margin-top-20">
                        <Loader size="big"/>
                    </div>
                }

                {
                    this.props.articles.length > 0 &&
                    <ArticleSorterDisplay key={Utils.uuid()}
                                          articles={this.props.articles}
                                          isProcessing={this.props.isProcessing}
                                          currentUserSlug={this.props.currentUserSlug}
                                          updateArticlePriority={this._handleUpdatePriority}/>
                }
            </div>
        );
    }
}

export default connect((state) => ({
    currentUserId: state.userState.currentId,
    currentUserSlug: state.userState.currentSlug,
    currentUserTopicId: state.topicState.currentUserTopicId,
    currentUserTopicSlug: state.topicState.currentUserTopicSlug,
    isFetching: state.articleState.isFetching,
    isProcessing: state.articleState.isProcessing,
    articles: state.articleState.articles
}), {
    fetchArticles,
    updateArticlePriority
})(withRouter({
    params: true,
    navigate: true
})(ArticleSort));