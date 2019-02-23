'use strict';

import {
    withStyles
} from '@material-ui/core/styles';

import {
    switchArticleMinimized,
    updateUserSettings
} from '../../actions';

import {
    getArticlesCount,
    getCategorizedArticles,
    getArticlePagination,
    getCurrentArticles
} from '../../selectors';

import ArticleOrderDisplay from './display/order';
import ArticleTimelineDisplay from './display/timeline';

import styles from '../../../jss/article/sidebar';

export default @connect((state, props) => ({
    currentUserId: state.userState.currentId,
    currentUserSlug: state.userState.currentSlug,
    currentUserTopicId: state.topicState.currentUserTopicId,
    currentUserTopicSlug: state.topicState.currentUserTopicSlug,
    articleOrderMode: state.uiState.articleOrderMode,
    articlesCount: getArticlesCount(state),
    categorizedArticles: getCategorizedArticles(state, props),
    articlePagination: getArticlePagination(state),
    currentArticles: getCurrentArticles(state)
}), {
    switchArticleMinimized,
    updateUserSettings
})
@withStyles(styles)
class ArticleSidebar extends React.Component {
    static propTypes = {
        // from connect
        currentUserId: PropTypes.number,
        currentUserSlug: PropTypes.string,
        currentUserTopicId: PropTypes.number,
        currentUserTopicSlug: PropTypes.string,
        articleOrderMode: PropTypes.string,
        articlesCount: PropTypes.number,
        categorizedArticles: PropTypes.object,
        articlePagination: PropTypes.object,
        currentArticles: PropTypes.array,
        switchArticleMinimized: PropTypes.func,
        updateUserSettings: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    _handleOrderChange = (order) => {
        this.props.updateUserSettings(this.props.currentUserId, {
            articleOrder: order
        }, {
            topicId: this.props.currentUserTopicId
        });
    };

    render() {
        return (
            <div className={this.props.classes.root}>
                <h2 className={this.props.classes.title}>
                    {I18n.t('js.article.toc.title')}
                </h2>

                {
                    this.props.articlesCount === 0
                        ?
                        <span className={this.props.classes.none}>
                            {I18n.t('js.article.toc.no_articles')}
                        </span>
                        :
                        <>
                            <ArticleOrderDisplay classes={this.props.classes}
                                                 currentUserId={this.props.currentUserId}
                                                 currentUserSlug={this.props.currentUserSlug}
                                                 currentUserTopicSlug={this.props.currentUserTopicSlug}
                                                 articleOrderMode={this.props.articleOrderMode}
                                                 onMinimized={this.props.switchArticleMinimized}
                                                 onOrderChange={this._handleOrderChange}/>

                            <ArticleTimelineDisplay classes={this.props.classes}
                                                    categorizedArticles={this.props.categorizedArticles}
                                                    articlePagination={this.props.articlePagination}
                                                    currentArticles={this.props.currentArticles}/>
                        </>
                }
            </div>
        );
    }
}
