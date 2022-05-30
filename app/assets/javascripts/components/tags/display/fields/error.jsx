'use strict';

function TagErrorField({errors}) {
    return (
        <div className="tag-errors">
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
}

TagErrorField.propTypes = {
    errors: PropTypes.array.isRequired
};

export default React.memo(TagErrorField);
