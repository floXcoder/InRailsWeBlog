'use strict';

import _ from 'lodash';

import AssociatedTagList from './list';

import Loader from '../../theme/loader';

export default class AssociatedTagBox extends React.Component {
    static propTypes = {
        hasMore: PropTypes.bool
    };

    static defaultProps = {
        hasMore: false
    };

    constructor(props) {
        super(props);
    }

    state = {
        isLoading: true
    };

    onArticleChange(articleData) {
        if (Utils.isEmpty(articleData)) {
            return;
        }

        // TODO: move to selectors
        if (!Utils.isEmpty(articleData.articles)) {
            let associatedTags = [];

            articleData.articles.forEach((article) => {
                if (!Utils.isEmpty(article.tags)) {
                    associatedTags = associatedTags.concat(article.tags);
                }
            });

            associatedTags = _.uniq(associatedTags, (tag) => tag.id);

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
        return (
            <div className="blog-associated-tag center-align">
                {
                    this.state.associatedTags &&
                    <AssociatedTagList tags={this.state.associatedTags}
                                       onClickTag={this._handleTagClick}/>
                }

                <div className={classNames({
                    'center': this.props.hasMore,
                    'hide': !this.props.hasMore
                })}>
                    <Loader/>
                </div>
            </div>
        );
    }
}
