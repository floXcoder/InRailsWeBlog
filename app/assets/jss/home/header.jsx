'use strict';

import {
    drawerWidth
} from '../theme';

const styles = (theme) => ({
    appBar: {
        flexShrink: 0,
        display: 'inline-flex',
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        boxShadow: 'none',
        backgroundColor: theme.palette.background.default
    },
    toolbar: {
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '70%',
        borderBottom: `1px solid ${theme.palette.grey[300]}`,
        [theme.breakpoints.down('md')]: {
            width: '100%'
        }
    },
    grow: {
        flexGrow: 1
    },
    title: {
        display: 'none',
        marginLeft: 0,
        marginRight: 10,
        [theme.breakpoints.up('sm')]: {
            display: 'block'
        }
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex'
        }
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none'
        }
    },
    mobileDrawerPaper: {
        width: drawerWidth,
        [theme.breakpoints.up('md')]: {
            position: 'relative'
        }
    },
    mobileToolbar: {
        ...theme.mixins.toolbar,
        marginTop: 15
    },
    nestedMenu: {
        paddingLeft: theme.spacing.unit * 4
    }
});

export default styles;
