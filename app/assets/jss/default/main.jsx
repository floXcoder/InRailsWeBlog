'use strict';

import {
    headerHeight,
    mainWidth
} from '../theme';

const styles = (theme) => ({
    content: {
        marginTop: headerHeight,
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(1),
        minHeight: '95vh'
    },
    homeContent: {
        padding: 0
    },
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
    homeLayout: {
        width: '100%',
        padding: 0
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        marginTop: theme.spacing(8),
        padding: theme.spacing(6, 0)
    }
});

export default styles;
