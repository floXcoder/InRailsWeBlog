'use strict';

import UserComplete from './complete';

export default class UserShow extends React.Component {
    static propTypes = {
        router: PropTypes.object.isRequired,
        userId: PropTypes.number,
        params: PropTypes.object
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
