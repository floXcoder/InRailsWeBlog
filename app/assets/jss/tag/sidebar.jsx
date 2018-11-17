'use strict';

const styles = (theme) => ({
    root: {
        padding: 0
    },
    list: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    tagList: {
        margin: theme.spacing.unit
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
        transition: 'visibility .35s, opacity .35s ease-in-out'
    },
    tagsOpen: {
        visibility: 'visible',
        opacity: 1
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
