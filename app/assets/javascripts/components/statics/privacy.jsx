'use strict';

import '../../../stylesheets/pages/statics.scss';

import {
    hot
} from 'react-hot-loader/root';

export default @hot
class Privacy extends React.Component {
    static propTypes = {
        staticContent: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div dangerouslySetInnerHTML={{__html: this.props.staticContent}}/>
        );
    }
}
