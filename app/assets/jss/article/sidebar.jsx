'use strict';

const styles = (theme) => ({
    title: {
        fontSize: '1.1rem',
        fontWeight: 500,
        lineHeight: '2rem',
        marginBottom: '.6rem'
    },
    order: {
        display: 'flex',
        justifyContent: 'space-evenly',
        width: '100%'
    },
    button: {
        color: theme.palette.primary.main
    },
    timeline: {
        marginTop: '.5rem'
    },
    moreArticles: {
        padding: '5px 12px',
        fontStyle: 'italic',
        fontSize: '.9rem',
        textAlign: 'center'
    },
    articleLink: {
        color: theme.palette.primary.dark,
        fontSize: '.9rem'
    },
    currentLink: {
        fontSize: '1rem',
        fontWeight: 600
    }
});

export default styles;
