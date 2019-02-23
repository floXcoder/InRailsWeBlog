'use strict';

const styles = (theme) => ({
    root: {
      margin: '.4rem .6rem'
    },
    title: {
        fontSize: '1.1rem',
        fontWeight: 500,
        lineHeight: '2rem',
        marginTop: '.3rem',
        marginBottom: '.3rem'
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
        color: theme.palette.primary.main
    },
    timeline: {
        marginTop: '.5rem',
        marginBottom: '4rem'
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
