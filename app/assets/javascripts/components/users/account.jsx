'use strict';

// Load Login and Signup modals
import ConnectionLoader from '../../loaders/connection';

_.defer(() => {
    ConnectionLoader().then(({Login, Signup}) => {
        ReactDOM.render(
            <Login launcherClass="login-link"/>,
            document.getElementById('login-modal-component')
        );

        ReactDOM.render(
            <Signup launcherClass="signup-link"/>,
            document.getElementById('signup-modal-component')
        );
    });
});

// Synchronize local data with user account just after sign in ou up
import UserActions from '../../actions/userActions';
if (window.userJustSign) {
    UserActions.synchronize();
}
