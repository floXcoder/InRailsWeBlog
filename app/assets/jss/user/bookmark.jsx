'use strict';

const styles = (theme) => ({
    root: {
        margin: 15,
        minWidth: 220
    },
    title: {
        margin: 5,
        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
    },
    link: {
        fontSize: '.9rem',
        color: theme.palette.primary.dark,
        lineHeight: '1.2rem'
    },
    none: {
        fontStyle: 'italic',
        marginTop: 10
    }
});

export default styles;
