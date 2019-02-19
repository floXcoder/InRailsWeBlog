'use strict';

import {
    hot
} from 'react-hot-loader';

import {
    withStyles
} from '@material-ui/core/styles';

import {
    fetchArticles,
    updateArticlePriority
} from '../../actions';

import {
    getArticles
} from '../../selectors';

import {
    sortItemLimit
} from '../modules/constants';

import Loader from '../theme/loader';

import ArticleSorter from './sort/sorter';

import styles from '../../../jss/article/sort';

export default @connect((state) => ({
    currentUserId: state.userState.currentId,
    currentUserTopicId: state.topicState.currentUserTopicId,
    currentUserTopicSlug: state.topicState.currentUserTopicSlug,
    isFetching: state.articleState.isFetching,
    articles: getArticles(state)
}), {
    fetchArticles,
    updateArticlePriority
})
@hot(module)
@withStyles(styles)
class ArticleSort extends React.Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        // from connect
        currentUserId: PropTypes.number,
        currentUserTopicId: PropTypes.number,
        currentUserTopicSlug: PropTypes.string,
        isFetching: PropTypes.bool,
        articles: PropTypes.array,
        fetchArticles: PropTypes.func,
        updateArticlePriority: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchArticles({
            userId: this.props.params.currentUserId || this.props.currentUserId,
            topicId: this.props.params.currentUserTopicId || this.props.currentUserTopicId,
            order: 'priority_desc',
            ...this.props.params
        }, {
            summary: true,
            limit: sortItemLimit
        });
    }

    _handleUpdatePriority = (articleIds) => {
        this.props.updateArticlePriority(articleIds)
            .then(() => this.props.history.push(`/users/${this.props.currentUserTopicSlug}`));
    };

    render() {
        return (
            <div className={this.props.classes.root}>
                {
                    (this.props.isFetching && this.props.articles.length === 0) &&
                    <div className="center margin-top-20">
                        <Loader size="big"/>
                    </div>
                }

                {
                    this.props.articles.length > 0 &&
                    <ArticleSorter key={Utils.uuid()}
                                   classes={this.props.classes}
                                   articles={this.props.articles}
                                   topicSlug={this.props.currentUserTopicSlug}
                                   updateArticlePriority={this._handleUpdatePriority}/>
                }
            </div>
        );
    }
}
