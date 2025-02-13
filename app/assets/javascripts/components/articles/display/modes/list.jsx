import React, {
    Fragment
} from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import I18n from '@js/modules/translations';

import {
    getOrderedArticles
} from '@js/selectors/articleSelectors';

import ArticleItemsDisplay from '@js/components/articles/display/items';


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
            <ArticleItemsDisplay key={article.id}
                                 article={article}
                                 articleDisplayMode={this.props.articleDisplayMode}
                                 articleEditionId={this.props.articleEditionId}
                                 isMinimized={this.props.isMinimized}
                                 isUserArticlesList={this.props.isUserArticlesList}
                                 onEnter={this.props.onEnter}
                                 onExit={this.props.onExit}/>
        );
    };

    render() {
        if (Array.isArray(this.props.orderedArticles)) {
            return (
                <div>
                    {
                        this.props.orderedArticles.map(this._renderArticle)
                    }
                </div>
            );
        } else {
            return (
                <div>
                    {
                        Object.keys(this.props.orderedArticles)
                            .map((key) => (
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
                </div>
            );
        }
    }
}

export default connect((state, props) => ({
    orderedArticles: getOrderedArticles(state, props),
    articleDisplayMode: state.uiState.articleDisplayMode
}))(ArticleListMode);