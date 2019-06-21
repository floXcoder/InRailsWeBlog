'use strict';

export default class Portal extends React.Component {
    static propTypes = {
        children: PropTypes.element.isRequired,
        domNode: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        return ReactDOM.createPortal(
            this.props.children,
            document.getElementById(this.props.domNode)
        );
    }
}
