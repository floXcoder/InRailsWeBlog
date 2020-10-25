'use strict';

const ArticleVotes = ({articleId, articleVotesUp, articleVotesDown, onVoteClick}) => {
    return (
        <div>
            <a onClick={onVoteClick.bind(null, articleId, true)}>
                <span className="material-icons"
                      data-icon="thumb_up"
                      aria-hidden="true"/>
            </a>

            <a onClick={onVoteClick.bind(null, articleId, false)}>
                <span className="material-icons"
                      data-icon="thumb_down"
                      aria-hidden="true"/>
            </a>

            <span>
                {articleVotesUp}
            </span>

            <span>
                {articleVotesDown}
            </span>
        </div>
    );
};

ArticleVotes.propTypes = {
    articleId: PropTypes.number.isRequired,
    onVoteClick: PropTypes.func.isRequired,
    articleVotesUp: PropTypes.number,
    articleVotesDown: PropTypes.number
};

export default React.memo(ArticleVotes);
