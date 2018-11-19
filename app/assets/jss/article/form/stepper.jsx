'use strict';

const styles = (theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: '100%',
        borderRadius: 10,
        margin: '0'
    },
    tabsIndicator: {
        height: '100%',
        opacity: 0.35,
        borderRadius: 5,
        boxShadow: theme.shadows[5],
    },
    appBar: {
        boxShadow: 'none',
        backgroundColor: theme.palette.grey[100],
        marginBottom: '1.5rem',
        [theme.breakpoints.down('md')]: {
            marginBottom: 0
        }
    },
    tab: {
        [theme.breakpoints.down('md')]: {
            minHeight: 36
        }
    }
});

export default styles;
