var ArticleDeleteIcon = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired,
        onClickDelete: React.PropTypes.func.isRequired,
        userId: React.PropTypes.number
    },

    getDefaultProps: function () {
        return {
            userId: null
        };
    },

    render: function () {
        if (this.props.userId && this.props.userId === this.props.article.author.id) {
            return (
                <div className="article-icons tooltipped"
                     data-tooltip={I18n.t('js.article.tooltip.delete')}
                     onClick={this.props.onClickDelete}>
                    <i className="material-icons article-delete">delete</i>
                </div>
            );
        } else {
            return null;
        }
    }
});

module.exports = ArticleDeleteIcon;
