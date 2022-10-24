'use strict';

import {
    switchArticleMinimized,
    updateUserSettings
} from '../../actions';

import {
    getArticlesCount,
    getCategorizedArticles
} from '../../selectors';

import Loader from '../theme/loader';

import ArticleOrderDisplay from './display/order';
import ArticleTimelineDisplay from './display/timeline';


export default @connect((state, props) => ({
    currentUserId: state.userState.currentId,
    currentUserSlug: state.userState.currentSlug,
    currentUserTopicId: state.topicState.currentUserTopicId,
    currentUserTopicSlug: state.topicState.currentUserTopicSlug,
    currentArticleState: state.articleState.currentState.value,
    articleOrderMode: state.uiState.articleOrderMode,
    articleDisplayMode: state.uiState.articleDisplayMode,
    articlesCount: getArticlesCount(state),
    categorizedArticles: getCategorizedArticles(state, props),
    articlePagination: state.articleState.pagination,
    currentArticles: state.uiState.currentArticles
}), {
    switchArticleMinimized,
    updateUserSettings
})
class ArticleSidebar extends React.Component {
    static propTypes = {
        parentTagSlug: PropTypes.string,
        // from connect
        currentUserId: PropTypes.number,
        currentUserSlug: PropTypes.string,
        currentUserTopicId: PropTypes.number,
        currentUserTopicSlug: PropTypes.string,
        currentArticleState: PropTypes.string,
        articleOrderMode: PropTypes.string,
        articleDisplayMode: PropTypes.string,
        articlesCount: PropTypes.number,
        categorizedArticles: PropTypes.object,
        articlePagination: PropTypes.object,
        currentArticles: PropTypes.array,
        switchArticleMinimized: PropTypes.func,
        updateUserSettings: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    _handleOrderChange = (order) => {
        // Articles are updated when order params added to URL
        this.props.updateUserSettings(this.props.currentUserId, {
            articleOrder: order
        }, {
            topicId: this.props.currentUserTopicId
        });
    };

    render() {
        return (
            <div className="article-sidebar-root">
                <h2 className="article-sidebar-title">
                    {I18n.t('js.article.toc.title')}
                </h2>

                {
                    this.props.currentArticleState === 'fetching'
                        ?
                        <div className="center margin-top-25">
                            <Loader size="big"/>
                        </div>
                        :
                        (
                            this.props.articlesCount === 0
                                ?
                                <span className="article-sidebar-none">
                                    {I18n.t('js.article.toc.no_articles')}
                                </span>
                                :
                                <>
                                    <ArticleOrderDisplay currentUserSlug={this.props.currentUserSlug}
                                                         currentUserTopicSlug={this.props.currentUserTopicSlug}
                                                         currentUserTagSlug={this.props.parentTagSlug}
                                                         articleOrderMode={this.props.articleOrderMode}
                                                         articleDisplayMode={this.props.articleDisplayMode}
                                                         onMinimized={this.props.switchArticleMinimized}
                                                         onOrderChange={this._handleOrderChange}/>

                                    <ArticleTimelineDisplay categorizedArticles={this.props.categorizedArticles}
                                                            articlePagination={this.props.articlePagination}
                                                            currentArticles={this.props.currentArticles}/>
                                </>
                        )
                }
            </div>
        );
    }
}
