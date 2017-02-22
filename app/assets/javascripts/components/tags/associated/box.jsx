'use strict';

const classNames = require('classnames');

const AssociatedTagList = require('./list');
const ArticleActions = require('../../../actions/articleActions');
const ArticleStore = require('../../../stores/articleStore');

const Spinner = require('../../../components/materialize/spinner');

var AssociatedTagBox = React.createClass({
    propTypes: {
        hasMore: React.PropTypes.bool
    },

    mixins: [
        Reflux.listenTo(ArticleStore, 'onArticleChange')
    ],

    getDefaultProps () {
        return {
            hasMore: false
        };
    },

    getInitialState () {
        return {
            associatedTags: null,
            isLoading: true
        };
    },

    onArticleChange (articleData) {
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
    },

    _handleTagClick (tagId, activeTag) {
        ArticleActions.filterArticlesByTag(tagId, activeTag);
    },

    render () {
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
});

module.exports = AssociatedTagBox;
