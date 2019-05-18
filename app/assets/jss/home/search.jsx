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
        width: '100%',
        paddingLeft: theme.spacing.unit * 8
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
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
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        width: '30vw'
    },
    selectedTagsChip: {
        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 2}px`,
        fontWeight: 400,
        fontSize: '.9rem',
        borderRadius: 4,
        cursor: 'pointer',
        color: theme.palette.text.secondary,
        borderColor: theme.palette.text.secondary
    }
});

export default styles;
