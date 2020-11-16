'use strict';

const styles = (theme) => ({
    modal: {
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -45%)',
        position: 'absolute',
        width: 860,
        maxWidth: '90vw',
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
    container: {
        maxHeight: '60vh',
        overflowY: 'auto',
        overflowX: 'hidden'
    },
    tabItem: {
        fontSize: '1rem'
    },
    listItem: {
        color: theme.palette.grey[700],
        fontSize: '1rem'
    }
});

export default styles;
