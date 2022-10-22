'use strict';

import {
    Suspense
} from 'react';

import LazyLoad, {
    forceVisible
} from 'react-lazyload';


export default class LoadOnScroll extends React.Component {
    static propTypes = {
        children: PropTypes.object.isRequired,
        loadOnMount: PropTypes.bool,
        dynamicImport: PropTypes.bool,
        // Props for Lazyload
        // In the first round of render, LazyLoad will render a placeholder for your component if no placeholder is provided and measure if this component is visible.
        height: PropTypes.number,
        // Once the lazy loaded component is loaded, do not detect scroll/resize event anymore.
        once: PropTypes.bool,
        // offset to load component, positive or negative number
        offset: PropTypes.number,
        // Listen and react to scroll event.
        scroll: PropTypes.bool,
        // Respond to resize event
        resize: PropTypes.bool,
        // If lazy loading components inside a overflow container, set this to true
        overflow: PropTypes.bool,
        //The lazy loaded component is unmounted and replaced by the placeholder when it is no longer visible in the viewport.
        unmountIfInvisible: PropTypes.bool,
        // Specify a placeholder for your lazy loaded component.
        placeholder: PropTypes.any
    };

    static defaultProps = {
        loadOnMount: window.seoMode,
        dynamicImport: false,
        // Props for Lazyload
        height: 260,
        once: true,
        offset: 200,
        scroll: true,
        resize: false,
        overflow: false,
        unmountIfInvisible: false,
        placeholder: undefined
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (window.seoMode) {
            forceVisible();
        }
    }

    render() {
        const {
            loadOnMount,
            children,
            ...lazyProps
        } = this.props;

        if (Utils.supportScroll() && !loadOnMount) {
            if (this.props.dynamicImport) {
                return (
                    <LazyLoad {...lazyProps}>
                        <Suspense fallback={<div/>}>
                            {children}
                        </Suspense>
                    </LazyLoad>
                );
            } else {
                return (
                    <LazyLoad {...lazyProps}>
                        {children}
                    </LazyLoad>
                );
            }
        } else if (this.props.dynamicImport) {
            return (
                <Suspense fallback={<div/>}>
                    {children}
                </Suspense>
            );
        } else {
            return children;
        }
    }
}
