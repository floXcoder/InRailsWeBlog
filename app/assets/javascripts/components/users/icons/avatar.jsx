'use strict';

var UserStore = require('../../../stores/userStore');

var UserAvatarIcon = React.createClass({
    propTypes: {
        user: React.PropTypes.object.isRequired,
        className: React.PropTypes.string
    },

    getDefaultProps () {
        return {};
    },

    _handleAuthorClick (authorId, event) {
        UserStore.onTrackClick(authorId);
        return event;
    },

    render () {
        return (
            <a className={this.props.className}
               href={`/users/${this.props.user.slug}`}
               onClick={this._handleAuthorClick.bind(this, this.props.user.id)}>
                <div className="chip user-avatar">
                    {
                        this.props.user.avatar ?
                            <img src={this.props.user.avatar}
                                 alt="User avatar"/> :
                            <i className="material-icons">account_circle</i>
                    }
                    {this.props.user.pseudo}
                </div>
            </a>
        );
    }
});

module.exports = UserAvatarIcon;
