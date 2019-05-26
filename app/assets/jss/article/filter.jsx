'use strict';

const styles = (theme) => ({
    aside: {
        fontSize: '1rem',
        display: 'inline-block'
    },
    button: {
        margin: theme.spacing(1),
        padding: theme.spacing(1) / 4,
        fontSize: '.6rem',
        color: theme.palette.primary.main
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    rightIcon: {
        marginLeft: theme.spacing(1),
    },
    buttonLink: {
        margin: theme.spacing(1),
        fontSize: '1rem',
        color: '#000'
    },
});

export default styles;
