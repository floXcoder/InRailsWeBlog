'use strict';

const styles = (theme) => ({
    container: {
        padding: '.2rem 2rem 1.6rem',
        position: 'relative',
        [theme.breakpoints.down('md')]: {
            marginTop: '1rem'
        }
    },
    gridItem: {
        [theme.breakpoints.down('md')]: {
            padding: '8px 16px !important'
        }
    },
    category: {
        marginBottom: 16,
        [theme.breakpoints.down('md')]: {
            marginBottom: 8
        }
    },
    categoryName: {
        marginTop: 10,
        marginBottom: 16,
        borderBottom: `1px solid ${theme.palette.grey[300]}`,
        fontSize: '1.6rem',
        fontWeight: 500,
        [theme.breakpoints.down('md')]: {
            marginTop: 0,
            marginBottom: 12
        }
    },
    categoryCount: {
        color: theme.palette.grey[600],
        fontSize: '1rem',
        fontWeight: 300,
        marginLeft: '.6rem'
    },
    categoryDivider: {
        margin: theme.spacing(2)
    },
    defaultMessage: {
        margin: theme.spacing(4),
        textAlign: 'center',
        fontStyle: 'italic'
    },
    helpMessage: {
        color: theme.palette.grey[600],
        fontSize: '1rem',
        fontStyle: 'italic',
        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
    },
    tag: {
        margin: theme.spacing(0.5, 1),
        borderRadius: 4,
        cursor: 'pointer',
        borderColor: theme.palette.text.secondary
    },
    tagSelected: {
        backgroundColor: theme.palette.primary.main
    },
    tagHighlighted: {
        backgroundColor: theme.palette.secondary.main
    },
    tagLink: {
        color: theme.palette.text.secondary,
        fontWeight: 400,
        fontSize: '.9rem'
    },
    tagAdd: {
        paddingLeft: 6,
        width: 26,
        color: theme.palette.text.secondary,
        borderLeft: `1px solid ${theme.palette.grey[500]}`
    },
    topic: {
        margin: theme.spacing(0.5, 1),
        fontWeight: 400,
        fontSize: '.9rem',
        cursor: 'pointer'
    },
    articleMainItem: {
        minHeight: 50
    },
    articleMainResult: {
        fontSize: '1.1rem',
        color: theme.palette.text.primary,
        marginRight: 10
    },
    articleHighlightResult: {
        color: theme.palette.grey[600],
        fontSize: '.9rem',
        paddingLeft: theme.spacing(1)
    },
    articleSecondaryResult: {
        color: theme.palette.grey[600]
    },
    otherArticlesTitle: {
        color: theme.palette.grey[600],
        paddingLeft: 15,
        fontWeight: 500,
        fontSize: '1rem'
    },
    articleHighlighted: {
        border: `1px solid ${theme.palette.secondary.main}`,
        borderRadius: 6,
        padding: 5
    },
    articleTag: {
        margin: theme.spacing(1),
        padding: theme.spacing(1, 1),
        fontWeight: 400,
        fontSize: '.8rem',
        color: theme.palette.text.secondary,
        borderColor: theme.palette.grey[300],
        borderRadius: 16
    },
    articleEdit: {
        fontSize: '1rem',
        color: theme.palette.text.primary
    },
    searchButton: {
        textAlign: 'center',
        [theme.breakpoints.down('lg')]: {
            marginTop: theme.spacing(1.5)
        }
    }
});

export default styles;
