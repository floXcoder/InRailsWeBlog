'use strict';

import {
    articleWidth,
    articleAppendixWidth,
    storiesWidth,
    h1Size,
    h1SizeMobile,
    h1Weight,
    h1LineHeight,
    h1LineHeightMobile,
    h1Spacing
} from '../theme';

const styles = (theme) => ({
    root: {
        position: 'relative',
        margin: '1rem auto 4rem',
        overflow: 'visible',
        maxWidth: articleWidth,
        [theme.breakpoints.down('md')]: {
            padding: '.6rem',
            marginBottom: '1.8rem'
        }
    },
    title: {
        marginTop: '2rem',
        marginBottom: '.5rem',
        width: '100%',
        textAlign: 'center',
        fontSize: h1Size,
        fontWeight: h1Weight,
        lineHeight: h1LineHeight,
        letterSpacing: h1Spacing,
        [theme.breakpoints.down('md')]: {
            marginTop: '2rem',
            fontSize: h1SizeMobile,
            lineHeight: h1LineHeightMobile
        }
    },
    reference: {
        margin: theme.spacing(1, 0)
    },
    referenceLink: {
        color: theme.palette.text.primary,
        fontStyle: 'italic'
    },
    media: {
        // height: 0,
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
        width: 38,
        height: 38,
    },
    avatarIcon: {
        fontSize: 32
    },
    avatarUser: {
        fontSize: '.95rem',
        color: 'inherit'
    },
    avatarDate: {
        fontSize: '.9rem'
    },
    editIcon: {
        margin: '0 .4rem',
        display: 'inline-block',
        textAlign: 'right'
    },
    commentCount: {
        display: 'block',
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
        marginTop: 0,
        marginBottom: 0,
        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
    },
    articleContent: {
        marginTop: '2rem'
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

    recommendationsContainer: {
        maxWidth: storiesWidth,
        margin: '0 auto 2rem'
    },
    recommendationsTitle: {
        marginTop: '2.4rem',
        marginBottom: '.2rem',
        textAlign: 'center',
        fontSize: '1.4rem'
    },
    recommendationsArticle: {
        width: '420px',
        [theme.breakpoints.down('sm')]: {
            maxWidth: '320px'
        }
    },
    recommendationsLink: {
        marginTop: '1.6rem',
        textAlign: 'center',
    },

    commentsContainer: {
        maxWidth: articleAppendixWidth,
        margin: '0 auto 2rem'
    }
});

export default styles;
