'use strict';

import {
    articleAppendixWidth
} from './theme';

const styles = (theme) => ({
    root: {
        position: 'relative',
        margin: '1rem auto 4rem',
        overflow: 'visible',
        maxWidth: articleAppendixWidth
    },
    title: {
        marginTop: 8,
        color: theme.palette.primary.dark,
        fontSize: '1.8rem',
        fontWeight: 600,
        fontStyle: 'center',
        textTransform: 'uppercase'
    },
    subtitle: {
        margin: '2.5rem 0 .5rem',
        fontSize: '1.6rem',
        color: theme.palette.primary.dark
    }
});

export default styles;
