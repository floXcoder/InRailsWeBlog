'use strict';

import {
    hot
} from 'react-hot-loader/root';

import InfiniteScroll from 'react-infinite-scroll-component';

export default @hot
class ArticleInfiniteMode extends React.Component {
    static propTypes = {
        fetchArticles: PropTypes.func.isRequired,
        articlesCount: PropTypes.number.isRequired,
        children: PropTypes.object.isRequired,
        hasMoreArticles: PropTypes.bool,
    };

    static defaultProps = {
        hasMoreArticles: false,
    };

    constructor(props) {
        super(props);
    }

    render() {
        const LoadingArticles = (
            <div className="article-infinite-text">
                {I18n.t('js.article.common.infinite.loading')}
            </div>
        );

        return (
            <InfiniteScroll dataLength={this.props.articlesCount}
                            next={this.props.fetchArticles}
                            hasMore={this.props.hasMoreArticles}
                            loader={LoadingArticles}>
                {this.props.children}
            </InfiniteScroll>
        );
    }
}
