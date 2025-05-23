import React from 'react';
import PropTypes from 'prop-types';

const ArticleErrorField = function ({errors}) {
    return (
        <div id="article-errors"
             className="article-errors">
            {
                errors.map((error, i) => (
                    <p key={i}
                       className="center-align">
                        {error}
                    </p>
                ))
            }
        </div>
    );
};

ArticleErrorField.propTypes = {
    errors: PropTypes.array.isRequired
};

export default React.memo(ArticleErrorField);
