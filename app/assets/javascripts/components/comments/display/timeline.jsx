'use strict';

const DoubleTimeline = require('../../theme/timeline/double');
const DoubleTimelineItem = require('../../theme/timeline/double-item');

const Pagination = require('../../materialize/pagination');

var CommentTimelineDisplay = ({comments, pagination, loadComments}) => (
    <div className="comment-timeline">
        {
            comments.length > 0
                ?
                <DoubleTimeline>
                    {
                        comments.map((comment) =>
                            <DoubleTimelineItem key={comment.id}
                                                title={comment.title}
                                                date={comment.posted_at}
                                                icon="comment"
                                                content={comment.body}>
                                {I18n.t('js.comment.timeline.link') + ' '}
                                <a href={comment.link}>
                                    {comment.title}
                                </a>
                            </DoubleTimelineItem>
                        )
                    }
                </DoubleTimeline>
                :
                I18n.t('js.comment.timeline.no_comments')
        }

        {
            pagination &&
            <Pagination totalPages={pagination.total_pages}
                        onPaginationClick={(paginate) => {
                            CommentTimelineDisplay._handlePaginationClick(paginate, loadComments)
                        }}/>
        }
    </div>
);

CommentTimelineDisplay.propTypes = {
    comments: React.PropTypes.array,
    pagination: React.PropTypes.object,
    loadComments: React.PropTypes.func
};

CommentTimelineDisplay.getDefaultProps = {
    comments: [],
    pagination: null,
    loadComments: null
};

CommentTimelineDisplay._handlePaginationClick = (paginate, loadComments) => {
    loadComments({page: paginate.selected + 1});
    $('html, body').animate({scrollTop: $('.comment-timeline').offset().top - 64}, 750);
};

module.exports = CommentTimelineDisplay;
