'use strict';

import {
    headerHeight,
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
        backgroundColor: theme.palette.background.default,
        borderBottom: `1px solid ${theme.palette.grey[300]}`
    },
    toolbar: {
        marginLeft: 'auto',
        marginRight: 'auto',
        minHeight: headerHeight,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        width: '70%',
        [theme.breakpoints.down('lg')]: {
            width: '100%'
        }
    },
    grow: {
        flexGrow: 1
    },
    headerTitle: {
        display: 'block',
        margin: '10px 8px 0',
        fontSize: 32
    },
    menuButton: {
        marginLeft: 5,
        marginRight: 5
    },
    mobileIcon: {
      fontSize: '1.6rem'
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('lg')]: {
            display: 'flex'
        }
    },
    desktopItem: {
        paddingLeft: 12,
        paddingRight: 12,
        fontSize: '1rem',
        whiteSpace: 'nowrap',
        fontWeight: 'initial'
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('lg')]: {
            display: 'none'
        }
    },
    mobileDrawerPaper: {
        width: drawerWidth,
        [theme.breakpoints.up('lg')]: {
            position: 'relative'
        }
    },
    mobileToolbar: {
        ...theme.mixins.toolbar,
        minHeight: '48px !important',
        marginTop: 15,
        paddingLeft: 26
    },
    mobileTitle: {
        margin: '5px 2px',
        color: theme.palette.text.primary,
        display: 'block',
        fontSize: 30
    },
    nestedMenu: {
        paddingLeft: theme.spacing(4)
    }
});

export default styles;
