import React from 'react';
import PropTypes from 'prop-types';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import MenuIcon from '@mui/icons-material/Menu';

import classNames from 'classnames';

import I18n from '@js/modules/translations';

import AutocompleteSearch from '@js/components/layouts/admin/autocompleteSearch';


const AppBarLayout = function ({
                                   isDrawerOpen,
                                   onDrawerOpen
                               }) {
    return (
        <AppBar position="absolute"
                className={classNames('appbar', {
                    'appbar-shift': isDrawerOpen
                })}>
            <Toolbar>
                <IconButton color="inherit"
                            aria-label="Open drawer"
                            onClick={onDrawerOpen}
                            className={classNames('menu-button', {
                                hide: isDrawerOpen
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
};

AppBarLayout.propTypes = {
    isDrawerOpen: PropTypes.bool.isRequired,
    onDrawerOpen: PropTypes.func.isRequired
};

export default React.memo(AppBarLayout);
