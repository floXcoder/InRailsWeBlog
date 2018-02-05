'use strict';

const CommentCountIcon = ({commentsCount, commentLink, hasIcon}) => (
    <div className="blog-article-info-comment">
        <a href={commentLink}>
            {
                hasIcon &&
                <span className="material-icons"
                      data-icon="comment"
                      aria-hidden="true"/>
            }

            <span>
                {I18n.t('js.comment.tooltip.count', {count: commentsCount})}
            </span>
        </a>
    </div>
);

CommentCountIcon.propTypes = {
    commentsCount: PropTypes.number.isRequired,
    commentLink: PropTypes.string.isRequired,
    hasIcon: PropTypes.bool
};

CommentCountIcon.defaultProps = {
    hasIcon: true
};

export default CommentCountIcon;
