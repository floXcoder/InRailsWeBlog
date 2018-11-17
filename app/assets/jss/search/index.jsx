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
    breadcrumb: {
        margin: '1.5rem 0rem',
        position: 'relative'
    },
    inputItem: {
        margin: theme.spacing.unit,
        width: '80%'
    },
    inputForm: {
        width: '100%'
    },
    inputInput: {
        fontSize: '2rem'
    },
    tag: {
        margin: theme.spacing.unit,
    },
    category: {
        marginBottom: 32,
    },
    categoryName: {
        borderBottom: `1px solid ${theme.palette.grey[300]}`,
        fontSize: '1.6rem',
        fontWeight: 500,
    },
    categoryCount: {
        color: theme.palette.grey[600],
        fontSize: '1rem',
        fontWeight: 300,
        marginLeft: '.6rem'
    },
    categoryFilter: {
        display: 'inline-block',
        float: 'right'
    },
    categoryFilterButton: {
        fontSize: '.9rem',
        fontWeight: 400,
        padding: '0 .3rem'
    },
    articleCard: {
        marginTop: 16,
        marginBottom: 16
    },
    articleContent: {
        paddingTop: 4
    },
    articleTags: {
        marginTop: theme.spacing.unit * 2,
        marginBottom: 0
    },
    articleTag: {
        marginLeft: theme.spacing.unit / 2,
        marginRight: theme.spacing.unit / 2
    },
    articleTitle: {
        fontSize: '2rem',
        color: theme.palette.text.primary,
    },
    articleSubtitle: {
        fontSize: '.9rem',
    },
});

export default styles;
