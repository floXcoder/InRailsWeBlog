import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import '@css/components/separator.scss';


function Separator({
                       className,
                       text
                   }) {
    return (
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
}

Separator.propTypes = {
    className: PropTypes.string,
    text: PropTypes.string
};

export default React.memo(Separator);
