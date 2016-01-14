'use strict';

var DoubleTimeline = require('../../theme/timeline/double');
var DoubleTimelineItem = require('../../theme/timeline/double-item');

var Pagination = require('../../materialize/pagination');

var ArticleListDisplay = React.createClass({
    propTypes: {
        comments: React.PropTypes.array.isRequired,
        pagination: React.PropTypes.object,
        loadComments: React.PropTypes.func,
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
        this.props.loadComments({page: paginate.selected + 1});
        $('html, body').animate({scrollTop: $('.comment-timeline').offset().top - 64}, 750);
    },

    render () {
        let CommentNodes = this.props.comments.map((comment) => {
            return (
                <DoubleTimelineItem key={comment.id}
                                    title={comment.title}
                                    date={comment.posted_at}
                                    icon="comment"
                                    content={comment.body}>
                    {I18n.t('js.comment.timeline.link') + ' '}
                    <a href={`${comment.commentable.link}#comment-${comment.id}`}>
                        {comment.commentable.title}
                    </a>
                </DoubleTimelineItem>
            );
        });

        if(CommentNodes.length === 0) {
            CommentNodes = I18n.t('js.comment.timeline.no_comments');
        }

        return (
            <div className="comment-timeline">
                <DoubleTimeline>
                    {CommentNodes}
                </DoubleTimeline>
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
