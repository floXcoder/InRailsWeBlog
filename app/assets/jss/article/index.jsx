'use strict';

import {
    gridWidth,
    articleAppendixWidth
} from '../theme';

const styles = (theme) => ({
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
    }
});

export default styles;
