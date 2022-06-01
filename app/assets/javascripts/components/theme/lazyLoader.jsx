'use strict';

import LazyLoad, {
    forceVisible
} from 'react-lazyload';


export default class LazyLoader extends React.Component {
    static propTypes = {
        children: PropTypes.object.isRequired,
        loadOnmount: PropTypes.bool
    };

    static defaultProps = {
        loadOnmount: false
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
            children,
            ...lazyProps
        } = this.props;

        if (Utils.supportScroll() && !this.props.loadOnmount) {
            return (
                <LazyLoad {...lazyProps}>
                    {children}
                </LazyLoad>
            );
        } else {
            return children;
        }
    }
}
