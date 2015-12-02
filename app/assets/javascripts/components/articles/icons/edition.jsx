'use strict';

var ArticleEditionIcons = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired,
        currentUserId: React.PropTypes.number.isRequired,
        onClickDelete: React.PropTypes.func.isRequired,
        onClickCancel: React.PropTypes.func.isRequired,
        onClickSave: React.PropTypes.func.isRequired
    },

    componentDidMount () {
        $('.article-edition .tooltipped').tooltip('remove');
    },

    componentWillUnmount () {
        $('.article-editing .tooltipped').tooltip('remove');
    },

    render () {
        if (this.props.currentUserId && this.props.currentUserId === this.props.article.author.id) {
            return (
                <div className="article-editing">
                    <a className="article-delete tooltipped btn-floating"
                       data-tooltip={I18n.t('js.article.tooltip.delete')}
                       onClick={this.props.onClickDelete} >
                        <i className="material-icons">delete</i>
                    </a>
                    <a className="article-cancel tooltipped btn-floating"
                       data-tooltip={I18n.t('js.article.tooltip.cancel')}
                       onClick={this.props.onClickCancel} >
                        <i className="material-icons">clear</i>
                    </a>
                    <a className="article-update tooltipped btn-floating"
                       data-tooltip={I18n.t('js.article.tooltip.update')}
                       onClick={this.props.onClickSave} >
                        <i className="material-icons">check</i>
                    </a>
                </div>
            );
        }
    }
});

module.exports = ArticleEditionIcons;
