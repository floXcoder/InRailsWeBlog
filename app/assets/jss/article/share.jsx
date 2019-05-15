'use strict';

const styles = (theme) => ({
    modal: {
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -45%)',
        position: 'absolute',
        width: 650,
        maxWidth: '90vw',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4
    },
    title: {
        marginTop: 0,
        marginBottom: theme.spacing.unit * 3,
        fontSize: '2rem',
        textAlign: 'center'
    }
});

export default styles;
