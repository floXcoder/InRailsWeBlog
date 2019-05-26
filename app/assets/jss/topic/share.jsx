'use strict';

const styles = (theme) => ({
    modal: {
        top: '45%',
        left: '50%',
        transform: 'translate(-50%, -45%)',
        position: 'absolute',
        width: theme.spacing(50),
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(4)
    },
    title: {
        marginTop: 0,
        marginBottom: theme.spacing(3),
        fontSize: '2rem',
        textAlign: 'center'
    },
    input: {
        margin: '1.1rem .1rem'
    }
});

export default styles;
