'use strict';

var CountCommentIcon = ({linkToComment, commentsNumber}) => (
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
    linkToComment: React.PropTypes.string.isRequired,
    commentsNumber: React.PropTypes.number.isRequired
};

module.exports = CountCommentIcon;
