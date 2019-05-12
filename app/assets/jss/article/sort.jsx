'use strict';

import {
    articleAppendixWidth
} from '../theme';

const styles = (theme) => ({
    root: {
        position: 'relative',
        margin: '1rem auto 4rem',
        overflow: 'visible',
        maxWidth: articleAppendixWidth
    },
    sorting: {
        userSelect: 'none'
    },
    sortingItems: {
        outline: 'none',
        overflow: 'auto',
        position: 'relative'
    },
    sortingItem: {
        alignItems: 'center',
        cursor: 'pointer',
        padding: 8
    },
    card: {
        marginTop: 12,
        marginBottom: 12
    },
    title: {
        marginTop: 12,
        marginBottom: 8,
        fontSize: '2rem',
        textAlign: 'center'
    },
    content: {
        paddingTop: 4
    },
    commentCount: {
        fontSize: '1rem',
        color: 'inherit'
    }
});

export default styles;
