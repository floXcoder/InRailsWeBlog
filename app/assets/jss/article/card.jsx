'use strict';

import {
    h1Size,
    h1SizeMobile,
    h1Weight,
    h1LineHeight,
    h1Spacing
} from '../theme';

const styles = (theme) => ({
    articleCard: {
        position: 'relative',
        margin: '.4rem 1rem 2rem',
        overflow: 'visible',
        [theme.breakpoints.down('md')]: {
            marginTop: '.8rem',
            marginBottom: '2.8rem'
        }
    },
    header: {
        paddingTop: 8,
        paddingBottom: 16
    },
    articleInfo: {
        color: '#999',
        marginBottom: 3,
        marginTop: 0
    },
    infoItem: {
        paddingTop: '2px !important',
        paddingBottom: '2px !important'
    },
    title: {
        marginTop: '1rem',
        marginBottom: '0',
        color: theme.palette.text.dark,
        fontSize: h1Size,
        fontWeight: h1Weight,
        lineHeight: h1LineHeight,
        letterSpacing: h1Spacing,
        margin: 'inherit',
        [theme.breakpoints.down('md')]: {
            fontSize: h1SizeMobile
        }
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest
        }),
        marginTop: 8,
        marginLeft: 'auto',
        [theme.breakpoints.up('sm')]: {
            marginRight: -2
        }
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    content: {
        paddingTop: 6
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    avatarContainer: {
        paddingTop: 4,
        paddingBottom: 4
    },
    avatar: {
        width: 30,
        height: 30,
    },
    avatarIcon: {
        fontSize: 26
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
    },
    floatingButtons: {
        position: 'absolute',
        left: -90,
        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
    },
    floatingIcons: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: '2rem'
    },
    actionButtons: {
        // display: 'inline-flex',
        marginLeft: 'auto',
        [theme.breakpoints.up('sm')]: {
            marginRight: -2
        }
    },
    actionItem: {
        display: 'inline-block',
        margin: theme.spacing.unit * 1.5
    }
});

export default styles;
