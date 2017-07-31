'use strict';

const CountCommentIcon = ({linkToComment, commentsNumber}) => (
    <a href={linkToComment + '#comments'}
       className="comment-count">
        <span className="tooltipped"
              data-tooltip={I18n.t('js.comment.tooltip.count', {number: commentsNumber})}>
            {commentsNumber}
            <i className="material-icons">comment</i>
        </span>
    </a>
);

CountCommentIcon.propTypes = {
    linkToComment: PropTypes.string.isRequired,
    commentsNumber: PropTypes.number.isRequired
};

export default CountCommentIcon;
