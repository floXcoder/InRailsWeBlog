'use strict';

import {
    withStyles
} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import MenuIcon from '@material-ui/icons/Menu';

import AutocompleteSearch from './autocompleteSearch';

import styles from '../../../../jss/admin/layout';

export default @withStyles(styles)
class AppBarLayout extends React.PureComponent {
    static propTypes = {
        isDrawerOpen: PropTypes.bool.isRequired,
        onDrawerOpen: PropTypes.func.isRequired,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AppBar position="absolute"
                    className={classNames(this.props.classes.appBar, this.props.isDrawerOpen && this.props.classes.appBarShift)}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="Open drawer"
                        onClick={this.props.onDrawerOpen}
                        className={classNames(this.props.classes.menuButton, this.props.isDrawerOpen && this.props.classes.hide)}>
                        <MenuIcon/>
                    </IconButton>

                    <Typography className={this.props.classes.title}
                                variant="h6"
                                color="inherit"
                                noWrap={true}>
                        {I18n.t('js.admin.common.title')}
                    </Typography>

                    <div className={this.props.classes.grow}/>

                    <AutocompleteSearch/>

                    <div className={this.props.classes.grow}/>
                </Toolbar>
            </AppBar>
        );
    }
}
