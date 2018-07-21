'use strict';

import {
    Link
} from 'react-router-dom';

import Dropdown from '../../theme/dropdown';

const ArticleFilterDisplay = ({currentUserId}) => (
    <div className="blog-article-filter">
        <Dropdown button={<span className="material-icons"
                                data-icon="filter_list"
                                aria-hidden="true"/>}
                  position="bottom right">
            <ul>
                <li className="dropdown-header">
                    {I18n.t('js.article.filter.title')}
                </li>

                <li>
                    <Link to={{search: 'mode=story'}}>
                        {I18n.t('js.article.filter.filters.story')}
                    </Link>
                </li>

                <li className="dropdown-divider">
                    &nbsp;
                </li>

                <li>
                    <Link to={{search: 'mode=note'}}>
                        {I18n.t('js.article.filter.filters.note')}
                    </Link>
                </li>

                <li className="dropdown-divider">
                    &nbsp;
                </li>

                <li>
                    <Link to={{search: 'mode=link'}}>
                        {I18n.t('js.article.filter.filters.link')}
                    </Link>
                </li>

                {
                    currentUserId &&
                    <li className="dropdown-divider">
                        &nbsp;
                    </li>
                }

                {
                    currentUserId &&
                    <li>
                        <Link to={{search: 'bookmarked=true'}}>
                            {I18n.t('js.article.filter.filters.bookmark')}
                        </Link>
                    </li>
                }

                {
                    currentUserId &&
                    <li className="dropdown-divider">
                        &nbsp;
                    </li>
                }

                {
                    currentUserId &&
                    <li>
                        <Link to={{search: 'draft=true'}}>
                            {I18n.t('js.article.filter.filters.draft')}
                        </Link>
                    </li>
                }
            </ul>
        </Dropdown>
    </div>
);

ArticleFilterDisplay.propTypes = {
    currentUserId: PropTypes.number
};

export default ArticleFilterDisplay;
