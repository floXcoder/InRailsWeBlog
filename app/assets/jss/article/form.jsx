'use strict';

import {
    articleWidth
} from '../theme';

const styles = () => ({
    root: {
        position: 'relative',
        margin: '1rem auto 4rem',
        overflow: 'visible',
        maxWidth: articleWidth
    },
    articleForm: {
        marginLeft: '.75rem',
        marginRight: '.75rem'
    },
    breadcrumb: {
        margin: '1.5rem 0rem',
        position: 'relative'
    },
});

export default styles;
