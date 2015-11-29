'use strict';

var ArticleLinkIcon = React.createClass({
    propTypes: {
        isLink: React.PropTypes.bool.isRequired
    },

    render () {
        if (this.props.isLink) {
            return (
                <div className="article-link tooltipped btn-floating"
                     data-tooltip={I18n.t('js.article.tooltip.is_link')}>
                    <i className="material-icons">link</i>
                </div>
            );
        } else {
            return null;
        }
    }
});

module.exports = ArticleLinkIcon;
