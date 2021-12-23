'use strict';

import {
    createTheme
} from '@mui/material/styles';

// Sizes
export const headerHeight = 62;
export const articleWidth = 780;

// zIndex
export const mobileStepperZIndex = 1000;
export const appBarZIndex = 1100;
export const drawerZIndex = 1200;
export const modalZIndex = 1300;
export const snackbarZIndex = 1500;
export const tooltipZIndex = 1600;

// Variables also present in _variables.scss
const theme = createTheme({
    breakpoints: {
        keys: ['xs', 'sm', 'md', 'lg', 'xl'],
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536
        }
    },

    typography: {
        // Also declared in: _typography.scss
        htmlFontSize: 11,
        fontSize: 12,
        body1: {
            fontSize: '1.1rem'
        },
        body2: {
            fontSize: '1.1rem'
        }
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
            light: '#fde15b',
            main: '#e3c23e',
            dark: '#958327'
        },
        action: {
            active: 'rgba(0, 0, 0, 0.66)',
            // hover: 'rgba(0, 0, 0, 0.08)',
            // hoverOpacity: 0.08,
            // selected: 'rgba(0, 0, 0, 0.14)',
            // disabled: 'rgba(0, 0, 0, 0.26)',
            // disabledBackground: 'rgba(0, 0, 0, 0.12)'
        },
        grey: {
            50: '#fafafa',
            100: '#f5f5f5',
            200: '#eeeeee',
            300: '#e0e0e0',
            400: '#bdbdbd',
            500: '#9e9e9e',
            600: '#757575',
            700: '#616161',
            800: '#424242',
            900: '#212121',
            A100: '#d5d5d5',
            A200: '#aaaaaa',
            A400: '#303030',
            A700: '#616161'
        }
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

    components: {
        MuiButton: {
            styleOverrides: {
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
            variants: [
                {
                    props: {
                        variant: 'contained',
                        color: 'default'
                    },
                    style: {
                        color: 'rgba(0, 0, 0, 0.87)'
                    }
                },
                {
                    props: {
                        variant: 'outlined',
                        color: 'default'
                    },
                    style: {
                        color: 'rgba(0, 0, 0, 0.87)'
                    }
                },
                {
                    props: {
                        variant: 'text',
                        color: 'default'
                    },
                    style: {
                        color: 'rgba(0, 0, 0, 0.87)'
                    }
                },
            ]
        },
        MuiIcon: {
            styleOverrides: {
                // colorPrimary: {
                //     color: theme.palette.primary.main
                // },
                // colorSecondary: {
                //     color: theme.palette.secondary.main
                // },
                // colorAction: {
                //     color: theme.palette.action.active
                // }
            }
        },
        MuiIconButton: {
            styleOverrides: {
                // root: {
                //     color: theme.palette.action.active
                // },
                // colorPrimary: {
                //     color: theme.palette.primary.main
                // },
                // colorSecondary: {
                //     color: theme.palette.secondary.main
                // }
            }
        },
        MuiSvgIcon: {
            styleOverrides: {
                root: {
                    fontSize: '1.5rem',
                    '@media (max-width:960px)': {
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
                colorPrimary: {
                    color: '#036603',
                },
                colorSecondary: {
                    color: '#bda731'
                },
                colorAction: {
                    color: 'rgba(0, 0, 0, 0.54)'
                }
            }
        },
        // MuiInputBase: {
        //     styleOverrides: {
        //         root: {
        //             lineHeight: '1.33rem',
        //             fontSize: '1.1876em'
        //         }
        //     }
        // }
    }
});

export default theme;
