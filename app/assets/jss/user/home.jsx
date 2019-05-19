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
        overflow: 'visible'
    },
    header: {
        paddingTop: 8,
        paddingBottom: 8
    },
    sortIcon: {
        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
    },
    gridTheme: {
        position: 'relative'
    },
    theme: {
        position: 'relative',
        height: '6rem',
        backgroundColor: theme.palette.primary.light,
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2
    },
    storyTheme: {
        backgroundColor: theme.palette.secondary.dark
    },
    themeTitle: {
        color: '#fff',
        fontSize: '1.2rem'
    },
    themeNew: {
        height: '6rem',
        backgroundColor: theme.palette.grey[300]
    },
    themeNewTitle: {
        fontSize: '1.2rem',
        paddingTop: '15%',
        textAlign: 'center',
        [theme.breakpoints.down('md')]: {
            paddingTop: '12%'
        }
    },
    topicLink: {
        position: 'absolute',
        top: -2,
        right: -4,
        height: '44px !important',
        width: '44px !important',
        borderRadius: '25px !important',
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.primary.light,
        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
    },
    storyTopicLink: {
        backgroundColor: theme.palette.secondary.dark
    }
});

export default styles;
