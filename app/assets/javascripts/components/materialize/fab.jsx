'use strict';

import {
    Children
} from 'react';

const FixedActionButton = ({children}) => (
    <div className="fixed-action-btn horizontal click-to-toggle">
        <a className="btn-floating btn-large">
            <span className="material-icons"
                  data-icon="menu"
                  aria-hidden="true"/>
        </a>
        <ul>
            {
                Children.map(children, (button) => {
                    return (
                        <li>
                            {button}
                        </li>
                    );
                })
            }
        </ul>
    </div>
);

FixedActionButton.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.element
    ]).isRequired
};

export default FixedActionButton;
