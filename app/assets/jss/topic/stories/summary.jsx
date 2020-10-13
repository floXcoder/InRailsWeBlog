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
        margin: '0 auto 1.5rem',
        overflow: 'visible',
        maxWidth: '100%',
        borderRadius: 12,
        backgroundColor: theme.palette.grey[50],
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
        fontSize: '1.1rem',
        fontStyle: 'italic'
    },
    topicLink: {
        marginTop: '.6rem',
        fontSize: '.9rem'
    }
});

export default styles;
