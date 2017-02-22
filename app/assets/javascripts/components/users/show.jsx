'use strict';

const UserComplete = require('./complete');

var UserShow = React.createClass({
    propTypes: {
        userId: React.PropTypes.number,
        params: React.PropTypes.object
    },

    contextTypes: {
        router: React.PropTypes.object
    },

    getDefaultProps () {
        return {
            userId: null,
            params: {}
        };
    },

    _handleEditClick () {
        this.context.router.push(`/user/profile/${this.props.userId || this.props.params.userPseudo}/edit`);
    },

    render () {
        return (
            <div>
                {
                    (this.props.userId || this.props.params.userPseudo) &&
                    <UserComplete userId={this.props.userId || this.props.params.userPseudo}
                                  isAdmin={$app.user.isAdmin()}
                                  onEditClick={this._handleEditClick}/>
                }
            </div>
        );
    }
});

module.exports = UserShow;
