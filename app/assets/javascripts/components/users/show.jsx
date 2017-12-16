'use strict';

import UserComplete from './complete';

export default class UserShow extends React.Component {
    static propTypes = {
        // From router
        history: PropTypes.func,
        userId: PropTypes.number,
        params: PropTypes.object
    };

    static defaultProps = {
        params: {}
    };

    constructor(props) {
        super(props);
    }

    render() {
        // TODO: use redux global state instead of $app
        return (
            <div>
                {
                    (this.props.userId || this.props.params.userPseudo) &&
                    <UserComplete userId={this.props.userId || this.props.params.userPseudo}
                                  isAdmin={$app.isAdminConnected()}/>
                }
            </div>
        );
    }
}
