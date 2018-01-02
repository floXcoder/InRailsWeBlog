'use strict';

import UserSettings from '../../users/settings';

import {
    Popup
} from 'semantic-ui-react';

const HomePreferenceHeader = ({}) => {
    const button = (
        <a className="btn-floating waves-effect waves-light header-button topic-header-button">
            <span className="material-icons left"
                  data-icon="settings_applications"
                  aria-hidden="true"/>
        </a>
    );

    const popup = (
        <ul className="collection">
            <li className="collection-item">
                <span className="title">
                    {I18n.t('js.views.header.user.settings.title')}
                </span>
            </li>

            <li className="collection-item">
                <div className="blog-user-pref">
                    <UserSettings/>
                </div>
            </li>
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

HomePreferenceHeader.propTypes = {};

export default HomePreferenceHeader;
