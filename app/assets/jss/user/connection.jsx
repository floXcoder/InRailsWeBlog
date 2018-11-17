'use strict';

const styles = (theme) => ({
    fieldItem: {
        width: '90%',
        margin: theme.spacing.unit,
        marginLeft: 'auto',
        marginRight: 'auto',
        [theme.breakpoints.down('md')]: {
            width: '95%'
        }
    },
    textField: {
        width: '100%'
    },
});

export default styles;
