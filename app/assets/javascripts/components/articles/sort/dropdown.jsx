'use strict';

import {
    Link
} from 'react-router-dom';

import Dropdown from '../../theme/dropdown';

const ArticleSortDisplay = ({currentTopicSlug, currentOrder}) => (
    <div className="blog-article-sort">
        <Dropdown button={<span className="material-icons"
                                data-icon="low_priority"
                                aria-hidden="true"/>}
                  isRightSide={true}>
            <ul>
                <li className="dropdown-header">
                    {I18n.t('js.article.sort.title')}
                </li>

                <li>
                    <Link className={currentOrder === 'priority_desc' ? 'sort-current' : ''}
                          to={{search: 'order=priority_desc'}}>
                        {I18n.t('js.article.sort.order.priority')}
                    </Link>
                </li>

                <li className="dropdown-divider"/>

                <li>
                    <Link className={currentOrder === 'tag_asc' ? 'sort-current' : ''}
                          to={{search: 'order=tag_asc'}}>
                        {I18n.t('js.article.sort.order.tag')}
                    </Link>
                </li>

                <li className="dropdown-divider"/>

                <li>
                    <Link className={currentOrder === 'updated_desc' ? 'sort-current' : ''}
                          to={{search: 'order=updated_desc'}}>
                        {I18n.t('js.article.sort.order.date_desc')}
                    </Link>
                </li>

                <li>
                    <Link className={currentOrder === 'updated_asc' ? 'sort-current' : ''}
                          to={{search: 'order=updated_asc'}}>
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
    currentTopicSlug: PropTypes.string,
    currentOrder: PropTypes.string
};

export default ArticleSortDisplay;
