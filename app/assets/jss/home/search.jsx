'use strict';

const styles = (theme) => ({
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.default,
        // '&:hover': {
        //     backgroundColor: fade(theme.palette.common.black, 0.25)
        // },
        marginRight: theme.spacing(2),
        marginLeft: '0 !important',
        width: '100%',
        border: '1px solid #eee',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto'
        }
    },
    searchIcon: {
        width: theme.spacing(9),
        color: '#000',
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
        color: '#000',
        width: '100%',
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
                width: '30vw'
            }
        }
    },
    inputInputFocus: {
        paddingTop: theme.spacing(1),
        paddingRight: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        width: '30vw'
    },
    selectedTagsChip: {
        margin: theme.spacing(0.5, 0.5),
        fontWeight: 400,
        fontSize: '.9rem',
        borderRadius: 4,
        cursor: 'pointer',
        color: theme.palette.text.secondary,
        borderColor: theme.palette.text.secondary
    }
});

export default styles;
