'use strict';

import LazyLoad, {forceVisible} from 'react-lazyload';

export default class LazyLoader extends React.Component {
    static propTypes = {
        children: PropTypes.object.isRequired
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
        const {children, ...lazyProps} = this.props;

        if (Utils.supportScroll()) {
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
