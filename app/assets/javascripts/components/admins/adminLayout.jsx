'use strict';

import {
    hot
} from 'react-hot-loader/root';

import {
    withStyles
} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import {
    logoutAdmin
} from '../../actions/admin';

import AppBarLayout from './layout/appBar';
import MenuLayout from './layout/menu';

import styles from '../../../jss/admin/layout';

export default @hot
@withStyles(styles)
class AdminLayout extends React.Component {
    static propTypes = {
        children: PropTypes.object.isRequired,
        // from styles
        classes: PropTypes.object
    };

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
            <div className={this.props.classes.root}>
                <header>
                    <AppBarLayout isDrawerOpen={this.state.isDrawerOpen}
                                  onDrawerOpen={this._handleDrawerOpen}/>

                    <Drawer variant="permanent"
                            classes={{
                                paper: classNames(this.props.classes.drawerPaper, !this.state.isDrawerOpen && this.props.classes.drawerPaperClose)
                            }}
                            open={this.state.isDrawerOpen}
                            onMouseOver={this._handleDrawerOver}
                            onMouseOut={this._handleDrawerOut}>
                        <div className={this.props.classes.toolbar}>
                            <IconButton onClick={this._handleDrawerClose}>
                                <ChevronLeftIcon/>
                            </IconButton>
                        </div>

                        <Divider/>

                        <MenuLayout onLogout={this._handleLogoutClick}/>
                    </Drawer>
                </header>

                <main className={this.props.classes.content}>
                    <div className={this.props.classes.toolbar}/>
                    {this.props.children}
                </main>
            </div>
        );
    }
}
