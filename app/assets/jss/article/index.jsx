'use strict';

import {
    gridWidth,
    articleAppendixWidth
} from '../theme';

const styles = (theme) => ({
    root: {
        position: 'relative',
        margin: '1rem auto 4rem',
        overflow: 'visible',
        maxWidth: articleAppendixWidth
    },
    largeContainer: {
        maxWidth: gridWidth
    },
    fullContainer: {
        width: '100%'
    },
    tagTitle: {
        fontSize: '1.2rem',
        fontWeight: 500,
        fontStyle: 'italic',
        borderBottom: `1px solid ${theme.palette.grey[600]}`,
        marginTop: '2rem'
    },
    infiniteText: {
        fontSize: '1.5rem',
        fontWeight: 500,
        marginTop: '1rem',
        textAlign: 'center'
    }
});

export default styles;
