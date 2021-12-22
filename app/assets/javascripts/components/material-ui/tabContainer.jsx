'use strict';

import Typography from '@mui/material/Typography';

const TabContainer = ({isActive, children}) => (
    <Typography component="div"
                className={isActive ? null : 'hide'}>
        {children}
    </Typography>
);

TabContainer.propTypes = {
    isActive: PropTypes.bool.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.element
    ]).isRequired
};

export default TabContainer;
