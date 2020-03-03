'use strict';

const styles = (theme) => ({
    modal: {
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -45%)',
        position: 'absolute',
        width: '80%',
        maxWidth: '90vw',
        maxHeight: '90%',
        overflow: 'auto',
        marginTop: '1rem',
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
    select: {
        margin: theme.spacing(1),
        minWidth: 280
    }
});

export default styles;
