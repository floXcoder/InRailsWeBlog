'use strict';

const styles = (theme) => ({
    container: {
        margin: '2rem auto'
    },
    paper: {
      padding: '1rem'
    },
    title: {
        textAlign: 'center',
        fontSize: '2.4rem',
        margin: '2.4rem'
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
        margin: theme.spacing(3),
        width: '100%'
    },
    link: {
        color: theme.palette.grey[600],
        fontSize: '.9rem',
        fontWeight: 300,
    }
});

export default styles;
