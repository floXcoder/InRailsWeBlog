'use strict';

import {
    Link
} from 'react-router-dom';

import Dropdown from '../../theme/dropdown';

const ArticleSortDisplay = ({currentTopicSlug}) => (
    <div className="blog-article-filter">
        <Dropdown button={<span className="material-icons"
                                data-icon="sort"
                                aria-hidden="true"/>}
                  isRightSide={true}>
            <ul>
                <li className="dropdown-header">
                    {I18n.t('js.article.sort.title')}
                </li>

                <li>
                    <Link to={{search: 'order=priority_desc'}}>
                        {I18n.t('js.article.sort.order.priority')}
                    </Link>
                </li>

                <li className="dropdown-divider"/>

                <li>
                    <Link to={{search: 'order=updated_desc'}}>
                        {I18n.t('js.article.sort.order.date_desc')}
                    </Link>
                </li>

                <li>
                    <Link to={{search: 'order=updated_asc'}}>
                        {I18n.t('js.article.sort.order.date_asc')}
                    </Link>
                </li>

                {
                    currentTopicSlug &&
                    <li className="dropdown-divider"/>
                }

                {
                    currentTopicSlug &&
                    <li className="dropdown-header">
                        {I18n.t('js.article.sort.link_title')}
                    </li>
                }

                {
                    currentTopicSlug &&
                    <li>
                        <Link to={`/user/${currentTopicSlug}/sort`}>
                            {I18n.t('js.article.sort.link')}
                        </Link>
                    </li>
                }
            </ul>
        </Dropdown>
    </div>
);

ArticleSortDisplay.propTypes = {
    currentTopicSlug: PropTypes.string
};

export default ArticleSortDisplay;
