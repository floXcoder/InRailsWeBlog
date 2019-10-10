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
        margin: '1.2rem'
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
    }
});

export default styles;
