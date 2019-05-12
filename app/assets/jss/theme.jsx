'use strict';

import {
    createMuiTheme
} from '@material-ui/core/styles';

// Sizes
const headerHeight = 64;
const drawerWidth = 280;
const mainWidth = 1200;
const articleWidth = 740;
const articleAppendixWidth = 924;
const gridWidth = 1110;
const storiesWidth = 920;

// zIndex
const mainZIndex = 1;
const topicZIndex = 60;
const mobileStepperZIndex = 1000;
const appBarZIndex = 1100;
const drawerZIndex = 1200;
const modalZIndex = 1300;
const sortZIndex = 1400;
const snackbarZIndex = 1500;
const tooltipZIndex = 1600;
// const dropdownIndex = 1700;

// Headers font
const h1Size = '3rem';
const h1SizeMobile = '2.4rem';
const h1Weight = 600;
const h1LineHeight = '3rem';
const h1Spacing = 3.5;

const h1SizeExtract = '2rem';
const h1WeightExtract = 600;
const h1LineHeightExtract = '2rem';
const h1SpacingExtract = 2.6;

// A theme with custom primary and secondary color.
// It's optional.
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
        useNextVariants: true,
        htmlFontSize: 12
    },

    palette: {
        background: {
            default: '#fff',
            paper: '#fff'
        },
        text: {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.54)',
            disabled: 'rgba(0, 0, 0, 0.38)',
            hint: 'rgba(0, 0, 0, 0.38)'
        },
        primary: {
            light: '#5b6e85',
            main: '#334a67',
            dark: '#233348'
        },
        secondary: {
            light: '#ffc253',
            main: '#ffb328',
            dark: '#b27d1c'
        }
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
        MuiSvgIcon: {
            root: {
                ['@media (max-width:960px)']: {
                    width: 28,
                    height: 28,
                    fontSize: 28
                }
            }
        }
    }
});

export {
    //variables
    headerHeight,
    drawerWidth,
    mainWidth,
    articleWidth,
    gridWidth,
    articleAppendixWidth,
    storiesWidth,

    mainZIndex,
    topicZIndex,
    mobileStepperZIndex,
    appBarZIndex,
    drawerZIndex,
    modalZIndex,
    sortZIndex,
    snackbarZIndex,
    tooltipZIndex,

    h1Size,
    h1SizeMobile,
    h1Weight,
    h1LineHeight,
    h1Spacing,

    h1SizeExtract,
    h1WeightExtract,
    h1LineHeightExtract,
    h1SpacingExtract
}

export default theme;
