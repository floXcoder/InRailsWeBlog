'use strict';

import {
    Fragment
} from 'react';

import Scrollbar from '../../theme/scrollbar';
import SingleTimeline from '../../theme/timeline/single';
import SingleTimelineItem from '../../theme/timeline/singleItem';


function ArticleTimelineDisplay({
                                    categorizedArticles,
                                    articlePagination,
                                    currentArticles
                                }) {
    return (
        <div className="article-sidebar-timeline">
            <Scrollbar>
                <SingleTimeline>
                    {
                        Object.keys(categorizedArticles)
                            .map((category, i) => (
                                <Fragment key={i}>
                                    {
                                        category !== 'all_articles' &&
                                        <li className="timeline-separator">
                                            <span>{category}</span>
                                        </li>
                                    }

                                    {
                                        categorizedArticles[category].map((article, j) => (
                                            <SingleTimelineItem key={i + '-' + j}
                                                                title={
                                                                    <a href={`#article-${article.id}`}
                                                                       className={classNames('article-sidebar-article-link', {
                                                                           'article-sidebar-current-link': currentArticles.includes(article.id)
                                                                       })}>
                                                                        {article.title}
                                                                    </a>
                                                                }/>
                                        ))
                                    }
                                </Fragment>
                            ))
                    }

                    {
                        Utils.isEmpty(categorizedArticles) &&
                        I18n.t('js.article.timeline.no_articles')
                    }
                </SingleTimeline>

                {
                    !!(articlePagination && articlePagination.currentPage !== articlePagination.totalPages) &&
                    <span className="article-sidebar-more-articles">
                        {I18n.t('js.article.timeline.scroll_for_more')}
                    </span>
                }
            </Scrollbar>
        </div>
    );
}

ArticleTimelineDisplay.propTypes = {
    categorizedArticles: PropTypes.object.isRequired,
    articlePagination: PropTypes.object,
    currentArticles: PropTypes.array.isRequired
};

export default ArticleTimelineDisplay;
