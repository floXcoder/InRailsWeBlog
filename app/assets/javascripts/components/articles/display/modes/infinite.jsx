'use strict';

import {
    hot
} from 'react-hot-loader';

import InfiniteScroll from 'react-infinite-scroll-component';

export default @hot(module)
class ArticleInfiniteMode extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
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
            <div className={this.props.classes.infiniteText}>
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
