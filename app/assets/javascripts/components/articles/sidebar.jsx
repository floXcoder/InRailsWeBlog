'use strict';

import {
    withStyles
} from '@material-ui/core/styles';

import {
    switchArticleMinimized,
    updateUserSettings
} from '../../actions';

import {
    getArticles,
    getCurrentArticles,
    getSortedTopicTags
} from '../../selectors';

import ArticleOrderDisplay from './display/order';

import styles from '../../../jss/article/sidebar';

export default @connect((state) => ({
    currentUserId: state.userState.currentId,
    currentUserSlug: state.userState.currentSlug,
    currentUserTopicId: state.topicState.currentUserTopicId,
    currentUserTopicSlug: state.topicState.currentUserTopicSlug,
    articleOrderMode: state.uiState.articleOrderMode,
    articles: getArticles(state),
    currentArticles: getCurrentArticles(state),
    tags: getSortedTopicTags(state)
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
        articles: PropTypes.array,
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
            <div>
                <h2>
                    {I18n.t('js.article.toc.title')}
                </h2>

                <div>
                    <ArticleOrderDisplay classes={this.props.classes}
                                         currentUserId={this.props.currentUserId}
                                         currentUserSlug={this.props.currentUserSlug}
                                         currentUserTopicSlug={this.props.currentUserTopicSlug}
                                         articleOrderMode={this.props.articleOrderMode}
                                         onMinimized={this.props.switchArticleMinimized}
                                         onOrderChange={this._handleOrderChange}/>
                </div>

                <div>
                    {
                        this.props.articles.map((article) => (
                            <div key={article.id}>
                                <a href={'#' + article.id}
                                   className={classNames(this.props.classes.articleLink, {
                                       [this.props.classes.currentLink]: this.props.currentArticles.includes(article.id)
                                   })}>
                                    {article.title}
                                </a>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}
