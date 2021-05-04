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
        fontSize: '2.3rem',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1)
    },
    tagTitle: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1),
        fontSize: '2.3rem',
        color: theme.palette.text.primary,
        textAlign: 'center'
    },
    tagCard: {
        margin: '1.3rem 0'
    },
    tagHeader: {
        paddingTop: 8,
        paddingBottom: 8
    },
    tagCount: {
        width: '100%',
        fontSize: '1rem',
        paddingBottom: theme.spacing(3)
    },
    tagButton: {
        color: theme.palette.text.primary,
        margin: theme.spacing(0.5),
    },
    actions: {
        flexDirection: 'column'
    },
    buttonsRight: {
        marginLeft: 'auto',
        [theme.breakpoints.up('sm')]: {
            marginRight: -8
        }
    }
});

export default styles;
