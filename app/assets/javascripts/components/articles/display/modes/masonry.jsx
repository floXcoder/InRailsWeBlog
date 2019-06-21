'use strict';

import {
    hot
} from 'react-hot-loader/root';

import {
    getArticles
} from '../../../../selectors';

import MasonryWrapper from '../../../theme/masonry';

import ArticleItemsDisplay from '../items';

const ArticleMasonry = MasonryWrapper(ArticleItemsDisplay, {articleDisplayMode: 'grid'}, ArticleItemsDisplay, {articleDisplayMode: 'card'});

export default @connect((state) => ({
    articles: getArticles(state)
}))
@hot
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
