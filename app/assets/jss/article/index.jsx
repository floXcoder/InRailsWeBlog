'use strict';

import {
    gridWidth,
    articleAppendixWidth
} from '../theme';

const styles = () => ({
    articleIndex: {
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
    infiniteText: {
        fontSize: '1.5rem',
        fontWeight: 500,
        marginTop: '1rem',
        textAlign: 'center'
    }
});

export default styles;
