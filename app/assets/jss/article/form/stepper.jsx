'use strict';

const styles = (theme) => ({
    stepper: {
        backgroundColor: theme.palette.background.paper,
        width: '100%',
        margin: '0',
        borderRadius: 10,
        boxShadow: theme.shadows[3]
    },
    stepperAppBar: {
        boxShadow: 'none',
        backgroundColor: theme.palette.grey[100],
        marginBottom: 0,
        borderRadius: 10,
        [theme.breakpoints.down('md')]: {
            marginBottom: 0
        }
    },
    tabsIndicator: {
        height: '100%',
        opacity: 0.35,
        borderRadius: 5,
        boxShadow: theme.shadows[5]
    },
    tab: {
        color: theme.palette.secondary.dark,
        [theme.breakpoints.down('md')]: {
            minHeight: 36
        }
    },
    middleTab: {
        boxShadow: theme.shadows[2]
    }
});

export default styles;
