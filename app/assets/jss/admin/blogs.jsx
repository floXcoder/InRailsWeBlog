'use strict';

const styles = (theme) => ({
    card: {
        position: 'relative',
        margin: '.4rem .3rem 2rem',
        overflow: 'visible',
        [theme.breakpoints.down('md')]: {
            marginTop: '.8rem',
            marginBottom: '2.8rem'
        }
    },
    header: {
        paddingTop: 8,
        paddingBottom: 16
    },
    title: {
        marginTop: '1rem',
        marginBottom: '0',
        color: '#000',
        fontSize: '1.8rem',
        fontWeight: 600,
        lineHeight: '2.5rem',
        letterSpacing: 3.5,
        margin: 'inherit',
        textAlign: 'center',
        [theme.breakpoints.down('md')]: {
            fontSize: '2.4rem'
        }
    },
    expand: {
        transform: 'rotate(180deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest
        }),
        marginTop: 8,
        marginLeft: 'auto',
        [theme.breakpoints.up('sm')]: {
            marginRight: -2
        }
    },
    expandOpen: {
        transform: 'rotate(0deg)',
    },
    content: {
        paddingTop: 6
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    actionButtons: {
        // display: 'inline-flex',
        marginLeft: 'auto',
        [theme.breakpoints.up('sm')]: {
            marginRight: -2
        }
    },
    actionItem: {
        display: 'inline-block',
        margin: theme.spacing(1)
    }
});

export default styles;
