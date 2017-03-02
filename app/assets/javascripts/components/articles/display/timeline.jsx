'use strict';

import CountCommentIcon from '../../comments/icons/count';
import ArticleVisibilityIcon from '../icons/visibility';
import SingleTimeline from '../../theme/timeline/single';
import SingleTimelineItem from '../../theme/timeline/single-item';

import Pagination from '../../materialize/pagination';

import {Link} from 'react-router';

const ArticleTimelineDisplay = ({articles, pagination, loadArticles}) => (
    <div className="article-timeline">
        <SingleTimeline>
            {
                articles.map((article) =>
                    <SingleTimelineItem key={article.id}
                                        date={article.updated_at}
                                        icon="message"
                                        title={
                                            <div>
                                                {I18n.t('js.article.timeline.title') + ' '}

                                                <Link to={`/article/${article.slug}`}>
                                                    {article.title}
                                                </Link>

                                                <ArticleVisibilityIcon article={article}/>

                                                <div className="inline right">
                                                    <CountCommentIcon linkToComment={`/articles/${article.slug}`}
                                                                      commentsNumber={article.comments_number}/>
                                                </div>
                                            </div>
                                        }>
                        <div dangerouslySetInnerHTML={{__html: article.content}}/>
                    </SingleTimelineItem>
                )
            }

            {
                articles.length === 0 &&
                I18n.t('js.article.timeline.no_articles')
            }
        </SingleTimeline>

        {
            pagination &&
            <Pagination totalPages={pagination.total_pages}
                        onPageClick={(paginate) => {
                            ArticleTimelineDisplay._handlePaginationClick(paginate, loadArticles)
                        }}/>
        }
    </div>
);

ArticleTimelineDisplay.propTypes = {
    articles: React.PropTypes.array.isRequired,
    pagination: React.PropTypes.object,
    loadArticles: React.PropTypes.func
};

ArticleTimelineDisplay.getDefaultProps = {
    pagination: null,
    loadArticles: null
};

ArticleTimelineDisplay._handlePaginationClick = (paginate, loadArticles) => {
    loadArticles({page: paginate.selected + 1});
    $('html, body').animate({scrollTop: $('.article-timeline').offset().top - 64}, 750);
};


export default ArticleTimelineDisplay;
