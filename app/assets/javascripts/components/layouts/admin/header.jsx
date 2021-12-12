'use strict';

import {
    hot
} from 'react-hot-loader/root';

import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import {
    logoutAdmin
} from '../../../actions/admin';

import AppBarLayout from './appBar';
import MenuLayout from './menu';


export default @hot
class AdminHeaderLayout extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        isDrawerOpen: false
    };

    _handleDrawerOpen = () => {
        this.setState({isDrawerOpen: true});
    };

    _handleDrawerClose = () => {
        this.setState({isDrawerOpen: false});
    };

    _handleDrawerOver = () => {
        if (!this.state.isDrawerOpen) {
            this.setState({isDrawerOpen: true});
        }
    };

    _handleDrawerOut = () => {
        if (this.state.isDrawerOpen) {
            this.setState({isDrawerOpen: false});
        }
    };

    _handleLogoutClick = () => {
        logoutAdmin().then(() => window.location = '/');
    };

    render() {
        return (
            <>
                <AppBarLayout isDrawerOpen={this.state.isDrawerOpen}
                              onDrawerOpen={this._handleDrawerOpen}/>

                <Drawer variant="permanent"
                        classes={{
                            paper: classNames('drawer-paper', {
                                'drawer-paper-close': !this.state.isDrawerOpen
                            })
                        }}
                        open={this.state.isDrawerOpen}
                        onMouseOver={this._handleDrawerOver}
                        onMouseOut={this._handleDrawerOut}>
                    <div className="toolbar">
                        <IconButton onClick={this._handleDrawerClose}>
                            <ChevronLeftIcon/>
                        </IconButton>
                    </div>

                    <Divider/>

                    <MenuLayout onLogout={this._handleLogoutClick}/>
                </Drawer>
            </>
        );
    }
}
