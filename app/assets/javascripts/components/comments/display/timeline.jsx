'use strict';

import DoubleTimeline from '../../theme/timeline/double';
import DoubleTimelineItem from '../../theme/timeline/doubleItem';

import Pagination from '../../materialize/pagination';

const CommentTimelineDisplay = ({comments, pagination, loadComments}) => (
    <div id="comment-timeline">
        {
            comments.length > 0
                ?
                <DoubleTimeline>
                    {
                        comments.map((comment) => (
                                <DoubleTimelineItem key={comment.id}
                                                    title={comment.title}
                                                    date={comment.postedAt}
                                                    icon="comment"
                                                    content={comment.body}>
                                    {I18n.t('js.comment.timeline.link') + ' '}
                                    <a href={comment.link}>
                                        {comment.title}
                                    </a>
                                </DoubleTimelineItem>
                            )
                        )
                    }
                </DoubleTimeline>
                :
                I18n.t('js.comment.timeline.no_comments')
        }

        {
            pagination &&
            <Pagination totalPages={pagination.totalPages}
                        onPaginationClick={_handlePaginationClick.bind(null, loadComments)}/>
        }
    </div>
);

const _handlePaginationClick = (loadComments, paginate) => {
    loadComments({page: paginate.selected + 1});
    $('html, body').animate({scrollTop: $('#comment-timeline').offset().top - 64}, 750);
};

CommentTimelineDisplay.propTypes = {
    comments: PropTypes.array,
    pagination: PropTypes.object,
    loadComments: PropTypes.func
};

CommentTimelineDisplay.defaultProps = {
    comments: []
};

export default CommentTimelineDisplay;
