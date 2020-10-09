'use strict';

import {
    createMuiTheme
} from '@material-ui/core/styles';

// Sizes
export const headerHeight = 62;
export const drawerWidth = 280;
export const mainWidth = 1200;
export const articleWidth = 780;
export const articleAppendixWidth = 924;
export const gridWidth = 1180;
export const storiesWidth = 920;

// zIndex
// export const mainZIndex = 1;
export const topicZIndex = 60;
export const mobileStepperZIndex = 1000;
export const appBarZIndex = 1100;
export const drawerZIndex = 1200;
export const modalZIndex = 1300;
export const sortZIndex = 1400;
export const snackbarZIndex = 1500;
export const tooltipZIndex = 1600;
// const dropdownIndex = 1700;

// Titles font
export const h1Size = '3rem';
export const h1SizeMobile = '2.4rem';
export const h1Weight = 700;
export const h1LineHeight = '3.3rem';
export const h1LineHeightMobile = '2.4rem';
export const h1Spacing = 3.5;

export const h1SizeGrid = '2.2rem';
export const h1WeightGrid = 500;
export const h1LineHeightGrid = '2.4rem';
export const h1SpacingGrid = 1.8;

export const h1SizeExtract = '2rem';
export const h1WeightExtract = 700;
export const h1LineHeightExtract = '2.2rem';
export const h1SpacingExtract = 2.6;

// Admin
export const adminDrawerWidth = 250;

// Variables also present in _variables.scss
const theme = createMuiTheme({
    breakpoints: {
        keys: ['xs', 'sm', 'md', 'lg', 'xl'],
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920
        }
    },

    typography: {
        htmlFontSize: 12
    },

    palette: {
        background: {
            default: '#fff',
            paper: '#fff'
        },
        text: {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.63)',
            disabled: 'rgba(0, 0, 0, 0.38)',
            hint: 'rgba(0, 0, 0, 0.38)'
        },
        primary: {
            light: '#1cd13b',
            main: '#199332',
            dark: '#036603'
        },
        secondary: {
            light: '#fddc42',
            main: '#e3c23e',
            dark: '#bda731'
        },
        action: {
            active: 'rgba(0, 0, 0, 0.66)',
            // hover: 'rgba(0, 0, 0, 0.08)',
            // hoverOpacity: 0.08,
            // selected: 'rgba(0, 0, 0, 0.14)',
            // disabled: 'rgba(0, 0, 0, 0.26)',
            // disabledBackground: 'rgba(0, 0, 0, 0.12)'
        },
        // error: {
        //     light: '#e57373',
        //     main: '#f44336',
        //     dark: '#d32f2f',
        //     contrastText: '#fff'
        // },
        // warning: {
        //     light: '#ffb74d',
        //     main: '#ff9800',
        //     dark: '#f57c00',
        //     contrastText: 'rgba(0, 0, 0, 0.87)'
        // },
        // info: {
        //     light: '#64b5f6',
        //     main: '#2196f3',
        //     dark: '#1976d2',
        //     contrastText: '#fff'
        // },
        // success: {
        //     light: '#81c784',
        //     main: '#4caf50',
        //     dark: '#388e3c',
        //     contrastText: 'rgba(0, 0, 0, 0.87)'
        // }
        // divider: 'rgba(0, 0, 0, 0.12)'
    },

    zIndex: {
        mobileStepper: mobileStepperZIndex,
        appBar: appBarZIndex,
        drawer: drawerZIndex,
        modal: modalZIndex,
        snackbar: snackbarZIndex,
        tooltip: tooltipZIndex
    },

    overrides: {
        MuiButton: {
            // root: {
            //     color: theme.palette.text.primary
            // },
            // textPrimary: {
            //     color: theme.palette.primary.main
            // },
            // textSecondary: {
            //     color: theme.palette.secondary.main
            // },
            sizeSmall: {
                fontSize: '0.95rem'
            }
        },
        MuiIcon: {
            // colorPrimary: {
            //     color: theme.palette.primary.main
            // },
            // colorSecondary: {
            //     color: theme.palette.secondary.main
            // },
            // colorAction: {
            //     color: theme.palette.action.active
            // }
        },
        MuiIconButton: {
            // root: {
            //     color: theme.palette.action.active
            // },
            // colorPrimary: {
            //     color: theme.palette.primary.main
            // },
            // colorSecondary: {
            //     color: theme.palette.secondary.main
            // }
        },
        MuiSvgIcon: {
            root: {
                fontSize: '1.4rem',
                ['@media (max-width:960px)']: {
                    width: 28,
                    height: 28,
                    fontSize: 28
                }
            },
            fontSizeLarge: {
                fontSize: '2.3rem'
            },
            fontSizeSmall: {
                fontSize: '1.2rem'
            },
            // colorPrimary: {
            //     color: theme.palette.primary.main
            // },
            // colorSecondary: {
            //     color: theme.palette.secondary.main
            // },
            colorAction: {
                color: '#036603'
            }
        }
    }
});

export default theme;
