'use strict';

import {
    gridWidth
} from '../theme';

const styles = (theme) => ({
    root: {
        position: 'relative',
        margin: '1rem auto 4rem',
        overflow: 'visible',
        maxWidth: gridWidth
    },
    title: {
        fontSize: '2.8rem',
        fontWeight: 500,
        marginTop: 20
    },
    subtitle: {
        fontSize: '2.4rem',
        marginTop: 30,
        marginBottom: 15
    },
    tagTitle: {
        color: theme.palette.text.primary
    },
    tagCard: {
        margin: '1.3rem 0'
    },
    tagHeader: {
        paddingTop: 8,
        paddingBottom: 8
    },
    tagCount: {
        width: 32,
        height: 32,
        fontSize: '1rem',
        borderRadius: '50%',
        backgroundColor: theme.palette.grey[300],
        margin: theme.spacing(2),
        paddingTop: 3,
        display: 'inline-block',
        textAlign: 'center'
    },
    tagButton: {
        color: theme.palette.text.primary,
        margin: theme.spacing(0.5),
    },
    actions: {
        display: 'flex'
    },
    buttonsRight: {
        marginLeft: 'auto',
        [theme.breakpoints.up('sm')]: {
            marginRight: -8
        }
    },
});

export default styles;
