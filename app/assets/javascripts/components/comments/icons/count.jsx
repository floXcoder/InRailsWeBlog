'use strict';

const CountCommentIcon = ({linkToComment, commentsCount}) => (
    <a href={linkToComment + '#comments'}
       className="comment-count">
        <span className="tooltip-bottom"
              data-tooltip={I18n.t('js.comment.tooltip.count', {number: commentsCount})}>
            {commentsCount}
            <span className="material-icons"
                  data-icon="comment"
                  aria-hidden="true"/>
        </span>
    </a>
);

CountCommentIcon.propTypes = {
    linkToComment: PropTypes.string.isRequired,
    commentsCount: PropTypes.number.isRequired
};

export default CountCommentIcon;
