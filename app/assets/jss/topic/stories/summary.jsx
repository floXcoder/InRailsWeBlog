'use strict';

import {
    h1SizeExtract,
    h1WeightExtract,
    h1LineHeightExtract,
    h1SpacingExtract
} from '../../theme';

const styles = (theme) => ({
    container: {
        position: 'relative',
        margin: '1rem auto 1.5rem',
        overflow: 'visible',
        maxWidth: '100%',
        backgroundColor: theme.palette.grey[100],
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
        fontSize: '1.1rem'
    },
    topicLink: {
        fontSize: '.9rem'
    }
});

export default styles;
