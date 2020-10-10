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
        backgroundColor: theme.palette.background.default
    },
    toolbar: {
        width: '100%',
        height: headerHeight,
        borderBottom: `1px solid ${theme.palette.grey[100]}`
    },
    grow: {
        flexGrow: 1
    },
    title: {
        display: 'none',
        margin: '15px 15px 0 0',
        fontSize: 32,
        [theme.breakpoints.up('sm')]: {
            display: 'block',
            fontSize: '2rem'
        }
    },
    titleLink: {
        color: theme.palette.text.primary
    },
    websiteTitle: {
        fontSize: '1.6rem',
        margin: '.5rem',
        [theme.breakpoints.up('lg')]: {
            fontSize: '2rem'
        }
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
        [theme.breakpoints.down('lg')]: {
            marginRight: 12
        }
    },
    headerButton: {
        display: 'block',
        margin: '0 12px',
        width: 48
    },
    topicButton: {
        fontSize: '1rem',
        [theme.breakpoints.down('lg')]: {
            margin: 8
        }
    },
    link: {
        fontSize: '1rem',
        verticalAlign: 'middle',
        color: theme.palette.text.primary,
        lineHeight: '1.2rem'
    },
    sectionDesktop: {
        marginLeft: 5,
        display: 'none',
        [theme.breakpoints.up('lg')]: {
            display: 'flex'
        }
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
    mobileDivider: {
        margin: '.5rem 0'
    },
    nestedMenu: {
        paddingLeft: theme.spacing(4)
    }
});

export default styles;
