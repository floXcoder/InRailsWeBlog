'use strict';

import {
    h1SizeExtract,
    h1WeightExtract,
    h1LineHeightExtract,
    h1SpacingExtract
} from '../theme';

const styles = (theme) => ({
    paper: {
        marginTop: 30,
        borderBottom: '1px solid rgba(0, 0, 0, .12)',
        borderRadius: 0
    },
    card: {
        position: 'relative',
        padding: '.4rem .3rem 1.2rem',
        overflow: 'visible',
        border: 0,
        boxShadow: theme.shadows[0]
    },
    cardPaper: {
        paddingBottom: '.2rem'
    },
    cardPrivate: {
        margin: 0,
        boxShadow: `0px 0px 8px ${theme.palette.secondary.light}`
    },
    header: {
        paddingTop: 0,
        paddingBottom: 0
    },
    headerItem: {
        paddingTop: '0 !important',
        paddingBottom: '0 !important'
    },
    extractTitle: {
        margin: '1rem 0 .6rem',
        fontSize: h1SizeExtract,
        fontWeight: h1WeightExtract,
        lineHeight: h1LineHeightExtract,
        letterSpacing: h1SpacingExtract,
        textAlign: 'left'
    },
    extractTitleLink: {
        color: theme.palette.text.primary
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
    media: {
        // height: 0,
        paddingTop: '56.25%', // 16:9
    },
    content: {
        paddingTop: 6
    },
    avatarContainer: {
        paddingLeft: 6,
        paddingTop: 4,
        paddingBottom: 4
    },
    avatar: {
        display: 'none'
    },
    avatarIcon: {
        fontSize: 26
    },
    userPseudo: {
        fontSize: '.9rem',
        color: 'inherit'
    },
    separator: {
        fontSize: 20,
        '&:after': {
            content: "'\\00B7'"
        }
    },
    date: {
        fontSize: '.9rem'
    },
    commentCount: {
        fontSize: '1rem',
        color: 'inherit'
    },
    articleContent: {
        paddingTop: 4,
        paddingBottom: '4px !important'
    },
    articleContentFaded: {
        position: 'relative',
        maxHeight: 200,
        content: "''",
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        padding: '.5em',
        '&:before': {
            content: "''",
            fontWeight: 'lighter',
            width: '100%',
            height: 60,
            position: 'absolute',
            left: 0,
            bottom: 0,
            background: 'transparent linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, .9), #fff)'
        }
    },
    articleTags: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        marginLeft: -theme.spacing(1)
    },
    articleTag: {
        margin: theme.spacing(0.5),
        padding: theme.spacing(1, 1),
        fontWeight: 400,
        fontSize: '.9rem',
        cursor: 'pointer',
        color: theme.palette.text.secondary,
        borderColor: theme.palette.text.secondary,
        borderRadius: 16
    },
    privateMessage: {
        right: 0,
        top: 0,
        display: 'block',
        position: 'absolute',
        fontSize: '.85rem',
        fontStyle: 'italic',
        border: '1px solid #e3c23e',
        borderRadius: 5,
        padding: 2
    }
});

export default styles;
