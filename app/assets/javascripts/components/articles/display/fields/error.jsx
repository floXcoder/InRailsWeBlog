'use strict';

const ArticleErrorField = ({errors}) => (
    <div className="article-errors red-text">
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

ArticleErrorField.propTypes = {
    errors: PropTypes.array.isRequired
};

export default ArticleErrorField;
