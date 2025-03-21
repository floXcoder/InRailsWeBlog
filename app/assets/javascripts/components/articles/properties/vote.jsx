import React from 'react';
import PropTypes from 'prop-types';

function ArticleVotes({
                          articleId,
                          articleVotesUp,
                          articleVotesDown,
                          onVoteClick
                      }) {
    return (
        <div>
            <a href="#"
               onClick={onVoteClick.bind(null, articleId, true)}>
                <span className="material-icons"
                      data-icon="thumb_up"
                      aria-hidden="true"/>
            </a>

            <a href="#"
               onClick={onVoteClick.bind(null, articleId, false)}>
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
}

ArticleVotes.propTypes = {
    articleId: PropTypes.number.isRequired,
    onVoteClick: PropTypes.func.isRequired,
    articleVotesUp: PropTypes.number,
    articleVotesDown: PropTypes.number
};

export default React.memo(ArticleVotes);
