'use strict';

import {
    Link
} from 'react-router-dom';

import {
    Popup
} from 'semantic-ui-react';

const HomeArticleHeader = () => {
    const button = (
        <a className="btn-floating waves-effect waves-light header-button topic-header-button">
            <span className="material-icons"
                  data-icon="add"
                  aria-hidden="true"/>
        </a>
    );

    const popup = (
        <ul className="collection">
            <li className="collection-item">
                <Link to={{
                    hash: '#new-article'
                }}>
                    <span className="title">
                        {I18n.t('js.views.header.article.menu.add_note')}
                    </span>
                </Link>
            </li>
            <li className="collection-item">
                <Link to={'newArticle'}>
                    <span className="title">
                        {I18n.t('js.views.header.article.menu.add_article')}
                    </span>
                </Link>
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

export default HomeArticleHeader;
