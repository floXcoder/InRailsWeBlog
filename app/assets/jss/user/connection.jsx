'use strict';

const styles = (theme) => ({
    container: {
        marginBottom: '.5rem'
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
        color: theme.palette.grey[600],
        fontSize: '.9rem',
        fontWeight: 300,
    }
});

export default styles;
