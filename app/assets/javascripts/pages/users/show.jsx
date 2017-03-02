'use strict';

import '../common';

import UserShow from '../../components/users/show';

const user = JSON.parse(document.getElementById('user-show-component').getAttribute('data-user'));
const rides = JSON.parse(document.getElementById('user-show-component').getAttribute('data-rides'));
const shops = JSON.parse(document.getElementById('user-show-component').getAttribute('data-shops'));
const products = JSON.parse(document.getElementById('user-show-component').getAttribute('data-products'));
const isCurrentUser = JSON.parse(document.getElementById('user-show-component').getAttribute('data-current'));

ReactDOM.render(
    <UserShow user={user.user}
              isCurrentUser={isCurrentUser}
              lastRides={rides}
              lastShops={shops}
              lastProducts={products}/>,
    document.getElementById('user-show-component')
);
