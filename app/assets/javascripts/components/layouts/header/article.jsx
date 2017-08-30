'use strict';

import {
    Popup
} from 'semantic-ui-react';

const HomeArticleHeader = () => {
    const button = (
        <a className="btn-floating waves-effect waves-light header-button topic-header-button"
           href="#">
            <i className="material-icons">add</i>
        </a>
    );

    const popup = (
        <ul className="collection">
            <li className="collection-item">
                <span className="title">
                    {I18n.t('js.views.header.article.menu.add_note')}
                </span>
            </li>
            <li className="collection-item">
                <span className="title">
                    {I18n.t('js.views.header.article.menu.add_article')}
                </span>
            </li>
        </ul>
    );

    return (
        <div>
            <Popup
                trigger={button}
                content={popup}
                on='click'
                hideOnScroll={true}
                flowing={true}
                position='bottom center'/>
        </div>
    );
};

export default HomeArticleHeader;
