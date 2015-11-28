'use strict';

var ArticleBookmarkIcon = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired,
        onClickBookmark: React.PropTypes.func.isRequired,
        userId: React.PropTypes.number
    },

    getDefaultProps () {
        return {
            userId: null
        };
    },

    getInitialState () {
        return {
            isBookmarked: this.props.article.is_bookmarked
        };
    },

    _onClickBookmark (articleId, event) {
        this.props.onClickBookmark(articleId, event);
        this.setState({isBookmarked: !this.state.isBookmarked})
    },

    render () {
        if(this.props.userId) {
            let bookmarkClass = "material-icons" + (this.state.isBookmarked ? " article-bookmarked" : '');
            let bookmarkTooltip = I18n.t('js.article.tooltip.bookmark');

            return (
                <div className="article-icons tooltipped"
                     data-tooltip={bookmarkTooltip}
                     onClick={this._onClickBookmark.bind(this, this.props.article.id)} >
                    <i className={bookmarkClass} >bookmark</i>
                </div>
            );
        } else {
            return null;
        }
    }
});

module.exports = ArticleBookmarkIcon;
