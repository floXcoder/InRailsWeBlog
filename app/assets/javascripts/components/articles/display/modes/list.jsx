'use strict';

import {
    Fragment
} from 'react';

import {
    hot
} from 'react-hot-loader/root';

import {
    TransitionGroup,
    CSSTransition
} from 'react-transition-group';

import {
    getOrderedArticles
} from '../../../../selectors';

import ArticleItemsDisplay from '../items';

export default @connect((state, props) => ({
    orderedArticles: getOrderedArticles(state, props),
    articleDisplayMode: state.uiState.articleDisplayMode
}))
@hot
class ArticleListMode extends React.Component {
    static propTypes = {
        isMinimized: PropTypes.bool,
        isUserArticlesList: PropTypes.bool,
        articleEditionId: PropTypes.number,
        onEnter: PropTypes.func,
        onExit: PropTypes.func,
        // from connect
        orderedArticles: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object
        ]),
        articleDisplayMode: PropTypes.string
    };

    static defaultProps = {
        isMinimized: false
    };

    constructor(props) {
        super(props);
    }

    _renderArticle = (article) => {
        return (
            <CSSTransition key={article.id}
                           timeout={150}
                           classNames="article">
                <ArticleItemsDisplay article={article}
                                     articleDisplayMode={this.props.articleDisplayMode}
                                     articleEditionId={this.props.articleEditionId}
                                     isMinimized={this.props.isMinimized}
                                     isUserArticlesList={this.props.isUserArticlesList}
                                     onEnter={this.props.onEnter}
                                     onExit={this.props.onExit}/>
            </CSSTransition>
        );
    };

    render() {
        if (Array.isArray(this.props.orderedArticles)) {
            return (
                <TransitionGroup component="div">
                    {
                        this.props.orderedArticles.map(this._renderArticle)
                    }
                </TransitionGroup>
            );
        } else {
            return (
                <TransitionGroup component="div">
                    {
                        Object.keys(this.props.orderedArticles).map((key) => (
                            <Fragment key={key}>
                                <h2 className="article-list-tag-title">
                                    {
                                        key === 'undefined' ? I18n.t('js.article.common.tags.none') : key
                                    }
                                </h2>

                                {
                                    this.props.orderedArticles[key].map(this._renderArticle)
                                }
                            </Fragment>
                        ))
                    }
                </TransitionGroup>
            );
        }
    }
}
