'use strict';

import {
    drawerWidth,
    headerHeight
} from '../theme';

const styles = (theme) => ({
    drawerPaper: {
        position: 'fixed',
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
    drawerPaperOverflow: {
        overflow: 'hidden'
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9)
        }
    }
});

export default styles;
