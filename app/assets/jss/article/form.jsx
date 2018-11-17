'use strict';

import {
    articleWidth
} from '../theme';

const styles = (theme) => ({
    root: {
        position: 'relative',
        margin: '1rem auto 4rem',
        overflow: 'visible',
        maxWidth: articleWidth
    },
    breadcrumb: {
        margin: '1.5rem 0rem',
        position: 'relative'
    },
});

export default styles;
