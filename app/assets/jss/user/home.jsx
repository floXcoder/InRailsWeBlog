'use strict';

import {
    articleAppendixWidth
} from '../theme';

const styles = (theme) => ({
    root: {
        position: 'relative',
        margin: '1rem auto 4rem',
        overflow: 'visible',
        maxWidth: articleAppendixWidth
    },
    card: {
        position: 'relative',
        margin: '3rem .3rem 3rem',
        overflow: 'visible',
        [theme.breakpoints.down('md')]: {
            marginTop: '2rem'
        }
    },
    header: {
        paddingTop: 8,
        paddingBottom: 8
    },
    subheader: {
        fontSize: '.9rem'
    },
    sortIcon: {
        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
    },
    gridTheme: {
        position: 'relative'
    },
    topic: {
        position: 'relative',
        height: '6rem',
        backgroundColor: theme.palette.primary.main,
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        [theme.breakpoints.down('md')]: {
            height: '5rem'
        }
    },
    topicTitle: {
        marginTop: '1rem',
        textAlign: 'center',
        color: '#fff',
        fontSize: '1.2rem'
    },
    topicMode: {
        marginTop: '.8rem',
        marginRight: theme.spacing(-1),
        textAlign: 'right',
        color: '#fff',
        fontSize: '.9rem',
        fontStyle: 'italic',
        [theme.breakpoints.down('md')]: {
            marginTop: 0
        }
    },
    topicNew: {
        height: '6rem',
        backgroundColor: theme.palette.grey[200],
        [theme.breakpoints.down('md')]: {
            height: '5rem'
        }
    },
    topicNewTitle: {
        fontSize: '1.05rem',
        paddingTop: '15%',
        textAlign: 'center',
        fontStyle: 'italic',
        [theme.breakpoints.down('md')]: {
            paddingTop: '9%'
        }
    },
    topicLink: {
        position: 'absolute',
        top: -2,
        right: -4,
        height: '44px !important',
        width: '44px !important',
        borderRadius: '25px !important',
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
    }
});

export default styles;
