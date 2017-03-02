'use strict';

import UserStore from '../../../stores/userStore';

import {Link} from 'react-router';

const UserAvatarIcon = ({user, className}) => (
    <Link className={className}
          to={`/user/profile/${user.slug}`}
          onClick={(event) => {
              UserAvatarIcon._handleUserClick(user.id, event)
          }}>
        <div className="chip user-avatar">
            {
                user.avatar
                    ?
                    <img src={user.avatar}
                         alt="User avatar"/>
                    :
                    <i className="material-icons">account_circle</i>
            }

            <div className="pseudo">
                {user.pseudo}
            </div>
        </div>
    </Link>
);

UserAvatarIcon.propTypes = {
    user: React.PropTypes.object.isRequired,
    className: React.PropTypes.string
};

UserAvatarIcon.getDefaultProps = {
    className: null
};

UserAvatarIcon._handleUserClick = (userId, event) => {
    UserStore.onTrackClick(userId);
    return event;
};

export default UserAvatarIcon;
