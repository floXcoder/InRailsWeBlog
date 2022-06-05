'use strict';

import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import {
    logoutAdmin
} from '../../../actions/admin';

import AppBarLayout from './appBar';
import MenuLayout from './menu';


export default class AdminHeaderLayout extends React.Component {
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
        logoutAdmin()
            .then(() => window.location = '/');
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
                        onMouseLeave={this._handleDrawerOut}>
                    <div className="toolbar">
                        <IconButton onClick={this._handleDrawerClose} size="large">
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
