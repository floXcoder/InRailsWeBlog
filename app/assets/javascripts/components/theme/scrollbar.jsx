'use strict';

import '../../../stylesheets/components/scrollbar.scss';

import PerfectScrollbar from 'react-perfect-scrollbar';

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
