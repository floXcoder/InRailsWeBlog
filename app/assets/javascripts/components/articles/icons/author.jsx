'use strict';

var UserStore = require('../../../stores/userStore');

var ArticleAuthorIcon = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired,
        onAuthorClick: React.PropTypes.func
    },

    getDefaultProps () {
        return {
            onAuthorClick: null
        };
    },

    _handleAuthorClick (authorId, event) {
        UserStore.onTrackClick(authorId);

        if (this.props.onAuthorClick) {
            this.props.onAuthorClick(authorId);
        }

        return event;
    },

    render () {
        if (this.props.article.author) {
            return (
                <a className="article-author"
                   href={'/users/' + this.props.article.author.slug}
                   onClick={this._handleAuthorClick.bind(this, this.props.article.author.id)}>
                    <i className="material-icons">account_circle</i>
                    {this.props.article.author.pseudo}
                </a>
            );
        } else {
            return null;
        }
    }
});

module.exports = ArticleAuthorIcon;
