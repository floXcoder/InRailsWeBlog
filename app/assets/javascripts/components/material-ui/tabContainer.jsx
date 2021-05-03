'use strict';

import Typography from '@material-ui/core/Typography';

const TabContainer = ({isActive, children}) => (
    <Typography component="div"
                className={isActive ? null : 'hide'}>
        {children}
    </Typography>
);

TabContainer.propTypes = {
    isActive: PropTypes.bool.isRequired,
    children: PropTypes.element.isRequired
};

export default TabContainer;
