'use strict';

import {
    Fragment
} from 'react';

import SingleTimeline from '../../theme/timeline/single';
import SingleTimelineItem from '../../theme/timeline/singleItem';

const ArticleTimelineDisplay = ({classes, categorizedArticles, articlePagination, currentArticles}) => {
    return (
        <div className={classes.timeline}>
            <SingleTimeline>
                {
                    Object.keys(categorizedArticles).map((category, i) => (
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
                                                            <a href={'#' + article.id}
                                                               className={classNames(classes.articleLink, {
                                                                   [classes.currentLink]: currentArticles.includes(article.id)
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
                (articlePagination && articlePagination.currentPage !== articlePagination.totalPages) &&
                <span className={classes.moreArticles}>Scroller pour charger plus d'articles</span>
            }
        </div>
    );
};

ArticleTimelineDisplay.propTypes = {
    classes: PropTypes.object.isRequired,
    categorizedArticles: PropTypes.object.isRequired,
    articlePagination: PropTypes.object,
    currentArticles: PropTypes.array.isRequired
};

export default ArticleTimelineDisplay;
