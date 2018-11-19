'use strict';

import {
    appendixWidth
} from '../theme';

const styles = (theme) => ({
    appendix: {
        position: 'relative',
        margin: '.4rem .3rem 2rem',
        overflow: 'visible',
        width: appendixWidth,
        marginLeft: 50,
        marginTop: -35
    },
    fabButton: {
        marginTop: 15,
        backgroundColor: theme.palette.grey[100],
        boxShadow: theme.shadows[5],
    },
    header: {
        paddingTop: 12,
        paddingBottom: 4,
        textAlign: 'center'
    },
    title: {
        fontSize: '1.1rem',
        fontWeight: 500
    },
    order: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%'
    },
    articleLink: {
        color: theme.palette.primary.dark,
        fontSize: '.9rem'
    },
    currentLink: {
        fontSize: '1.1rem',
        fontWeight: 600,
    },
});

export default styles;
