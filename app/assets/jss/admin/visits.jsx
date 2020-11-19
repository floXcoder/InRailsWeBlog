'use strict';

const styles = (theme) => ({
    title: {
        padding: theme.spacing(1),
        borderBottom: `1px solid ${theme.palette.grey[300]}`
    },
    subtitle: {
        fontSize: '1.33rem',
        paddingBottom: theme.spacing(1),
        marginBottom: theme.spacing(2),
        marginRight: theme.spacing(4),
        borderBottom: `1px solid ${theme.palette.grey[300]}`
    },
    gridContainer: {
        width: '90%',
        margin: theme.spacing(3)
    },
    listContainer: {
        width: '90%',
        backgroundColor: theme.palette.background.paper
    },
    listItem: {
        color: theme.palette.grey[900],
        fontSize: '1.2rem'
    },
    listItemSecondary: {
        color: theme.palette.grey[700],
        fontSize: '1rem'
    }
});

export default styles;
