'use strict';

const styles = (theme) => ({
    footer: {
        boxShadow: 'none',
        backgroundColor: theme.palette.background.default,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '70%',
        borderTop: `1px solid ${theme.palette.grey[300]}`
    }
});

export default styles;
