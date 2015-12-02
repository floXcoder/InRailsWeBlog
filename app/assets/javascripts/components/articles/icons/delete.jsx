'use strict';

var ArticleDeleteIcon = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired,
        onClickDelete: React.PropTypes.func.isRequired,
        currentUserId: React.PropTypes.number
    },

    getDefaultProps () {
        return {
            currentUserId: null
        };
    },

    render () {
        if (this.props.currentUserId && this.props.currentUserId === this.props.article.author.id) {
            return (
                <a className="article-delete tooltipped btn-floating"
                     data-tooltip={I18n.t('js.article.tooltip.delete')}
                     onClick={this.props.onClickDelete}>
                    <i className="material-icons">delete</i>
                </a>
            );
        } else {
            return null;
        }
    }
});

module.exports = ArticleDeleteIcon;
