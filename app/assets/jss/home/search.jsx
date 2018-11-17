'use strict';

const styles = (theme) => ({
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.default,
        // '&:hover': {
        //     backgroundColor: fade(theme.palette.common.black, 0.25)
        // },
        marginRight: theme.spacing.unit * 2,
        marginLeft: '0 !important',
        width: '100%',
        border: '1px solid #eee',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit * 3,
            width: 'auto'
        }
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        color: '#000',
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputRoot: {
        color: '#000',
        width: '100%'
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 400
        },
        '&:hover': {
            [theme.breakpoints.up('md')]: {
                width: '40vw'
            }
        }
    },
    inputInputFocus: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        width: '40vw'
    },
});

export default styles;
