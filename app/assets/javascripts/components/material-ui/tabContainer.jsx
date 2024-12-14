import PropTypes from 'prop-types';

import Typography from '@mui/material/Typography';

function TabContainer({
                          isActive,
                          children
                      }) {
    return (
        <Typography component="div"
                    className={isActive ? null : 'hide'}>
            {children}
        </Typography>
    );
}

TabContainer.propTypes = {
    isActive: PropTypes.bool.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.element
    ]).isRequired
};

export default TabContainer;
