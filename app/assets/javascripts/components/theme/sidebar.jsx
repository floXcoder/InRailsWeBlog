'use strict';

export default class Sidebar extends React.PureComponent {
    static propTypes = {
        onOpened: PropTypes.func.isRequired,
        children: PropTypes.object.isRequired,
        isDefaultOpened: PropTypes.bool
    };

    static defaultProps = {
        isDefaultOpened: true
    };

    constructor(props) {
        super(props);
    }

    state = {
        isPinned: this.props.isDefaultOpened
    };

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
            <div className={classNames('sidebar', {'sidebar-pin': this.state.isPinned})}
                 onMouseEnter={this._handleMouseEnter}
                 onMouseLeave={this._handleMouseLeave}>
                <div className="sidebar-content">
                    <div className={classNames('label', {'label-pin': this.state.isPinned})}>
                    <span className="material-icons"
                          data-icon="menu"
                          aria-hidden="true"/>
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

                    {React.Children.only(this.props.children)}
                </div>
            </div>
        );
    }
}
