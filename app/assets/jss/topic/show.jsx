'use strict';

import {
    gridWidth
} from '../theme';

const styles = (theme) => ({
    root: {
        position: 'relative',
        margin: '1rem auto 4rem',
        overflow: 'visible',
        maxWidth: gridWidth
    },
    title: {
        fontSize: '2.8rem',
        fontWeight: 500,
        marginTop: 60,
        marginBottom: 60
    },
    subtitle: {
        fontSize: '2.4rem',
        fontWeight: 500,
        marginTop: 40,
        marginBottom: 15
    },
    subtitle2: {
        fontSize: '1.6rem',
        fontWeight: 400,
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(1),
        paddingBottom: 8,
        borderBottom: '1px solid rgba(0, 0, 0, 0.2)'
    },
    emptyDesc: {
      fontStyle: 'italic'
    },
    avatar: {
        color: theme.palette.text.primary
    },
    shareButton: {
        marginTop: 15,
        marginBottom: 15,
        fontSize: '.8rem'
    },
    shareButtonIcon: {
        marginLeft: theme.spacing(1)
    },
    topicTag: {
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
