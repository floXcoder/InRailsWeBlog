'use strict';

import {
    articleWidth,
    storiesWidth,
    h1Size,
    h1SizeMobile,
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
        marginTop: '1.3rem',
        marginBottom: '1.8rem',
        fontSize: h1Size,
        fontWeight: h1Weight,
        lineHeight: h1LineHeight,
        letterSpacing: h1Spacing,
        [theme.breakpoints.down('md')]: {
            fontSize: h1SizeMobile
        }
    },
    media: {
        height: 0,
        paddingTop: '56.25%' // 16:9
    },
    content: {
        marginTop: '.5rem',
        marginBottom: '1.5rem'
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginTop: '1.5rem'
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
    editIcon: {
        textAlign: 'right'
    },
    commentCount: {
        fontSize: '1rem',
        color: 'inherit'
    },
    outdated: {
        backgroundColor: theme.palette.grey[100],
        padding: 9
    },
    articleInfo: {
        color: theme.palette.grey[600],
        fontSize: '.9rem',
        marginTop: 10,
        marginBottom: 0,
        [theme.breakpoints.down('md')]: {
            display: 'none'
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
            marginRight: -2
        }
    },
    actionItem: {
        display: 'inline-block',
        margin: theme.spacing(1.5),
        [theme.breakpoints.down('md')]: {
            margin: theme.spacing(1.5, 2.5)
        }
    },
    storiesContainer: {
        maxWidth: storiesWidth,
        margin: '0 auto 2rem'
    },
    storiesTitle: {
        textAlign: 'center'
    },
    storiesArticle: {
        width: '420px',
        [theme.breakpoints.down('md')]: {
            width: '280px'
        }
    }
});

export default styles;
