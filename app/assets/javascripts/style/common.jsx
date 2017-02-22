import {
    cyan500, cyan700,
    pinkA200,
    grey100, grey300, grey400, grey500,
    white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';
import {convertColorToString, fade} from 'material-ui/utils/colorManipulator';

export default {
    fontFamily: 'Roboto, sans-serif',
    palette: {
        // Primary
        primary1Color: convertColorToString({type: 'rgba', values: [0, 0, 0, 0.87]}),
        primary2Color: '#37474f',

        // Secondary
        accent1Color: pinkA200,
        accent2Color: grey100,

        // Text color
        textColor: convertColorToString({type: 'rgba', values: [0, 0, 0, 0.87]}),
        alternateTextColor: white,
    },
};
