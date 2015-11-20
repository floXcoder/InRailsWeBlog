"use strict";

var ArticleEditIcon = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired,
        onClickEdit: React.PropTypes.func.isRequired,
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
                     data-tooltip={I18n.t('js.article.tooltip.edit')}
                     onClick={this.props.onClickEdit} >
                    <i className="material-icons article-edit">mode_edit</i>
                </div>
            );
        } else {
            return null;
        }
    }
});

module.exports = ArticleEditIcon;
