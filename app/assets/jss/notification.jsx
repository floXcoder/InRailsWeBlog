'use strict';

import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';

const styles = (theme) => ({
    success: {
        backgroundColor: green[600]
    },
    error: {
        backgroundColor: theme.palette.error.dark
    },
    info: {
        backgroundColor: theme.palette.primary.dark
    },
    warning: {
        backgroundColor: amber[700]
    },
    icon: {
        fontSize: 20
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1)
    },
    close: {
        padding: theme.spacing(0.5)
    },
    message: {
        display: 'flex',
        alignItems: 'center'
    }
});

export default styles;
