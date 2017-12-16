'use strict';

import TagSidebar from '../tags/sidebar';

export default class SidebarLayout extends React.PureComponent {
    static propTypes = {
        params: PropTypes.object.isRequired,
        onOpened: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    state = {
        isPinned: true
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
                <div className={classNames('label', {'label-pin': this.state.isPinned})}>
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

                <TagSidebar params={this.props.params}/>
            </div>
        );
    }
}
