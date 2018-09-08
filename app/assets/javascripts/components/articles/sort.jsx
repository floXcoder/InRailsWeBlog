'use strict';

import {
    fetchArticles,
    updateArticlePriority
} from '../../actions';

import {
    getArticles
} from '../../selectors';

import Loader from '../theme/loader';

import ArticleSorter from './sort/sorter';

export default @connect((state) => ({
    currentUserId: state.userState.currentId,
    currentTopicId: state.topicState.currentTopicId,
    currentTopicSlug: state.topicState.currentTopic && state.topicState.currentTopic.slug,
    isFetching: state.articleState.isFetching,
    articles: getArticles(state)
}), {
    fetchArticles,
    updateArticlePriority
})
class ArticleSort extends React.Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        // From connect
        currentUserId: PropTypes.number,
        currentTopicId: PropTypes.number,
        currentTopicSlug: PropTypes.string,
        isFetching: PropTypes.bool,
        articles: PropTypes.array,
        fetchArticles: PropTypes.func,
        updateArticlePriority: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchArticles({
            userId: this.props.params.currentUserId || this.props.currentUserId,
            topicId: this.props.params.currentTopicId || this.props.currentTopicId,
            order: 'priority_desc',
            ...this.props.params
        }, {
            summary: true,
            limit: 1000
        });
    }

    _handleUpdatePriority = (articleIds) => {
        this.props.updateArticlePriority(articleIds)
            .then(() => this.props.history.push(`/user/${this.props.currentTopicSlug}`));
    };

    render() {
        return (
            <div className="article-sort">
                {
                    (this.props.isFetching && this.props.articles.length === 0) &&
                    <div className="center margin-top-20">
                        <Loader size="big"/>
                    </div>
                }

                {
                    this.props.articles.length > 0 &&
                    <ArticleSorter key={Utils.uuid()}
                                   articles={this.props.articles}
                                   topicSlug={this.props.currentTopicSlug}
                                   updateArticlePriority={this._handleUpdatePriority}/>
                }
            </div>
        );
    }
}
