'use strict';

const styles = (theme) => ({
    root: {
        margin: '.1rem .2rem 2.5rem',
        paddingBottom: '1.5rem'
    },
    title: {
        fontSize: '1.1rem',
        fontWeight: 500,
        lineHeight: '2rem',
        marginTop: '.3rem',
        marginBottom: '.3rem',
        textAlign: 'center'
    },
    none: {
        fontSize: '0.9rem',
        lineHeight: '1.5rem',
        fontStyle: 'italic'
    },
    order: {
        display: 'flex',
        justifyContent: 'space-evenly',
        width: '100%'
    },
    button: {
        color: theme.palette.text.secondary
    },
    timeline: {
        marginTop: 0,
        marginBottom: '4rem',
        height: '80vh'
    },
    moreArticles: {
        padding: '5px 12px',
        fontStyle: 'italic',
        fontSize: '.9rem',
        textAlign: 'center'
    },
    articleLink: {
        color: theme.palette.text.secondary,
        fontSize: '.9rem'
    },
    currentLink: {
        fontSize: '1rem',
        fontWeight: 600
    }
});

export default styles;
