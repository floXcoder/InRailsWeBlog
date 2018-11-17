'use strict';

import {
    articleWidth
} from '../theme';

const styles = (theme) => ({
    history: {
        position: 'relative',
        margin: '1rem auto 4rem',
        overflow: 'visible',
        maxWidth: articleWidth
    },
    breadcrumb: {
        margin: '1.5rem 0rem',
        position: 'relative'
    },
    card: {
      marginTop: 12,
      marginBottom: 12
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        marginTop: 8,
        marginLeft: 'auto',
        [theme.breakpoints.up('sm')]: {
            marginRight: -2,
        },
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    versionTitle: {
        fontSize: '1.5rem'
    },
    title: {
        marginTop: 12,
        marginBottom: 8,
        fontSize: '1.3rem',
        textAlign: 'center'
    },
    content: {
        paddingTop: 4
    },
    actions: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
});

export default styles;
