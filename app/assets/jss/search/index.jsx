'use strict';

import {
    gridWidth
} from '../theme';

const styles = (theme) => ({
    root: {
        position: 'relative',
        margin: '1rem auto 4rem',
        overflow: 'visible',
        maxWidth: gridWidth,
        [theme.breakpoints.down('md')]: {
            margin: '1rem .8rem'
        }
    },
    inputItem: {
        margin: theme.spacing(1),
        width: '80%',
        [theme.breakpoints.down('md')]: {
            padding: '8px !important',
            width: '95%'
        }
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
    searchButton: {
        [theme.breakpoints.down('md')]: {
            padding: '8px !important',
            fontSize: '1rem',
            marginBottom: '1.2rem'
        }
    },
    inputForm: {
        width: '100%'
    },
    inputRoot: {
        color: '#000',
        width: '100%',
        paddingLeft: theme.spacing(5)
    },
    inputSearch: {
        fontSize: '2rem'
    },
    inputTag: {
        margin: theme.spacing(0.5, 0.5),
        fontWeight: 400,
        fontSize: '.9rem',
        borderRadius: 4,
        cursor: 'pointer',
        color: theme.palette.text.secondary,
        borderColor: theme.palette.text.secondary
    },
    category: {
        margin: theme.spacing(1.5)
    },
    categoryAutocomplete: {
        marginTop: 0,
        marginBottom: theme.spacing(2),
        paddingLeft: '1.5rem'
    },
    categoryHelper: {
        marginRight: theme.spacing(1),
        fontSize: '.9rem',
        fontStyle: 'italic'
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
    categorySubtitle: {
        marginLeft: '.6rem',
        fontStyle: 'italic',
        borderBottom: `1px solid ${theme.palette.grey[300]}`
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
    categoryFilterInput: {
        fontSize: '1rem'
    },
    categoryFilterHelper: {
        fontSize: '.9rem'
    },
    helpMessage: {
        margin: '1.4rem 0',
        color: theme.palette.grey[600],
        textAlign: 'center',
        fontSize: '1.4rem',
        fontStyle: 'italic'
    },
    tag: {
        margin: theme.spacing(1)
    },
    tagHighlighted: {
        backgroundColor: theme.palette.secondary.main
    },
    articleCard: {
        marginTop: 16,
        marginBottom: 16
    },
    articleCardHeader: {
        width: '100%'
    },
    articleContent: {
        padding: theme.spacing(2),
        paddingTop: 0,
        whiteSpace: 'pre-line',
        wordBreak: 'break-word'
    },
    articleTags: {
        marginTop: theme.spacing(4),
        marginBottom: 0
    },
    articleTag: {
        margin: theme.spacing(0.5),
        padding: theme.spacing(1),
        fontWeight: 400,
        fontSize: '.9rem',
        cursor: 'pointer',
        color: theme.palette.text.secondary,
        borderColor: theme.palette.text.secondary,
        borderRadius: 16
    },
    articleHighlightedTag: {
        backgroundColor: theme.palette.secondary.light
    },
    tagAutocomplete: {
        fontSize: '.8rem'
    },
    articleTitle: {
        fontSize: '1.8rem',
        color: theme.palette.text.primary
    },
    articleGridTitle: {
        fontSize: '1.5rem',
        color: theme.palette.text.primary
    },
    articleSubtitle: {
        fontSize: '.9rem'
    },
    articleOther: {
        margin: '2rem 2rem 0',
        fontSize: '1rem',
        borderBottom: `1px solid ${theme.palette.grey[300]}`
    },
    articleLinksResults: {
        margin: '22px 6px 12px',
        padding: 8,
        border: `1px solid ${theme.palette.secondary.light}`,
        borderRadius: 8,
        boxShadow: `1px 1px 2px ${theme.palette.secondary.light}`,
        fontSize: '1rem',
        fontStyle: 'italic'
    }
});

export default styles;
