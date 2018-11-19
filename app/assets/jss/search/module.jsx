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
        fontWeight: 500
    },
    categoryCount: {
        color: theme.palette.grey[600],
        fontSize: '1rem',
        fontWeight: 300,
        marginLeft: '.6rem'
    },
    tag: {
        margin: theme.spacing.unit / 2
    },
    tagSelected: {
        backgroundColor: theme.palette.primary.main
    },
    tagHighlighted: {
        backgroundColor: theme.palette.secondary.main
    },
    articleTitle: {
        fontSize: '1.6rem',
        color: theme.palette.text.primary
    },
    articleEdit: {
        fontSize: '1rem',
        color: theme.palette.text.primary
    }
});

export default styles;
