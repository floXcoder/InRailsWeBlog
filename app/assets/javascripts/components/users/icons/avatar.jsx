'use strict';

import {
    Link
} from 'react-router-dom';

import {
    spyTrackClick
} from '../../../actions';

const UserAvatarIcon = ({user, className}) => (
    <Link className={className}
          to={`/user/profile/${user.slug}`}
          onClick={spyTrackClick.bind(null, 'tag', user.id)}>
        <div className="chip user-avatar">
            {
                user.avatar
                    ?
                    <img src={user.avatar}
                         alt="User avatar"/>
                    :
                    <span className="material-icons"
                          data-icon="account_circle"
                          aria-hidden="true"/>
            }

            <div className="pseudo">
                {user.pseudo}
            </div>
        </div>
    </Link>
);

UserAvatarIcon.propTypes = {
    user: PropTypes.object.isRequired,
    className: PropTypes.string
};

export default UserAvatarIcon;
