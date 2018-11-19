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
    grid: {
        maxWidth: gridWidth
    },
});

export default styles;
