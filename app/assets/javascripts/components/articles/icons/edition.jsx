var ArticleEditionIcons = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired,
        userId: React.PropTypes.number.isRequired,
        onClickDelete: React.PropTypes.func.isRequired,
        onClickCancel: React.PropTypes.func.isRequired,
        onClickSave: React.PropTypes.func.isRequired
    },

    render: function () {
        if (this.props.userId && this.props.userId === this.props.article.author.id) {
            $('.article-edition .article-icons.tooltipped').tooltip('remove');
            return (
                <div className="article-icons">
                    <i className="material-icons article-delete tooltipped"
                       data-tooltip={I18n.t('js.article.tooltip.delete')}
                       onClick={this.props.onClickDelete}>
                        delete
                    </i>
                    <i className="material-icons article-cancel"
                       onClick={this.props.onClickCancel}>
                        clear
                    </i>
                    <i className="material-icons article-update"
                       onClick={this.props.onClickSave} >
                        check
                    </i>
                </div>
            );
        }
    }
});

module.exports = ArticleEditionIcons;
