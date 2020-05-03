'use strict';

const styles = (theme) => ({
    search: {
        position: 'relative',
        backgroundColor: theme.palette.grey[100],
        marginRight: theme.spacing(2),
        marginLeft: '0 !important',
        width: '100%',
        border: '1px solid #eee',
        borderRadius: 24,
        transition: 'border 1s ease-out',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto'
        },
        '&:hover': {
            border: '1px solid #aaa'
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
        textIndent: '-9999px',
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
                width: '38vw',
                minWidth: 400
            }
        }
    },
    inputInputFocus: {
        paddingTop: theme.spacing(1),
        paddingRight: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        [theme.breakpoints.up('md')]: {
            width: '38vw',
            minWidth: 400
        }
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
