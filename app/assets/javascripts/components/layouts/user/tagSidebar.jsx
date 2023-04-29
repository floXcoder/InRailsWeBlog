'use strict';

import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';

import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';

import {
    updateUserSettings
} from '../../../actions';

import {
    getSidebarState
} from '../../../selectors';

import TagSidebar from '../../tags/sidebar';


export default @connect((state, props) => ({
    isTagSidebarOpen: getSidebarState(state, props.isCloud),
    currentUserId: state.userState.currentId,
}), {
    updateUserSettings
})
class TagSidebarLayout extends React.PureComponent {
    static propTypes = {
        routeParams: PropTypes.object.isRequired,
        isCloud: PropTypes.bool,
        // from connect
        isTagSidebarOpen: PropTypes.bool,
        currentUserId: PropTypes.number,
        updateUserSettings: PropTypes.func
    };

    static defaultProps = {
        isCloud: false
    };

    constructor(props) {
        super(props);
    }

    state = {
        isExpanded: this.props.isTagSidebarOpen,
        wasOpen: this.props.isTagSidebarOpen
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.isTagSidebarOpen !== prevState.wasOpen) {
            return {
                ...prevState,
                isExpanded: nextProps.isTagSidebarOpen,
                wasOpen: nextProps.isTagSidebarOpen
            };
        }

        return null;
    }

    _handleExpandSwitch = () => {
        let currentUserTopicSlug = this.props.routeParams.topicSlug;
        // Extract topicSlug from article if any
        if (this.props.routeParams.articleSlug) {
            currentUserTopicSlug = this.props.routeParams.articleSlug.match(/@.*?$/)?.first()?.substr(1);
        }

        if (this.props.currentUserId && currentUserTopicSlug) {
            this.props.updateUserSettings(this.props.currentUserId, {
                tagSidebarPin: this.props.isTagSidebarOpen
            }, {
                topicSlug: currentUserTopicSlug
            });
        }
    };

    _handleDrawerOver = (event) => {
        if (this.props.isTagSidebarOpen) {
            return;
        }

        event.preventDefault();

        if (!this.state.isExpanded) {
            this.setState({
                isExpanded: true
            });
        }
    };

    _handleDrawerOut = (event) => {
        if (this.props.isTagSidebarOpen) {
            return;
        }

        event.preventDefault();

        if (this.state.isExpanded) {
            this.setState({
                isExpanded: false
            });
        }
    };

    render() {
        return (
            <Drawer anchor="left"
                    variant="permanent"
                    classes={{
                        paper: classNames('search-sidebar-drawer-paper', 'search-sidebar-drawer-paper-overflow', {
                            'search-sidebar-drawer-paper-close': !this.state.isExpanded
                        })
                    }}
                    open={this.state.isExpanded}
                    onMouseOver={this._handleDrawerOver}
                    onMouseLeave={this._handleDrawerOut}>
                <div>
                    <IconButton onClick={this._handleExpandSwitch}
                                size="large">
                        {
                            this.props.isTagSidebarOpen
                                ?
                                <LastPageIcon/>
                                :
                                <FirstPageIcon/>
                        }
                    </IconButton>
                </div>

                <TagSidebar currentTagSlug={this.props.routeParams.tagSlug}
                            currentChildTagSlug={this.props.routeParams.childTagSlug}
                            isCloud={this.props.isCloud}
                            isOpen={this.state.isExpanded}/>
            </Drawer>
        );
    }
}
