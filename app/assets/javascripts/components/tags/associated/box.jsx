'use strict';

var classNames = require('classnames');

var AssociatedTagList = require('./list');
var ArticleActions = require('../../../actions/articleActions');
var ArticleStore = require('../../../stores/articleStore');

var Spinner = require('../../../components/materialize/spinner');

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

    onArticleChange (articleStore) {
        if ($.isEmpty(articleStore)) {
            return;
        }

        if (!$.isEmpty(articleStore.articles)) {
            let associatedTags = [];

            articleStore.articles.forEach(function (article) {
                if (!$.isEmpty(article.tags)) {
                    associatedTags = associatedTags.concat(article.tags);
                }
            });

            associatedTags = _.uniq(associatedTags, function (tag) {
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

    _renderTags () {
        if (this.state.associatedTags) {
            return (
                <AssociatedTagList tags={this.state.associatedTags}
                                   onClickTag={this._handleTagClick}/>
            );
        }
    },

    render () {
        let loaderClass = classNames(
            {
                'center': this.props.hasMore,
                'hide': !this.props.hasMore
            }
        );

        return (
            <div className="blog-associated-tag center-align">
                {this._renderTags()}
                <div className={loaderClass}>
                    <Spinner />
                </div>
            </div>
        );
    }
});

module.exports = AssociatedTagBox;
