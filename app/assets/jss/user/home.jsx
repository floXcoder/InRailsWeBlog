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
    content: {
    },
    theme: {
        height: '6rem',
        backgroundColor: theme.palette.primary.light,
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
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
        },
    },
});

export default styles;
