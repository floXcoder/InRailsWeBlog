'use strict';

import {
    hot
} from 'react-hot-loader';

import {
    TransitionGroup,
    CSSTransition
} from 'react-transition-group';

import {
    getOrderedArticles
} from '../../../../selectors';

import ArticleItemDisplay from '../item';

export default @connect((state, props) => ({
    orderedArticles: getOrderedArticles(state, props),
    articleDisplayMode: state.uiState.articleDisplayMode
}))
@hot(module)
class ArticleListMode extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        isMinimized: PropTypes.bool,
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
                <ArticleItemDisplay article={article}
                                    articleDisplayMode={this.props.articleDisplayMode}
                                    articleEditionId={this.props.articleEditionId}
                                    isMinimized={this.props.isMinimized}
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
                            <React.Fragment key={key}>
                                <h2 className={this.props.classes.tagTitle}>
                                    {
                                        key === 'undefined' ? I18n.t('js.article.common.tags.none') : key
                                    }
                                </h2>

                                {
                                    this.props.orderedArticles[key].map(this._renderArticle)
                                }
                            </React.Fragment>
                        ))
                    }
                </TransitionGroup>
            );
        }
    }
}
