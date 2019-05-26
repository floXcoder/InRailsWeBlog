'use strict';

import {
    headerHeight,
    mainWidth,
    mainZIndex
} from '../theme';

const styles = (theme) => ({
    root: {
        flexGrow: 1,
        zIndex: mainZIndex,
        position: 'relative',
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
        minHeight: '100vh',
        flexDirection: 'column',
        alignItems: 'stretch'
    },
    sidebar: {
        flex: '0 0 auto',
    },
    content: {
        flex: '1 1 auto',
        height: '100%', // allows both columns to span the full height of the browser window
        marginTop: headerHeight
    },
    component: {
        width: 'auto',
        marginLeft: theme.spacing(1) / 2,
        marginRight: theme.spacing(1) / 2,
        [theme.breakpoints.up(mainWidth + theme.spacing(6))]: {
            width: mainWidth,
            marginLeft: 'auto',
            marginRight: 'auto'
        }
    },
    breadcrumb: {
        width: mainWidth + 80,
        marginLeft: 'auto',
        marginRight: 'auto',
        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
    },
    quickAdd: {
        bottom: '3rem',
        outline: 'none',
        position: 'fixed',
        right: '2rem',
        zIndex: 100
    },
    quickAddIcon: {
        color: theme.palette.primary.main,
        fontSize: 38
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        marginTop: theme.spacing(8),
        padding: `${theme.spacing(6)}px 0`
    },
});

export default styles;
