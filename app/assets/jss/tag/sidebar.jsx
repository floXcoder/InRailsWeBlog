'use strict';

const styles = (theme) => ({
    cloudList: {
        display: 'flex',
        flexWrap: 'wrap',
        paddingBottom: 80,
        [theme.breakpoints.down('md')]: {
            margin: '.4rem .6rem'
        },
        height: '90vh'
    },
    cloudTopic: {
        margin: '1.3rem .4rem .3rem',
        fontSize: '1rem',
        fontWeight: 600,
        borderBottom: `1px solid ${theme.palette.grey[200]}`
    },
    cloudTag: {
        margin: theme.spacing(0.5),
        fontWeight: 400,
        fontSize: '.9rem',
        borderRadius: 4,
        cursor: 'pointer',
        color: theme.palette.text.secondary,
        borderColor: theme.palette.text.secondary
    },
    tagList: {
        position: 'relative',
        padding: '0 0 80px',
        whiteSpace: 'nowrap'
    },
    labelsLink: {
        position: 'absolute',
        top: -32,
        right: 12,
        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
    },
    labelsIcon: {
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
        transition: 'visibility .35s, opacity .35s ease-in-out',
        height: '90vh'
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
        margin: theme.spacing(0.5),
        fontWeight: 400,
        fontSize: '1rem',
        color: theme.palette.text.secondary
    },
    nestedLabel: {
        fontSize: '.9rem',
        fontWeight: 400,
        color: theme.palette.text.secondary
    },
    selectedLabel: {
        fontSize: '1.1rem !important',
        fontWeight: 600
    },
    noTags: {
        whiteSpace: 'normal',
        padding: '.5rem',
        fontStyle: 'italic'
    }
});

export default styles;
