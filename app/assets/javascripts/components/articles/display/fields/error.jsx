'use strict';

const ArticleErrorField = function ({errors}) {
    return (
        <div className="article-errors">
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
