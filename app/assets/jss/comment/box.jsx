'use strict';

const styles = (theme) => ({
    root: {
        marginTop: '4rem',
        marginBottom: '3rem',
        position: 'relative'
    },
    separation: {
        width: '80%',
        display: 'block',
        height: 1,
        border: 0,
        borderTop: '1px solid #ddd',
        padding: 0,
        margin: 'auto'
    },
    title: {
        fontSize: '2rem',
        textAlign: 'center'
    },
    content: {
        padding: 24,
        border: '1px solid #e0e0e0'
    },
    actions: {
        display: 'flex'
    },
    leftIcon: {
        marginRight: theme.spacing.unit
    },
});

export default styles;
