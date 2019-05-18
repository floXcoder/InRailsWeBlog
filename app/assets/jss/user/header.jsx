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
        width: '100%',
        height: 64,
        borderBottom: `1px solid ${theme.palette.grey[100]}`,
    },
    grow: {
        flexGrow: 1
    },
    title: {
        display: 'none',
        margin: '5px 15px',
        fontSize: '1.6rem',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
            fontSize: '2rem'
        }
    },
    websiteTitle: {
        fontSize: '1.6rem',
        margin: '.5rem',
        [theme.breakpoints.up('md')]: {
            fontSize: '2rem'
        }
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
        [theme.breakpoints.down('md')]: {
            marginRight: 12
        }
    },
    topicButton: {
        fontSize: '1rem',
        [theme.breakpoints.down('md')]: {
            margin: 6
        }
    },
    link: {
        fontSize: '1rem',
        verticalAlign: 'middle',
        color: theme.palette.text.primary,
        lineHeight: '1.2rem',
    },
    sectionDesktop: {
        marginLeft: 5,
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
        minHeight: '48px !important',
        marginTop: 15,
        paddingLeft: 12
    },
    mobileDivider: {
      margin: '.5rem 0'
    },
    nestedMenu: {
        paddingLeft: theme.spacing.unit * 4
    }
});

export default styles;
