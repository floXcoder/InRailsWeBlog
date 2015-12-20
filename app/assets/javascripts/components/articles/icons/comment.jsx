'use strict';

var ArticleCommentIcon = React.createClass({
    propTypes: {
        articleLink: React.PropTypes.string.isRequired,
        commentsNumber: React.PropTypes.number.isRequired
    },

    render () {
        if (this.props.commentsNumber > 0) {
            return (
                <a href={this.props.articleLink + '#comments'}
                   className="article-comment-number">
                    <div className="tooltipped"
                         data-tooltip={I18n.t('js.article.tooltip.comments_number', {number: this.props.commentsNumber})}>
                        {this.props.commentsNumber}
                        <i className="material-icons">comment</i>
                    </div>
                </a>
            );
        } else {
            return null;
        }
    }
});

module.exports = ArticleCommentIcon;
