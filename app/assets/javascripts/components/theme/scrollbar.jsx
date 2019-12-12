'use strict';

import '../../../stylesheets/components/scrollbar.scss';

import PerfectScrollbar from 'react-perfect-scrollbar';

const Scrollbar = ({children}) => (
    <PerfectScrollbar>
        {children}
    </PerfectScrollbar>
);

Scrollbar.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
        PropTypes.element
    ])
};

export default React.memo(Scrollbar);
