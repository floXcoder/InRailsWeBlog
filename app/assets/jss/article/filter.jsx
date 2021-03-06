'use strict';

const styles = (theme) => ({
    aside: {
        fontSize: '1rem',
        display: 'inline-block'
    },
    leftIcon: {
        marginRight: theme.spacing(1)
    },
    rightIcon: {
        marginLeft: theme.spacing(1)
    },
    button: {
        margin: theme.spacing(1),
        padding: theme.spacing(1),
        fontSize: '.8rem',
        color: theme.palette.text.secondary
    },
    buttonLink: {
        margin: theme.spacing(1),
        fontSize: '0.95rem',
        color: '#000'
    },
    buttonInfo: {
        color: theme.palette.grey[600],
        fontSize: '.6rem',
        paddingLeft: 4,
        paddingRight: 0,
        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
    },
    sortLink: {
        margin: theme.spacing(2),
        color: theme.palette.grey[600],
        fontSize: '.85rem',
        fontStyle: 'italic',
        fontWeight: 400
    }
});

export default styles;
