'use strict';

import _ from 'lodash';

import AssociatedTagList from './list';

// TODO
// import ArticleActions from '../../../actions/articleActions';
// import ArticleStore from '../../../stores/articleStore';

import Spinner from '../../../components/materialize/spinner';

export default class AssociatedTagBox extends React.Component {
    static propTypes = {
        hasMore: PropTypes.bool
    };

    static defaultProps = {
        hasMore: false
    };

    constructor(props) {
        super(props);

        this.mapStoreToState(ArticleStore, this.onArticleChange);
    }

    state = {
        associatedTags: null,
        isLoading: true
    };

    onArticleChange(articleData) {
        if ($.isEmpty(articleData)) {
            return;
        }

        if (!$.isEmpty(articleData.articles)) {
            let associatedTags = [];

            articleData.articles.forEach((article) => {
                if (!$.isEmpty(article.tags)) {
                    associatedTags = associatedTags.concat(article.tags);
                }
            });

            associatedTags = _.uniq(associatedTags, (tag) => {
                return tag.id;
            });

            this.setState({
                associatedTags: associatedTags,
                isLoading: false
            });
        }
    }

    _handleTagClick = (tagId, activeTag) => {
        // TODO
        // ArticleActions.filterArticlesByTag(tagId, activeTag);
    };

    render() {
        const loaderClass = classNames({
            'center': this.props.hasMore,
            'hide': !this.props.hasMore
        });

        return (
            <div className="blog-associated-tag center-align">
                {
                    this.state.associatedTags &&
                    <AssociatedTagList tags={this.state.associatedTags}
                                       onClickTag={this._handleTagClick}/>
                }

                <div className={loaderClass}>
                    <Spinner />
                </div>
            </div>
        );
    }
}
