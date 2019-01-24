'use strict';

import {
    withStyles
} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';

import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';

import {
    updateUserSettings
} from '../../../actions';

import {
    getSidebarState
} from '../../../selectors';

import TagSidebar from '../../tags/sidebar';

import styles from '../../../../jss/user/sidebar';

export default @connect((state, props) => ({
    isTagSidebarOpen: getSidebarState(state, props.isCloud),
    currentUserId: state.userState.currentId,
}), {
    updateUserSettings
})

@withStyles(styles)
class TagSidebarLayout extends React.PureComponent {
    static propTypes = {
        params: PropTypes.object.isRequired,
        isCloud: PropTypes.bool,
        // from connect
        isTagSidebarOpen: PropTypes.bool,
        currentUserId: PropTypes.number,
        updateUserSettings: PropTypes.func,
        // from styles
        classes: PropTypes.object
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
        let currentUserTopicSlug = this.props.params.topicSlug;
        // Extract topicSlug from article if any
        if (this.props.params.articleSlug) {
            currentUserTopicSlug = this.props.params.articleSlug.match(/@.*?$/).first().substr(1);
        }

        if (this.props.currentUserId) {
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
                        paper: classNames(this.props.classes.drawerPaper, !this.state.isExpanded && this.props.classes.drawerPaperClose),
                    }}
                    open={this.state.isExpanded}
                    onMouseOver={this._handleDrawerOver}
                    onMouseLeave={this._handleDrawerOut}>
                <div className={this.props.classes.expandButton}>
                    <IconButton onClick={this._handleExpandSwitch}>
                        {
                            this.props.isTagSidebarOpen
                                ?
                                <LastPageIcon/>
                                :
                                <FirstPageIcon/>
                        }
                    </IconButton>
                </div>

                <TagSidebar currentTagSlug={this.props.params.tagSlug}
                            isOpen={this.state.isExpanded}
                            isCloud={this.props.isCloud}/>
            </Drawer>
        );
    }
}
