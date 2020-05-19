'use strict';

const styles = (theme) => ({
    root: {
        margin: '.5rem 0',
        padding: '1.5rem .5rem',
        height: 'auto',
        position: 'relative',
        wordWrap: 'break-word'
    },
    rootPrivate: {
        boxShadow: `0px 0px 8px ${theme.palette.secondary.light}`
    },
    over: {
        boxShadow: theme.shadows[5],
    },
    title: {
        fontSize: '2.2rem',
        margin: '0 0 1rem'
    },
    expand: {
        position: 'absolute',
        right: 0,
        top: 0,
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest
        }),
        marginTop: 8,
        marginLeft: 'auto',
        marginRight: -2,
        [theme.breakpoints.down('xs')]: {
            display: 'none'
        }
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    floatingButtons: {
        position: 'absolute',
        height: 'auto',
        listStyle: 'none',
        margin: 0,
        padding: 0,
        left: -38,
        top: 48
    },
    floatingIcons: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: '2rem'
    },
    inlineEditor: {
        borderWidth: 0,
        boxShadow: `0 0 3px ${theme.palette.primary.main}`,
        height: 'auto',
        margin: '1rem 2px',
        padding: '1rem',
        position: 'relative'
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    actionButtons: {
        display: 'inline-flex',
        alignItems: 'center',
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 'auto',
        [theme.breakpoints.up('sm')]: {
            marginRight: -2
        }
    },
    actionItem: {
        display: 'inline-block',
        margin: theme.spacing(1.5),
        [theme.breakpoints.down('md')]: {
            margin: theme.spacing(1.5, 2.5)
        }
    },
    privateMessage: {
        right: 0,
        bottom: 0,
        display: 'block',
        position: 'absolute',
        fontSize: '.85rem',
        fontStyle: 'italic',
        border: '1px solid #e3c23e',
        borderRadius: 5,
        padding: 2
    }
});

export default styles;
