'use strict';

import '../../../stylesheets/components/separator.scss';

const Separator = ({className, text}) => (
    <div className={classNames('separator', className)}>
        <span className="separator-h">
            {
                text
                    ?
                    <span className="separator-text">
                        {text}
                    </span>
                    :
                    <span className="material-icons"
                          data-icon="star"
                          aria-hidden="true"/>
            }
        </span>
    </div>
);

Separator.propTypes = {
    className: PropTypes.string,
    text: PropTypes.string
};

export default React.memo(Separator);
