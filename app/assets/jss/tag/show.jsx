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
        marginTop: 30
    },
    subtitle: {
        fontSize: '2.4rem',
        fontWeight: 500,
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(1)
    },
    subtitle2: {
        fontSize: '1.6rem',
        fontWeight: 400,
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(1),
        paddingBottom: 8,
        borderBottom: '1px solid rgba(0, 0, 0, 0.2)'
    },
    description: {
        fontSize: '1.1rem',
        fontWeight: 'inherit'
    },
    avatar: {
        color: theme.palette.text.primary
    },
    tagChip: {
        margin: theme.spacing(0.5),
        padding: theme.spacing(1),
        fontWeight: 400,
        fontSize: '.9rem',
        cursor: 'pointer',
        color: theme.palette.text.secondary,
        borderColor: theme.palette.text.secondary,
        borderRadius: 16
    },
    tagLabel: {
        fontSize: '.9rem',
        margin: theme.spacing(0.3)
    }
});

export default styles;
