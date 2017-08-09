'use strict';

import '../common';

import UserShow from '../../components/users/show';

const user = JSON.parse(document.getElementById('user-show-component').getAttribute('data-user'));
const isCurrentUser = JSON.parse(document.getElementById('user-show-component').getAttribute('data-current'));

ReactDOM.render(
    <UserShow user={user.user}
              isCurrentUser={isCurrentUser}/>,
    document.getElementById('user-show-component')
);
