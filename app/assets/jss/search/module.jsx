'use strict';

const styles = (theme) => ({
    container: {
        padding: '.2rem 2rem 2.4rem',
        position: 'relative',
        [theme.breakpoints.down('md')]: {
            marginTop: '1rem'
        }
    },
    category: {
        marginBottom: 16,
    },
    categoryName: {
        marginTop: 10,
        borderBottom: `1px solid ${theme.palette.grey[300]}`,
        fontSize: '1.6rem',
        fontWeight: 500,
        [theme.breakpoints.down('md')]: {
            marginTop: 0
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
    helpMessage: {
        color: theme.palette.grey[600],
        fontStyle: 'italic',
        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
    },
    tag: {
        margin: theme.spacing(0.5, 1),
        fontWeight: 400,
        fontSize: '.9rem',
        borderRadius: 4,
        cursor: 'pointer',
        color: theme.palette.text.secondary,
        borderColor: theme.palette.text.secondary
    },
    tagSelected: {
        backgroundColor: theme.palette.primary.main
    },
    tagHighlighted: {
        backgroundColor: theme.palette.secondary.main
    },
    topic: {
        margin: theme.spacing(0.5, 1),
        fontWeight: 400,
        fontSize: '.9rem',
        cursor: 'pointer'
    },
    articleMainResult: {
        fontSize: '1.1rem',
        color: theme.palette.text.primary,
        marginRight: 10
    },
    articleSecondaryResult: {
        color: theme.palette.grey[600]
    },
    articleHighlighted: {
        border: `1px solid ${theme.palette.secondary.main}`,
        padding: 5
    },
    articleTag: {
        margin: 4,
        padding: 0,
        fontWeight: 400,
        fontSize: '.8rem',
        borderRadius: 4,
        color: theme.palette.text.secondary,
        borderColor: theme.palette.grey[300]
    },
    articleEdit: {
        fontSize: '1rem',
        color: theme.palette.text.primary
    }
});

export default styles;
