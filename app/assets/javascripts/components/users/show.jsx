'use strict';

import {
    withRouter
} from 'react-router-dom';

import UserComplete from './complete';

@withRouter
export default class UserShow extends React.Component {
    static propTypes = {
        history: PropTypes.func.isRequired,
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
        this.props.history.push(`/user/profile/${this.props.userId || this.props.params.userPseudo}/edit`);
    };

    render() {
        // TODO: use redux global state instead of $app
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
