import React from 'react';
import PropTypes from 'prop-types';

import PerfectScrollbar from 'react-perfect-scrollbar';

import '@css/components/scrollbar.scss';


function Scrollbar({children}) {
    return (
        <PerfectScrollbar>
            {children}
        </PerfectScrollbar>
    );
}

Scrollbar.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
        PropTypes.element
    ])
};

export default React.memo(Scrollbar);
