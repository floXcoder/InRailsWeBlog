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
        margin: '.6rem 0'
    },
    tagHeader: {
        paddingTop: 8,
        paddingBottom: 8
    },
    tagCount: {
        width: 22,
        height: 22,
        fontSize: '1rem',
        borderRadius: '50%',
        backgroundColor: theme.palette.grey[300],
        margin: theme.spacing(2),
        paddingLeft: 6,
        paddingRight: 6
    },
    tagButton: {
        color: theme.palette.text.primary,
        margin: theme.spacing(1) / 2,
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
