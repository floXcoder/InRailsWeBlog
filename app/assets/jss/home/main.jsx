'use strict';

import {
    headerHeight,
    mainWidth
} from '../theme';

const styles = (theme) => ({
    layout: {
        width: 'auto',
        marginLeft: theme.spacing.unit / 2,
        marginRight: theme.spacing.unit / 2,
        [theme.breakpoints.up(mainWidth + theme.spacing.unit * 3 * 2)]: {
            width: mainWidth,
            marginLeft: 'auto',
            marginRight: 'auto'
        }
    },
    content: {
        marginTop: headerHeight,
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit,
        [theme.breakpoints.up(mainWidth + theme.spacing.unit * 3 * 2)]: {
            padding: theme.spacing.unit * 3
        }
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        marginTop: theme.spacing.unit * 8,
        padding: `${theme.spacing.unit * 6}px 0`
    },
});

export default styles;
