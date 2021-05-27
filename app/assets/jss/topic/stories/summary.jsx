'use strict';

import {
    lighten
} from '@material-ui/core/styles/colorManipulator';

import {
    h1SizeExtract,
    h1WeightExtract,
    h1LineHeightExtract,
    h1SpacingExtract
} from '../../theme';

const styles = (theme) => ({
    container: {
        position: 'relative',
        margin: '1rem auto 0.5rem',
        overflow: 'visible',
        maxWidth: '100%',
        borderRadius: 12,
        backgroundColor: lighten(theme.palette.secondary.light, .96),
        boxShadow: `0px 0px 5px ${theme.palette.secondary.light}`,
        [theme.breakpoints.down('md')]: {
            margin: '.5rem auto 1rem'
        }
    },
    root: {
        padding: '1rem',
        paddingBottom: '1.5rem'
    },
    topicTitle: {
        textAlign: 'center',
        fontSize: h1SizeExtract,
        fontWeight: h1WeightExtract,
        lineHeight: h1LineHeightExtract,
        letterSpacing: h1SpacingExtract,
        margin: '1rem 0'
    },
    topicDesc: {
        padding: theme.spacing(0, 2),
        fontSize: '1.1rem',
        fontStyle: 'italic'
    },
    topicLink: {
        marginTop: '.6rem',
        fontSize: '.9rem'
    }
});

export default styles;
