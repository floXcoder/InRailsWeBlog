'use strict';

import LazyLoad from 'react-lazyload';

export default class LazyLoader extends React.Component {
    static propTypes = {
        children: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
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
