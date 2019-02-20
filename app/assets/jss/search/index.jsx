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
    inputItem: {
        margin: theme.spacing.unit,
        width: '80%'
    },
    searchIcon: {
        color: '#000',
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputForm: {
        width: '100%'
    },
    inputRoot: {
        color: '#000',
        width: '100%',
        paddingLeft: theme.spacing.unit * 5
    },
    inputSearch: {
        fontSize: '2rem'
    },
    inputTag: {
        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 2}px`,
        fontWeight: 400,
        fontSize: '.9rem',
        borderRadius: 4,
        cursor: 'pointer',
        color: theme.palette.text.secondary,
        borderColor: theme.palette.text.secondary
    },
    category: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit
    },
    categoryHeader: {
        borderBottom: `1px solid ${theme.palette.grey[300]}`,
        marginBottom: '1rem'
    },
    categoryItem: {
        paddingBottom: '0 !important'
    },
    categoryTitle: {
        fontSize: '1.6rem',
        fontWeight: 500,
        display: 'inline-block',
        marginBottom: 4
    },
    categoryCount: {
        color: theme.palette.grey[600],
        fontSize: '1rem',
        fontWeight: 300,
        marginLeft: '.6rem'
    },
    categoryFilter: {
        display: 'inline-block'
    },
    categoryFilterList: {
        padding: 5
    },
    categoryFilterSelected: {
        fontWeight: 600
    },
    categoryFilterButton: {
        fontSize: '.9rem',
        fontWeight: 400,
        padding: '6px'
    },
    helpMessage: {
        margin: '1rem 0',
        color: theme.palette.grey[600],
        textAlign: 'center',
        fontSize: '1.4rem',
        fontStyle: 'italic'
    },
    tag: {
        margin: theme.spacing.unit
    },
    tagHighlighted: {
        backgroundColor: theme.palette.secondary.main
    },
    articleCard: {
        marginTop: 16,
        marginBottom: 16
    },
    articleContent: {
        paddingTop: 4
    },
    articleTags: {
        marginTop: theme.spacing.unit * 4,
        marginBottom: 0
    },
    articleTag: {
        margin: theme.spacing.unit / 2,
        fontWeight: 400,
        fontSize: '.9rem',
        borderRadius: 4,
        cursor: 'pointer',
        color: theme.palette.text.secondary,
        borderColor: theme.palette.text.secondary
    },
    articleTitle: {
        fontSize: '2rem',
        color: theme.palette.text.primary
    },
    articleSubtitle: {
        fontSize: '.9rem'
    }
});

export default styles;
