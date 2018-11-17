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
        width: 280,
        zIndex: topicZIndex,
        [theme.breakpoints.down('md')]: {
            fontSize: '1.3rem',
            width: '90vw'
        }
    },
    title: {
        fontSize: '1.1rem',
        fontWeight: 600,
        fontStyle: 'italic',
        margin: '1pc 30px 10px 8px',
        position: 'relative',
        [theme.breakpoints.down('md')]: {
            fontSize: '1.5rem'
        }
    },
    close: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 1,
        [theme.breakpoints.up('md')]: {
            display: 'none'
        }
    },
    list: {
        position: 'relative'
    },
    item: {
        backgroundColor: theme.palette.primary.main,
        borderRadius: 3,
        boxSizing: 'border-box',
        cursor: 'pointer',
        display: 'block',
        height: '3rem',
        lineHeight: '3rem',
        margin: '.6rem 0',
        padding: '0 0 0 .8rem',
        position: 'relative',
        width: '100%'
    },
    itemContent: {
        background: theme.palette.primary.light,
        color: '#fff',
        display: 'block',
        padding: '0 .8rem',
        position: 'relative',
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
        cursor: 'pointer',
        margin: '6px 4px 0 0',
        padding: 8,
        position: 'relative',
        '&:hover': {
            color: theme.palette.text.dark,
            textDecoration: 'underline'
        }
    }

});

export default styles;
