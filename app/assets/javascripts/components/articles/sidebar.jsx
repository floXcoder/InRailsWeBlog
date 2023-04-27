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
import Scrollbar from '../theme/scrollbar';

import ArticleOrderDisplay from './display/order';
import ArticleTimelineDisplay from './display/timeline';


export default @connect((state, props) => ({
    articleOrderMode: state.uiState.articleOrderMode,
    articleDisplayMode: state.uiState.articleDisplayMode,
    currentArticles: state.uiState.currentArticles,
    currentUserId: state.userState.currentId,
    currentUserSlug: state.userState.currentSlug,
    currentUserTopicId: state.topicState.currentUserTopicId,
    currentUserTopicSlug: state.topicState.currentUserTopicSlug,
    currentArticleState: state.articleState.currentState.value,
    articlePagination: state.articleState.pagination,
    articlesCount: getArticlesCount(state),
    categorizedArticles: getCategorizedArticles(state, props),
    articleTitleContent: state.articleState.articleTitleContent
}), {
    switchArticleMinimized,
    updateUserSettings
})
class ArticleSidebar extends React.Component {
    static propTypes = {
        parentTagSlug: PropTypes.string,
        isArticle: PropTypes.bool,
        // from connect
        articleOrderMode: PropTypes.string,
        articleDisplayMode: PropTypes.string,
        currentArticles: PropTypes.array,
        currentUserId: PropTypes.number,
        currentUserSlug: PropTypes.string,
        currentUserTopicId: PropTypes.number,
        currentUserTopicSlug: PropTypes.string,
        currentArticleState: PropTypes.string,
        articlePagination: PropTypes.object,
        articlesCount: PropTypes.number,
        categorizedArticles: PropTypes.object,
        articleTitleContent: PropTypes.array,
        switchArticleMinimized: PropTypes.func,
        updateUserSettings: PropTypes.func
    };

    static defaultProps = {
        isArticle: false
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

    _renderArticleList = () => {
        if (this.props.currentArticleState === 'fetching') {
            return (
                <div className="center margin-top-25">
                    <Loader size="big"/>
                </div>
            );
        } else if (this.props.articlesCount === 0) {
            return (
                <span className="article-sidebar-none">
                    {I18n.t('js.article.toc.no_articles')}
                </span>
            );
        } else {
            return (
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
            );
        }
    };

    _renderArticleContent = () => {
        return (
            <div className="article-sidebar-titles">
                <Scrollbar>
                    {
                        this.props.articleTitleContent.map((title, i) => (
                            <div className={`article-sidebar-title-${title.level.toLowerCase()}`}
                                 key={i}>
                                <a className="article-sidebar-title-link"
                                   href={`#${title.id}`}>
                                    {title.content}
                                </a>
                            </div>
                        ))
                    }
                </Scrollbar>
            </div>
        );
    };

    render() {
        if (this.props.isArticle && !this.props.articleTitleContent) {
            return null;
        }

        return (
            <div className="article-sidebar-root">
                <h2 className="article-sidebar-title">
                    {I18n.t('js.article.toc.title')}
                </h2>

                {
                    this.props.isArticle
                        ?
                        this._renderArticleContent()
                        :
                        this._renderArticleList()
                }
            </div>
        );
    }
}
