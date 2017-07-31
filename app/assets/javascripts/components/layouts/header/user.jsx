'use strict';

import {Link} from 'react-router-dom';

import {
    Dropdown,
    // Icon,
    Menu
} from 'semantic-ui-react'

// $app.isUserConnected()
//     ?
//     $app.isUserConnected() && $app.getCurrentUser().avatar
//         ?
//         <img src={$app.getCurrentUser().avatar}
//              alt="User Avatar"
//              className="header-avatar"/>
//         :
//         <div className="header-avatar">
//             <i className="material-icons left dropdown-icon">account_circle</i>
//         </div>
//     :
//     <div className="header-avatar">
//         <i className="material-icons left dropdown-icon">account_circle</i>
//     </div>

const HomeUserHeader = ({onLoginClick, onSignupClick}) => (
    <div>
        <Menu>
            <Dropdown text='User'
                      pointing
                      className='link item'>
                <Dropdown.Menu>
                    <Dropdown.Header>Mon compte</Dropdown.Header>

                    {
                        $app.isAdminConnected() &&
                        <Dropdown.Item>
                            <a href="/admin">
                                {I18n.t('js.views.header.user.administration')}
                            </a>
                        </Dropdown.Item>
                    }

                    {
                        $app.isAdminConnected() &&
                        <Dropdown.Divider />
                    }

                    {
                        $app.isUserConnected() &&
                        <Dropdown.Divider />
                    }

                    {
                        !$app.isUserConnected() &&
                        <Dropdown.Item>
                            <a className="signup-link"
                               href="/signup"
                               onClick={onSignupClick}>
                                {I18n.t('js.views.header.user.sign_up')}
                            </a>
                        </Dropdown.Item>
                    }

                    {
                        !$app.isUserConnected() &&
                        <Dropdown.Item>
                            <a className="login-link"
                               href="/login"
                               onClick={onLoginClick}>
                                {I18n.t('js.views.header.user.log_in')}
                            </a>
                        </Dropdown.Item>
                    }

                    {
                        $app.isUserConnected() &&
                        <Dropdown.Item>
                            <a href={`/user/profile/${$app.getCurrentUser().slug}`}>
                                {I18n.t('js.views.header.user.profile')}
                            </a>
                        </Dropdown.Item>
                    }

                    {
                        $app.isUserConnected() &&
                        <Dropdown.Item>
                            <a href="/logout"
                               data-method="delete"
                               rel="nofollow">
                                {I18n.t('js.views.header.user.log_out')}
                            </a>
                        </Dropdown.Item>
                    }
                </Dropdown.Menu>
            </Dropdown>
        </Menu>
    </div>
);

HomeUserHeader.propTypes = {
    onLoginClick: PropTypes.func.isRequired,
    onSignupClick: PropTypes.func.isRequired
};

export default HomeUserHeader;
