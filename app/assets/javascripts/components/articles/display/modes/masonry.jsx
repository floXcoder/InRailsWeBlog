import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import MasonryWrapper from '@js/components/theme/masonry';

import ArticleItemsDisplay from '@js/components/articles/display/items';

const ArticleMasonry = MasonryWrapper(ArticleItemsDisplay, {articleDisplayMode: 'grid'}, ArticleItemsDisplay, {articleDisplayMode: 'card'});


class ArticleMasonryMode extends React.Component {
    static propTypes = {
        onEnter: PropTypes.func,
        onExit: PropTypes.func,
        // from connect
        articles: PropTypes.array
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ArticleMasonry type="article"
                            elements={this.props.articles}
                            topOffset={40}
                            columnCount={3}
                            hasColumnButtons={true}
                            hasExposedMode={true}
                            isActive={true}
                            isPaginated={false}
                            onComponentEnter={this.props.onEnter}
                            onComponentExit={this.props.onExit}/>
        );
    }
}

export default connect((state) => ({
    articles: state.articleState.articles
}))(ArticleMasonryMode)