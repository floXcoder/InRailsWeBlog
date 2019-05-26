'use strict';

const styles = (theme) => ({
    root: {
        position: 'relative',
        padding: 0
    },
    list: {
        display: 'flex',
        flexWrap: 'wrap',
        [theme.breakpoints.down('md')]: {
            margin: '.4rem .6rem'
        }
    },
    tagList: {
        margin: theme.spacing(1) / 2,
        fontSize: '1rem',
        fontWeight: 400,
        borderRadius: 4,
        cursor: 'pointer',
        color: theme.palette.primary.main,
        borderColor: theme.palette.text.secondary
    },
    allLabels: {
        position: 'absolute',
        top: -32,
        right: 12,
        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
    },
    iconLabels: {
        marginLeft: 8,
        height: '.8em',
        color: theme.palette.text.primary
    },
    listItem: {
        paddingBottom: 4
    },
    searchItem: {
        paddingTop: 4
    },
    title: {
        marginLeft: 60,
        textAlign: 'center',
        fontStyle: 'italic'
    },
    item: {
        transition: 'all .45s',
        transform: 'translate(0)',
        padding: '0 16px'
    },
    itemOpen: {
        transform: 'translate(-60px)'
    },
    input: {
        width: 'auto',
        marginTop: 0,
        marginRight: -60
        // maxWidth: '240px'
    },
    tags: {
        visibility: 'hidden',
        opacity: 0,
        marginTop: '1rem',
        transition: 'visibility .35s, opacity .35s ease-in-out'
    },
    tagsOpen: {
        visibility: 'visible',
        opacity: 1
    },
    expandIcon: {
        width: '25%',
        height: 30,
        padding: '2px 8px 2px 8px'
    },
    label: {
        fontSize: '1.2rem',
        color: theme.palette.text.primary
    },
    nestedLabel: {
        fontSize: '1.1rem',
        color: theme.palette.text.primary
    },
    selectedLabel: {
        fontSize: '1.3rem !important',
        fontWeight: 600
    }
});

export default styles;
