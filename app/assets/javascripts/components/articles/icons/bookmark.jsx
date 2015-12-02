'use strict';

var classNames = require('classnames');

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
        if (this.props.userId) {
            let bookmarkClasses = classNames('material-icons', {'article-bookmarked': this.state.isBookmarked});
            let bookmarkTooltip = this.state.isBookmarked ?
                I18n.t('js.article.tooltip.remove_bookmark') :
                I18n.t('js.article.tooltip.add_bookmark');

            return (
                <a className="tooltipped btn-floating"
                   data-tooltip={bookmarkTooltip}
                   onClick={this._onClickBookmark.bind(this, this.props.article.id)}>
                    <i className={bookmarkClasses}>bookmark</i>
                </a>
            );
        } else {
            return null;
        }
    }
});

module.exports = ArticleBookmarkIcon;
