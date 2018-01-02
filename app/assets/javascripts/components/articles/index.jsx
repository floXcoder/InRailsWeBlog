'use strict';

import {
    fetchArticles
} from '../../actions';

import {
    getArticles
} from '../../selectors';

import Spinner from '../materialize/spinner';

import ArticleListDisplay from './display/list';
import ArticleNone from '../articles/display/none';

@connect((state) => ({
    userCurrentId: state.userState.currentId,
    topicCurrentId: state.topicState.currentTopic && state.topicState.currentTopic.id,
    isFetching: state.articleState.isFetching,
    articles: getArticles(state),
    articleDisplayMode: state.uiState.articleDisplayMode
}), {
    fetchArticles
})
export default class ArticleIndex extends React.Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        // From connect
        userCurrentId: PropTypes.number,
        topicCurrentId: PropTypes.number,
        isFetching: PropTypes.bool,
        articles: PropTypes.array,
        articleDisplayMode: PropTypes.string,
        fetchArticles: PropTypes.func
    };

    constructor(props) {
        super(props);

        props.fetchArticles(this._filterParams(props));
    }

    componentWillReceiveProps(nextProps) {
        if (!Object.equals(this.props.params, nextProps.params)) {
            this.props.fetchArticles(this._filterParams(nextProps.params));
        }
    }

    _filterParams = (props) => {
        return {
            userId: props.userCurrentId,
            topicId: props.topicCurrentId,
            ...props.params
        };
    };

    render() {
        return (
            <div className="blog-article-box">
                {
                    this.props.isFetching
                        ?
                        <div className="center margin-top-20">
                            <Spinner size='big'/>
                        </div>
                        :
                        this.props.articles.length > 0
                            ?
                            <ArticleListDisplay articles={this.props.articles}
                                                articleDisplayMode={this.props.articleDisplayMode}/>
                            :
                            <ArticleNone topicSlug={this.props.params.topicSlug}/>

                }
            </div>
        );
    }
}
