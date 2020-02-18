'use strict';

import {
    h1Weight,
    h1LineHeightExtract,
    h1SpacingExtract
} from '../theme';

const styles = (theme) => ({
    articleInfo: {
        color: '#999',
        marginBottom: 3,
        marginTop: 0
    },
    infoItem: {
        paddingTop: '2px !important',
        paddingBottom: '2px !important'
    },
    heading: {
        marginBottom: 15
    },
    title: {
        marginTop: '1rem',
        marginBottom: '0',
        fontSize: '2rem',
        fontWeight: h1Weight,
        lineHeight: h1LineHeightExtract,
        letterSpacing: h1SpacingExtract,
        margin: 'inherit'
    },
    titleLink: {
        color: theme.palette.text.primary
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
    summaryContent: {
        maxHeight: 200,
        fontWeight: 'lighter',
        content: "''",
        position: 'relative',
        textAlign: 'left',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        padding: '.5em',
        '&:before': {
            content: "''",
            fontWeight: 'lighter',
            width: '100%',
            height: 80,
            position: 'absolute',
            left: 0,
            top: 120,
            background: 'transparent linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, .9), #fff)'
        }
    },
    summaryLinkContainer: {
        textAlign: 'center'
    },
    summaryLink: {
        margin: theme.spacing(1.5, 3)
    }
});

export default styles;
