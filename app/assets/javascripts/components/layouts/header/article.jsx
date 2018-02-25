'use strict';

import {
    Link
} from 'react-router-dom';

import Dropdown from '../../theme/dropdown';

const HomeArticleHeader = () => {
    const popup = (
        <ul>
            <li>
                <Link to={{
                    hash: '#new-article',
                    state: {
                        mode: 'note'
                    }
                }}>
                    <span className="title">
                        {I18n.t('js.views.header.article.menu.add_note')}
                    </span>
                </Link>
            </li>

            <li className="dropdown-divider"/>

            <li>
                <Link to={{
                    pathname: '/article/new',
                    state: {
                        mode: 'story'
                    }
                }}>
                    <span className="title">
                        {I18n.t('js.views.header.article.menu.add_article')}
                    </span>
                </Link>
            </li>

            <li className="dropdown-divider"/>

            <li>
                <Link to={{
                    pathname: '/article/new',
                    state: {
                        mode: 'link'
                    }
                }}>
                    <span className="title">
                        {I18n.t('js.views.header.article.menu.add_link')}
                    </span>
                </Link>
            </li>
        </ul>
    );

    return (
        <Dropdown button={<span className="material-icons left"
                                data-icon="add"
                                aria-hidden="true"/>}
                  position="bottom right"
                  buttonClassName="header-button"
                  isFloatingButton={true}
                  isFixed={true}
                  hasArrow={true}>
            {popup}
        </Dropdown>
    );
};

export default HomeArticleHeader;
