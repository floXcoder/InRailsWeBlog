'use strict';

import {
    h1SizeExtract,
    h1WeightExtract,
    h1LineHeightExtract,
    h1SpacingExtract
} from '../theme';

const styles = (theme) => ({
    card: {
        position: 'relative',
        margin: '.4rem .3rem 1.2rem',
        overflow: 'visible',
        border: 0,
        boxShadow: theme.shadows[0]
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
        color: theme.palette.primary.main,
        margin: '1rem 0 .6rem',
        fontSize: h1SizeExtract,
        fontWeight: h1WeightExtract,
        lineHeight: h1LineHeightExtract,
        letterSpacing: h1SpacingExtract,
        textAlign: 'left'
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
        height: 0,
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
    articleTags: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        marginLeft: -theme.spacing(1)
    },
    articleTag: {
        margin: theme.spacing(0.5),
        fontWeight: 400,
        fontSize: '.9rem',
        borderRadius: 4,
        cursor: 'pointer',
        color: theme.palette.text.secondary,
        borderColor: theme.palette.text.secondary
    }
});

export default styles;
