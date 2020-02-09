'use strict';

const styles = (theme) => ({
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: '#000',
        // '&:hover': {
        //     backgroundColor: fade(theme.palette.common.black, 0.25)
        // },
        marginRight: theme.spacing(2),
        marginLeft: '0 !important',
        width: '100%',
        height: 50,
        border: '1px solid #3f70ae',
        boxShadow: '2px 2px 6px #3f70ae',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto'
        }
    },
    searchIcon: {
        width: theme.spacing(9),
        color: '#fff',
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputLabel: {
        visibility: 'hidden',
        height: 0
    },
    inputRoot: {
        color: '#fff',
        width: '100%',
        height: '100%',
        paddingLeft: theme.spacing(8)
    },
    inputInput: {
        paddingTop: theme.spacing(1),
        paddingRight: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 400
        },
        '&:hover': {
            [theme.breakpoints.up('md')]: {
                width: '26vw'
            }
        }
    },
    searchTagsChip: {
        margin: theme.spacing(0.5, 0.5),
        fontWeight: 400,
        fontSize: '.9rem',
        borderRadius: 4,
        cursor: 'pointer',
        color: '#fff',
        borderColor: '#fff'
    },
    searchTagsChipIcon: {
        color: '#fff'
    },
    refreshIcon: {
        position: 'absolute',
        width: 35,
        height: '100%',
        right: 35,
        top: 10,
        color: '#fff',
        '&:hover': {
            color: '#fff'
        }
    },
    refreshIconActive: {
        color: '#ca3a3a'
    },
    helpIcon: {
        position: 'absolute',
        width: 35,
        height: '100%',
        right: 0,
        top: 10,
        color: '#fff',
        opacity: 0.7,
        '&:hover': {
            color: '#fff',
            opacity: 1
        }
    }
});

export default styles;
