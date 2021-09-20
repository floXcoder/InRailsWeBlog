'use strict';

const styles = (theme) => ({
    modal: {
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -45%)',
        position: 'absolute',
        width: 860,
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflowY: 'auto',
        backgroundColor: theme.palette.background.paper,
        marginTop: '1rem',
        padding: theme.spacing(4),
        boxShadow: theme.shadows[5]
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
    listItemVisit: {
        marginTop: '1.5rem'
    },
    listItemEvent: {
        paddingLeft: theme.spacing(4)
    },
    listItemEventPrimary: {
        fontSize: '1rem'
    },
    listItemEventSecondary: {
        fontSize: '.9rem'
    }
});

export default styles;
