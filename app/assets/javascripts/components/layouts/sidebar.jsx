'use strict';

import TagSidebar from '../tags/sidebar';

export default class SidebarLayout extends React.PureComponent {
    static propTypes = {
        router: PropTypes.object.isRequired,
        onOpened: PropTypes.func
    };

    static defaultProps = {
        onOpened: null
    };

    constructor(props) {
        super(props);
    }

    state = {
        isPinned: true
    };

    componentDidMount() {
    }

    _toggleSidebar = () => {
        this.setState({
            isPinned: !this.state.isPinned
        });

        if (this.props.onOpened) {
            this.props.onOpened(!this.state.isPinned);
        }
    };

    _handleMouseEnter = () => {
        if (!this.state.isPinned && this.props.onOpened) {
            this.props.onOpened(true);
        }
    };

    _handleMouseLeave = () => {
        if (!this.state.isPinned && this.props.onOpened) {
            this.props.onOpened(false);
        }
    };

    render() {
        return (
            <div className={classNames('sidebar', {'sidebarpin': this.state.isPinned})}
                 onMouseEnter={this._handleMouseEnter}
                 onMouseLeave={this._handleMouseLeave}>
                <div className={classNames('label', {'labelpin': this.state.isPinned})}>
                    <i className="material-icons">menu</i>
                </div>

                <p className="sidebar-pin-button"
                   onClick={this._toggleSidebar}>
                    <strong>
                        {
                            this.state.isPinned
                            ?
                                I18n.t('js.views.sidebar.pin')
                            :
                                I18n.t('js.views.sidebar.unpin')
                        }
                    </strong>
                </p>

                <br/>

                <TagSidebar router={this.props.router}/>
            </div>
        );
    }
}
