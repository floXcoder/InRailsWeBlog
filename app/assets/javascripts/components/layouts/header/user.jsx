'use strict';

import {
    Link
} from 'react-router-dom';

import {
    Popup
} from 'semantic-ui-react';

const HomeUserHeader = ({isUserConnected, isAdminConnected, isOpened, onUserPopup, onLoginClick, onSignupClick, userSlug}) => {
    const button = (
        <a className="btn-floating waves-effect waves-light header-button">
            <span className="material-icons left"
                  data-icon="account_circle"
                  aria-hidden="true"/>
        </a>
    );

    const popup = (
        <ul className="collection">
            {
                isAdminConnected &&
                <li className="collection-item">
                    <a href="/admin">
                        {I18n.t('js.views.header.user.administration')}
                    </a>
                </li>
            }

            {
                !isUserConnected &&
                <li className="collection-item">
                    <a href="/signup"
                       onClick={onSignupClick}>
                        {I18n.t('js.views.header.user.sign_up')}
                    </a>
                </li>
            }

            {
                !isUserConnected &&
                <li className="collection-item">
                    <a href="/login"
                       onClick={onLoginClick}>
                        {I18n.t('js.views.header.user.log_in')}
                    </a>
                </li>
            }

            {
                isUserConnected &&
                <li className="collection-item">
                    <a href={`/user/profile/${userSlug}`}>
                        {I18n.t('js.views.header.user.profile')}
                    </a>
                </li>
            }

            {
                isUserConnected &&
                <li className="collection-item">
                    <a href="/logout"
                       data-method="delete"
                       rel="nofollow">
                        {I18n.t('js.views.header.user.log_out')}
                    </a>
                </li>
            }
        </ul>
    );

    return (
        <Popup trigger={button}
               content={popup}
               on="click"
               open={isOpened}
               onClose={onUserPopup}
               onOpen={onUserPopup}
               hideOnScroll={true}
               flowing={true}
               position="bottom center"/>
    );
};

HomeUserHeader.propTypes = {
    isUserConnected: PropTypes.bool.isRequired,
    isAdminConnected: PropTypes.bool.isRequired,
    isOpened: PropTypes.bool.isRequired,
    onUserPopup: PropTypes.func.isRequired,
    onLoginClick: PropTypes.func.isRequired,
    onSignupClick: PropTypes.func.isRequired,
    userSlug: PropTypes.string
};

export default HomeUserHeader;
