'use strict';

import UserTopic from '../../users/topic';

export default class HomeTopicHeader extends React.PureComponent {
    static propTypes = {
        router: PropTypes.object.isRequired,
        onTopicClick: PropTypes.func
    };

    static defaultProps = {
        onTopicClick: null
    };

    constructor(props) {
        super(props);
    }

    state = {
        isOpened: false
    };

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

    _handleOpenMenuClick = () => {
        this.setState({
            isOpened: !this.state.isOpened
        });
    };

    _handleTopicClick = () => {
        // this._closeOnDocumentClick();

        if (this.props.onTopicClick) {
            this.props.onTopicClick();
        }
    };

    render() {
        if ($app.isUserConnected()) {
            return (
                <div>
                    <div className="btn waves-effect waves-light header-button topic-header-button"
                         href="#"
                         onClick={this._handleOpenMenuClick}>
                        <div className="topic-header-text">
                            <i className="material-icons left">class</i>
                            {I18n.t('js.views.header.topic.button')}
                        </div>
                    </div>

                    {
                        this.state.isOpened &&
                        <UserTopic router={this.props.router}
                                   onTopicClick={this._handleTopicClick}/>
                    }
                </div>
            );
        } else {
            return null;
        }
    }
}
