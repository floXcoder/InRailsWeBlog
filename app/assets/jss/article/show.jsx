'use strict';

import {
    articleWidth,
    h1Size,
    h1Weight,
    h1LineHeight,
    h1Spacing
} from '../theme';

const styles = (theme) => ({
    root: {
        position: 'relative',
        margin: '1rem auto 4rem',
        overflow: 'visible',
        maxWidth: articleWidth,
        [theme.breakpoints.down('md')]: {
            padding: '.6rem'
        }
    },
    title: {
        marginTop: '1rem',
        marginBottom: '1.8rem',
        fontSize: h1Size,
        fontWeight: h1Weight,
        lineHeight: h1LineHeight,
        letterSpacing: h1Spacing,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    content: {
        marginTop: '.5rem',
        marginBottom: '1.5rem',
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    avatar: {
        width: 42,
        height: 42,
    },
    avatarIcon: {
        fontSize: 36
    },
    avatarUser: {
        fontSize: '1rem',
        color: 'inherit'
    },
    avatarDate: {
        fontSize: '.9rem'
    },
    commentCount: {
        fontSize: '1rem',
        color: 'inherit'
    },
    outdated: {
        backgroundColor: theme.palette.grey[100],
        padding: 9
    },
    info: {
        color: theme.palette.grey[600],
        fontSize: '.9rem',
        marginTop: 10,
        marginBottom: 0,
        [theme.breakpoints.down('md')]: {
            margin: 0
        }
    },
    floatingButtons: {
        position: 'absolute',
        left: -110,
        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
    },
    floatingIcons: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: '2.2rem'
    },
    actionButtons: {
        // display: 'inline-flex',
        marginLeft: 'auto',
        [theme.breakpoints.up('sm')]: {
            marginRight: -2,
        },
    },
    actionItem: {
        display: 'inline-block',
        margin: theme.spacing.unit
    }
});

export default styles;
