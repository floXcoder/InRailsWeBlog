'use strict';

import CommentIcon from '@mui/icons-material/Comment';

function CommentCountIcon({
                              className,
                              commentsCount,
                              commentLink,
                              hasIcon = true
                          }) {
    return (
        <a className={className}
           href={commentLink}>
            {
                !!hasIcon &&
                <CommentIcon/>
            }

            <span>
                {I18n.t('js.comment.tooltip.count', {count: commentsCount})}
            </span>
        </a>
    );
}

CommentCountIcon.propTypes = {
    className: PropTypes.string.isRequired,
    commentsCount: PropTypes.number.isRequired,
    commentLink: PropTypes.string.isRequired,
    hasIcon: PropTypes.bool
};

export default React.memo(CommentCountIcon);
