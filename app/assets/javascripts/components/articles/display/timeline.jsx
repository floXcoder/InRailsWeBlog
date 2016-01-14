'use strict';

//var ArticleActions = require('../../../actions/articleActions');
var ArticleCommentIcon = require('../icons/comment');
var ArticleVisibilityIcon = require('../icons/visibility');
var SingleTimeline = require('../../theme/timeline/single');
var SingleTimelineItem = require('../../theme/timeline/single-item');

var Pagination = require('../../materialize/pagination');

var ArticleListDisplay = React.createClass({
    propTypes: {
        articles: React.PropTypes.array.isRequired,
        pagination: React.PropTypes.object,
        loadArticles: React.PropTypes.func,
        currentUserId: React.PropTypes.number
    },

    getDefaultProps () {
        return {
            pagination: null,
            loadArticles: null,
            currentUserId: null
        };
    },

    _handlePageClick (paginate) {
        this.props.loadArticles({page: paginate.selected + 1});
        $('html, body').animate({scrollTop: $('.article-timeline').offset().top - 64}, 750);
    },

    render () {
        let ArticleNodes = this.props.articles.map((article) => {
            return (
                <SingleTimelineItem key={article.id}
                                    date={article.updated_at}
                                    icon="message"
                                    content={article.content}>
                    {I18n.t('js.article.timeline.title') + ' '}
                    <a href={article.link}>
                        {article.title}
                    </a>
                    <ArticleVisibilityIcon article={article}
                                           currentUserId={this.props.currentUserId}/>
                    <div className="inline right">
                        <ArticleCommentIcon articleLink={article.link}
                                            commentsNumber={article.comments_number}/>
                    </div>
                </SingleTimelineItem>
            );
        });

        if(ArticleNodes.length === 0) {
            ArticleNodes = I18n.t('js.article.timeline.no_articles');
        }

        return (
            <div className="article-timeline">
                <SingleTimeline>
                    {ArticleNodes}
                </SingleTimeline>
                {
                    this.props.pagination &&
                    <Pagination totalPages={this.props.pagination.total_pages}
                                onPageClick={this._handlePageClick}/>
                }
            </div>
        );
    }
});

module.exports = ArticleListDisplay;
