'use strict';

import {
    getDisplayName
} from './common';

export default function matchMedia(WrappedComponent) {
    return class MatchMediaComponent extends React.Component {
        static displayName = `MatchMediaComponent(${getDisplayName(WrappedComponent)})`;

        static propTypes = {
            mediaWatchSize: PropTypes.oneOf(['small', 'medium', 'large', 'extraLarge']),
            smallScreenSize: PropTypes.number,
            mediumScreenSize: PropTypes.number,
            largeScreenSize: PropTypes.number
        };

        static defaultProps = {
            smallScreenSize: window.settings.small_screen, // 600
            mediumScreenSize: window.settings.medium_screen, // 992
            largeScreenSize: window.settings.large_screen // 1200
        };

        constructor(props) {
            super(props);
        }

        state = {
            isSmallScreen: screen.width <= this.props.smallScreenSize,
            isMediumScreen: screen.width <= this.props.mediumScreenSize,
            isLargeScreen: screen.width <= this.props.mediumScreenSize,
            isExtraLargeScreen: screen.width > this.props.largeScreenSize,
        };

        componentWillMount() {
            if (this.props.mediaWatchSize && window.matchMedia) {
                let mql = null;

                if (this.props.mediaWatchSize === 'small') {
                    mql = window.matchMedia(`screen and (max-width: ${this.props.smallScreenSize}px)`);
                } else if (this.props.mediaWatchSize === 'medium') {
                    mql = window.matchMedia(`screen and (max-width: ${this.props.mediumScreenSize}px)`);
                } else if (this.props.mediaWatchSize === 'large') {
                    mql = window.matchMedia(`screen and (max-width: ${this.props.largeScreenSize}px)`);
                } else if (this.props.mediaWatchSize === 'extraLarge') {
                    mql = window.matchMedia(`screen and (min-width: ${this.props.largeScreenSize}px)`);
                }

                mql.addListener((mql) => {
                    if (mql.matches) {
                        this.setState({
                            [`is${this.props.mediaWatchSize.capitalize()}Screen`]: true
                        });
                    } else {
                        this.setState({
                            [`is${this.props.mediaWatchSize.capitalize()}Screen`]: false
                        });
                    }
                });
            }
        }

        render() {
            const propsProxy = {
                ...this.props,
                isSmallScreen: this.state.isSmallScreen,
                isMediumScreen: this.state.isMediumScreen,
                isLargeScreen: this.state.isLargeScreen,
                isExtraLargeScreen: this.state.isExtraLargeScreen
            };

            return <WrappedComponent {...propsProxy} />;
        }
    }
}
