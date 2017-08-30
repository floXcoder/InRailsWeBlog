'use strict';

// TODO
// import UserStore from '../../../stores/userStore';

import {
    Link
} from 'react-router-dom';

const UserAvatarIcon = ({user, className}) => (
    <Link className={className}
          to={`/user/profile/${user.slug}`}
          onClick={_handleUserClick.bind(undefined, user.id)}>
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

const _handleUserClick = (userId, event) => {
    // TODO
    // UserStore.onTrackClick(userId);
    return event;
};

UserAvatarIcon.propTypes = {
    user: PropTypes.object.isRequired,
    className: PropTypes.string
};

UserAvatarIcon.getDefaultProps = {
    className: null
};

export default UserAvatarIcon;
