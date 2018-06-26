'use strict';

import {
    CSSTransition
} from 'react-transition-group';

export default class Dialog extends React.Component {
    static propTypes = {
        isOpened: PropTypes.bool.isRequired,
        children: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    state = {
        isOpened: false
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.isOpen !== nextProps.isOpen) {
            return {
                ...prevState,
                isOpen: nextProps.isOpen
            };
        }

        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.isOpened && this.state.isOpened) {
            document.addEventListener('click', this._closeOnDocumentClick);
        } else if (prevState.isOpened && !this.state.isOpened) {
            document.removeEventListener('click', this._closeOnDocumentClick);
        }
    }

    componentWillUnmount() {
        document.removeEventListener('click', this._closeOnDocumentClick);
    }

    _closeOnDocumentClick = (event) => {
        const domNode = ReactDOM.findDOMNode(this);

        if (event && domNode.contains(event.target)) {
            // If event happened in the dropdown, ignore it
            return;
        }

        this.setState({
            isOpened: false
        });
    };

    render() {
        const FadeTransition = ({children, ...props}) => (
            <CSSTransition {...props}
                           timeout={500}
                           classNames="dialog">
                {children}
            </CSSTransition>
        );

        return (
            <FadeTransition in={this.state.isOpened}
                            mountOnEnter={true}
                            unmountOnExit={true}>
                {React.Children.only(this.props.children)}
            </FadeTransition>
        );
    }
}
