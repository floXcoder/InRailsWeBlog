'use strict';

import _ from 'lodash';

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
    isFetching: state.articleState.isFetching,
    articles: getArticles(state),
    articleDisplayMode: state.uiState.articleDisplayMode,
}), {
    fetchArticles
})
export default class ArticleIndex extends React.Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        // From connect
        isFetching: PropTypes.bool,
        articles: PropTypes.array,
        articleDisplayMode: PropTypes.string,
        fetchArticles: PropTypes.func
    };

    constructor(props) {
        super(props);

        props.fetchArticles(props.params);
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.params, nextProps.params)) {
            this.props.fetchArticles(this.props.params);
        }
    }

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
