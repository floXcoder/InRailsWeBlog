'use strict';

import {
    topicZIndex
} from '../theme';

const styles = (theme) => ({
    module: {
        border: '1px solid #e0e0e0',
        borderRadius: '0 3px 3px 0',
        boxShadow: theme.shadows[5],
        lineHeight: '2rem',
        margin: 0,
        maxHeight: 600,
        minHeight: 400,
        overflow: 'auto',
        padding: '.4rem',
        width: 340,
        zIndex: topicZIndex,
        [theme.breakpoints.down('sm')]: {
            fontSize: '1.3rem',
            width: '90vw'
        }
    },
    title: {
        position: 'relative',
        margin: '1pc 20px 10px 8px',
        fontSize: '1.1rem',
        fontWeight: 600,
        fontStyle: 'italic',
        borderBottom: `1px solid ${theme.palette.grey[300]}`,
        [theme.breakpoints.down('md')]: {
            fontSize: '1.5rem'
        }
    },
    close: {
        position: 'absolute',
        top: 6,
        right: 14,
        zIndex: 1,
        backgroundColor: '#fff',
        borderRadius: '50%',
        [theme.breakpoints.up('md')]: {
            display: 'none'
        }
    },
    list: {
        position: 'relative',
        margin: theme.spacing(1),
    },
    item: {
        backgroundColor: theme.palette.primary.main,
        borderRadius: 3,
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'block',
        position: 'relative',
        textAlign: 'left',
        height: '3rem',
        lineHeight: '3rem',
        margin: '.6rem 0',
        padding: '0 0 0 .8rem',
        width: '100%',
        [theme.breakpoints.down('md')]: {
            margin: '1rem 0'
        }
    },
    itemContent: {
        position: 'relative',
        display: 'block',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        background: theme.palette.primary.dark,
        color: '#fff',
        padding: '0 .8rem',
        transition: '.25s all ease',
        '&:hover': {
            paddingLeft: '1.4rem'
        }
    },
    currentItem: {
        fontWeight: 600
    },
    edition: {
        color: '#fff',
        display: 'inline-block',
        position: 'absolute',
        right: 8,
        top: 11,
        '&:hover': {
            color: theme.palette.text.dark,
        }
    },
    addTopic: {
        margin: '6px 4px 0 0',
        padding: 8,
        position: 'relative',
        fontSize: '.9rem',
        fontStyle: 'italic',
        cursor: 'pointer',
        '&:hover': {
            color: theme.palette.text.dark,
            textDecoration: 'underline'
        }
    }
});

export default styles;
