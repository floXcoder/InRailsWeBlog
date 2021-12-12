'use strict';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import MenuIcon from '@material-ui/icons/Menu';

import AutocompleteSearch from './autocompleteSearch';


export default class AppBarLayout extends React.PureComponent {
    static propTypes = {
        isDrawerOpen: PropTypes.bool.isRequired,
        onDrawerOpen: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AppBar position="absolute"
                    className={classNames('appbar', {
                        'appbar-shift': this.props.isDrawerOpen
                    })}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="Open drawer"
                        onClick={this.props.onDrawerOpen}
                        className={classNames('menu-button', {
                            hide: this.props.isDrawerOpen
                        })}
                        size="large">
                        <MenuIcon/>
                    </IconButton>

                    <Typography className="admin-title"
                                variant="h6"
                                color="inherit"
                                noWrap={true}>
                        {I18n.t('js.admin.common.title')}
                    </Typography>

                    <div className="grow"/>

                    <AutocompleteSearch/>

                    <div className="grow"/>
                </Toolbar>
            </AppBar>
        );
    }
}
