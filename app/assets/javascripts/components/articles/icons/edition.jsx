'use strict';

var ArticleEditionIcons = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired,
        onDeleteClick: React.PropTypes.func.isRequired,
        onCancelClick: React.PropTypes.func.isRequired,
        onSaveClick: React.PropTypes.func.isRequired
    },

    componentDidMount () {
        $('.article-edition .tooltipped').tooltip('remove');
    },

    componentWillUnmount () {
        $('.article-editing .tooltipped').tooltip('remove');
    },

    render () {
        if ($app.user.isConnected(this.props.article.author.id)) {
            return (
                <div className="article-editing">
                    <a className="article-delete tooltipped btn-floating"
                       data-tooltip={I18n.t('js.article.tooltip.delete')}
                       onClick={this.props.onDeleteClick} >
                        <i className="material-icons">delete</i>
                    </a>

                    <a className="article-cancel tooltipped btn-floating"
                       data-tooltip={I18n.t('js.article.tooltip.cancel')}
                       onClick={this.props.onCancelClick} >
                        <i className="material-icons">clear</i>
                    </a>

                    <a className="article-update tooltipped btn-floating"
                       data-tooltip={I18n.t('js.article.tooltip.update')}
                       onClick={this.props.onSaveClick} >
                        <i className="material-icons">check</i>
                    </a>
                </div>
            );
        }
    }
});

module.exports = ArticleEditionIcons;
