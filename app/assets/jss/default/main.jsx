'use strict';

import {
    headerHeight,
    mainWidth
} from '../theme';

const styles = (theme) => ({
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5),
        [theme.breakpoints.up(mainWidth + theme.spacing(6))]: {
            width: mainWidth,
            marginLeft: 'auto',
            marginRight: 'auto'
        }
    },
    content: {
        marginTop: headerHeight,
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(1)
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        marginTop: theme.spacing(8),
        padding: theme.spacing(6, 0)
    }
});

export default styles;
