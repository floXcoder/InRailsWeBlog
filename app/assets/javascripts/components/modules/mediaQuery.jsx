'use strict';

import {
    useTheme
} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';


function useWidth() {
    const theme = useTheme();
    const keys = [...theme.breakpoints.keys].reverse();
    return (
        keys.reduce((output, key) => {
            const matches = useMediaQuery(theme.breakpoints.up(key));
            return !output && matches ? key : output;
        }, null) || 'lg'
    );
}

export default function withWidth() {
    return function widthHelper(WrappedComponent) {
        return function (initialProps) {
            const width = useWidth();

            return (
                <WrappedComponent {...initialProps}
                                  width={width}/>
            );
        };
    };
}
