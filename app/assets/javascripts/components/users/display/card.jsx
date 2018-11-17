'use strict';

const UserCardDisplay = ({user, onUserClick}) => (
    <div className="card small hoverable user-card">
        <div className="user-image center-align">
            {user.avatar ?
                <img className="circle responsive-img"
                     src={user.avatar}
                     alt="User avatar"/> :
                <div className="user-no-image valign-wrapper center-align">
                    <span className="material-icons valign"
                          data-icon="account_circle"
                          aria-hidden="true"/>
                </div>

            }
            <span className="card-title">
                        {user.pseudo}
                    </span>
        </div>

        <div className="card-action center-align">
            {
                <a href={`/users/${user.id}`}
                   onClick={_handleClick.bind(null, user.id, onUserClick)}>
                    {I18n.t('js.user.index.link_to_user')}
                </a>
            }
        </div>
    </div>
);

const _handleClick = (userId, onUserClick, event) => {
    onUserClick(userId, event);
};

UserCardDisplay.propTypes = {
    user: PropTypes.object.isRequired,
    onUserClick: PropTypes.func
};

export default UserCardDisplay;
