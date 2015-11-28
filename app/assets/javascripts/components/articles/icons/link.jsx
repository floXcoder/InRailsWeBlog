'use strict';

var ArticleLinkIcon = React.createClass({
    propTypes: {
        isLink: React.PropTypes.bool.isRequired
    },

    render () {
        if (this.props.isLink) {
            return (
                <div className="article-icons tooltipped"
                     data-tooltip={I18n.t('js.article.tooltip.link')}>
                    <i className="material-icons article-link">link</i>
                </div>
            );
        } else {
            return null;
        }
    }
});

module.exports = ArticleLinkIcon;
