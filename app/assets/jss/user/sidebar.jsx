'use strict';

import {
    drawerWidth,
    headerHeight
} from '../theme';

const styles = (theme) => ({
    drawerPaper: {
        position: 'fixed',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginTop: headerHeight,
        borderRight: `1px solid ${theme.palette.grey[100]}`
    },
    drawerPaperBorderless: {
        borderRight: 0,
        borderLeft: 0
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        width: theme.spacing.unit * 7,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing.unit * 9
        }
    },
    expandButton: {
    }
});

export default styles;
