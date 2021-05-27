'use strict';

const styles = (theme) => ({
    modal: {
        top: '45%',
        left: '50%',
        transform: 'translate(-50%, -45%)',
        position: 'absolute',
        width: '35vw',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(4),
        [theme.breakpoints.down('md')]: {
            width: '90vw'
        }
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
