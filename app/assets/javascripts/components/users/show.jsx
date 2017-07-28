'use strict';

import UserComplete from './complete';

export default class UserShow extends React.Component {
    static propTypes = {
        router: React.PropTypes.object.isRequired,
        userId: React.PropTypes.number,
        params: React.PropTypes.object
    };

    static defaultProps = {
        userId: null,
        params: {}
    };

    constructor(props) {
        super(props);
    }

    _handleEditClick = () => {
        this.props.router.history.push(`/user/profile/${this.props.userId || this.props.params.userPseudo}/edit`);
    };

    render() {
        return (
            <div>
                {
                    (this.props.userId || this.props.params.userPseudo) &&
                    <UserComplete userId={this.props.userId || this.props.params.userPseudo}
                                  isAdmin={$app.isAdminConnected()}
                                  onEditClick={this._handleEditClick}/>
                }
            </div>
        );
    }
}
