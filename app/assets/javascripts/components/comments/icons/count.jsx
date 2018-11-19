'use strict';

import CommentIcon from '@material-ui/icons/Comment';

const CommentCountIcon = ({className, commentsCount, commentLink, hasIcon}) => (
    <a className={className}
       href={commentLink}>
        {
            hasIcon &&
            <CommentIcon/>
        }

        <span>
            {I18n.t('js.comment.tooltip.count', {count: commentsCount})}
        </span>
    </a>
);

CommentCountIcon.propTypes = {
    className: PropTypes.string.isRequired,
    commentsCount: PropTypes.number.isRequired,
    commentLink: PropTypes.string.isRequired,
    hasIcon: PropTypes.bool
};

CommentCountIcon.defaultProps = {
    hasIcon: true
};

export default React.memo(CommentCountIcon);
