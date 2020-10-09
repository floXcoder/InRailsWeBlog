'use strict';

const styles = (theme) => ({
    paper: {
        margin: '4rem auto',
        textAlign: 'center'
    },
    topic: {
        position: 'relative',
        maxHeight: '5rem',
        backgroundColor: theme.palette.primary.main,
        margin: '1rem',
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2)
    },
    topicTitle: {
        padding: theme.spacing(0, 1),
        color: '#fff',
        fontSize: '1.2rem'
    },
    topicMode: {
        color: '#fff',
        fontSize: '.9rem',
        fontStyle: 'italic'
    }
});

export default styles;
