'use strict';

import {
    Link
} from 'react-router-dom';

import Dropdown from '../../theme/dropdown';

const HomeArticleHeader = ({params, hasTemporaryArticle}) => {
    const popup = (
        <ul>
            {
                hasTemporaryArticle &&
                <li>
                    <Link to={{
                        hash: '#new-article',
                        state: {
                            temporary: true
                        }
                    }}>
                        <span className="title title-temporary">
                            {I18n.t('js.views.header.article.menu.temporary')}
                        </span>
                    </Link>
                </li>
            }

            {
                hasTemporaryArticle &&
                <li className="dropdown-divider">
                    &nbsp;
                </li>
            }

            <li>
                <Link to={{
                    hash: '#new-article',
                    state: {
                        mode: 'note',
                        parentTagSlug: params.parentTagSlug || params.tagSlug,
                        childTagSlug: params.childTagSlug
                    }
                }}>
                    <span className="title">
                        {I18n.t('js.views.header.article.menu.add_note')}
                    </span>
                </Link>
            </li>

            <li className="dropdown-divider">
                &nbsp;
            </li>

            <li>
                <Link to={{
                    pathname: '/article/new',
                    state: {
                        mode: 'story',
                        parentTagSlug: params.parentTagSlug || params.tagSlug,
                        childTagSlug: params.childTagSlug
                    }
                }}>
                    <span className="title">
                        {I18n.t('js.views.header.article.menu.add_article')}
                    </span>
                </Link>
            </li>

            <li className="dropdown-divider">
                &nbsp;
            </li>

            <li>
                <Link to={{
                    pathname: '/article/new',
                    state: {
                        mode: 'link',
                        parentTagSlug: params.parentTagSlug || params.tagSlug,
                        childTagSlug: params.childTagSlug
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
        <Dropdown button={
            <span className="material-icons left"
                  data-icon="add"
                  aria-hidden="true">
                    <span className={classNames({
                        'header-alert': hasTemporaryArticle
                    })}/>
                </span>
        }
                  position="bottom right"
                  buttonClassName="header-button"
                  isFloatingButton={true}
                  isFixed={true}
                  hasWavesEffect={false}
                  hasArrow={true}>
            {popup}
        </Dropdown>
    );
};

HomeArticleHeader.propTypes = {
    params: PropTypes.object,
    hasTemporaryArticle: PropTypes.bool
};

HomeArticleHeader.defaultProps = {
    params: {},
    hasTemporaryArticle: false
};

export default HomeArticleHeader;
