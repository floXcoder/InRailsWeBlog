'use strict';

const styles = (theme) => ({
    container: {
        marginBottom: '.6rem'
    },
    fieldItem: {
        width: '90%',
        margin: theme.spacing(1),
        marginLeft: 'auto',
        marginRight: 'auto',
        [theme.breakpoints.down('md')]: {
            width: '95%'
        }
    },
    textField: {
        width: '100%'
    },
    terms: {
        fontSize: '.9rem'
    },
    password: {
        display: 'block',
        color: theme.palette.grey[600],
        fontSize: '.9rem',
        fontWeight: 300,
        paddingBottom: '1rem'
    }
});

export default styles;
