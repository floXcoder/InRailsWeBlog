'use strict';

import {
    scaleDown as BurgerMenu
} from 'react-burger-menu';

const AdminMenu = ({}) => (
    <BurgerMenu
        pageWrapId="page-wrap"
        outerContainerId="outer-container">
        <a
            className="menu-item"
            href="/admin">
            <span className="material-icons"
                  data-icon="dashboard"
                  aria-hidden="true"/>
            {I18n.t('js.admin.menu.dashboard')}
        </a>
        <a className="menu-item"
           href="/admin/users_manager">
            <span className="material-icons"
                  data-icon="account_circle"
                  aria-hidden="true"/>
            {I18n.t('js.admin.menu.users')}
        </a>
        <a className="menu-item"
           href="/admin/errors">
            <span className="material-icons"
                  data-icon="error"
                  aria-hidden="true"/>
            {I18n.t('js.admin.menu.errors')}
        </a>
        <a className="menu-item"
           href="/admin/sidekiq">
            <span className="material-icons"
                  data-icon="subscriptions"
                  aria-hidden="true"/>
            {I18n.t('js.admin.menu.sidekiq')}
        </a>
        <a className="menu-item"
           href="/">
            <span className="material-icons"
                  data-icon="arrow_back"
                  aria-hidden="true"/>
            {I18n.t('js.admin.menu.back_home')}
        </a>
    </BurgerMenu>
);

export default AdminMenu;
