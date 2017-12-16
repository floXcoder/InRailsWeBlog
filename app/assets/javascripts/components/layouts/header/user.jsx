'use strict';

import {
    Link
} from 'react-router-dom';

import {
    Popup
} from 'semantic-ui-react';

const HomeUserHeader = ({isUserConnected, isAdminConnected, userSlug, onLoginClick, onSignupClick}) => {
    const button = (
        <a className="btn-floating waves-effect waves-light header-button topic-header-button">
            <i className="material-icons left">account_circle</i>
        </a>
    );

    const popup = (
        <ul className="collection">
            <li className="collection-item">
                <span className="title">
                    {I18n.t('js.views.header.user.profile')}
                </span>
            </li>

            {
                isAdminConnected &&
                <li className="collection-item">
                    <a href="/admin">
                        {I18n.t('js.views.header.user.administration')}
                    </a>
                </li>
            }

            {
                isAdminConnected &&
                <hr/>
            }

            {
                isUserConnected &&
                <hr/>
            }

            {
                !isUserConnected &&
                <li className="collection-item">
                    <a className="signup-link"
                       href="/signup"
                       onClick={onSignupClick}>
                        {I18n.t('js.views.header.user.sign_up')}
                    </a>
                </li>
            }

            {
                !isUserConnected &&
                <li className="collection-item">
                    <a className="login-link"
                       href="/login"
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
        <div>
            <Popup trigger={button}
                   content={popup}
                   on='click'
                   hideOnScroll={true}
                   flowing={true}
                   position='bottom center'/>
        </div>
    );
};

HomeUserHeader.propTypes = {
    isUserConnected: PropTypes.bool.isRequired,
    isAdminConnected: PropTypes.bool.isRequired,
    onLoginClick: PropTypes.func.isRequired,
    onSignupClick: PropTypes.func.isRequired,
    userSlug: PropTypes.string,
};

export default HomeUserHeader;
