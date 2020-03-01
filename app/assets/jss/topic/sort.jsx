'use strict';

import {
    sortZIndex
} from '../theme';

const styles = (theme) => ({
    modal: {
        top: '5%',
        left: '35%',
        position: 'absolute',
        width: 650,
        maxWidth: '90vw',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(4)
    },
    title: {
        marginTop: 0,
        marginBottom: 0,
        fontSize: '2rem',
        textAlign: 'center'
    },
    sorting: {
        userSelect: 'none'
    },
    sortingItems: {
        position: 'relative',
        maxHeight: '70vh',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(3),
        overflow: 'auto',
        outline: 'none'
    },
    sortingItem: {
        zIndex: sortZIndex,
        alignItems: 'center',
        cursor: 'pointer',
        padding: 8
    },
    card: {
        marginTop: 12,
        marginBottom: 12
    },
    cardTitle: {
        margin: 0,
        fontSize: '1.3rem',
        textAlign: 'center'
    },
    cardContent: {
        paddingTop: 4
    },
    commentCount: {
        fontSize: '1rem',
        color: 'inherit'
    }
});

export default styles;
