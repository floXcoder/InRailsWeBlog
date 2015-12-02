'use strict';

var ArticleEditIcon = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired,
        onClickEdit: React.PropTypes.func.isRequired,
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
                <a className="article-edit tooltipped btn-floating"
                     data-tooltip={I18n.t('js.article.tooltip.edit')}
                     onClick={this.props.onClickEdit} >
                    <i className="material-icons">mode_edit</i>
                </a>
            );
        } else {
            return null;
        }
    }
});

module.exports = ArticleEditIcon;
