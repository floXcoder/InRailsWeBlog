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
    articleForm: {
        [theme.breakpoints.down('md')]: {
            marginLeft: '.75rem',
            marginRight: '.75rem'
        }
    },
    breadcrumb: {
        margin: '1.5rem 0rem',
        position: 'relative'
    },
});

export default styles;
