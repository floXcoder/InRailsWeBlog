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
        marginTop: 4,
        marginBottom: 4
    },
    cardHeader: {
        padding: 4
    },
    cardTitle: {
        marginTop: 12,
        marginBottom: 8,
        fontSize: '1.6rem',
        textAlign: 'center'
    },
    cardContent: {
        paddingTop: 4,
        paddingBottom: '8px !important'
    },
    commentCount: {
        fontSize: '1rem',
        color: 'inherit'
    }
});

export default styles;
