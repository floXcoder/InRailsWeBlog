'use strict';

const styles = (theme) => ({
    root: {
        marginTop: '4rem',
        marginBottom: '3rem',
        position: 'relative'
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
