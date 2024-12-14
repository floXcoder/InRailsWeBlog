import React from 'react';

import Drawer from '@mui/material/Drawer';

import SearchSidebar from '@js/components/search/sidebar';


const SearchSidebarLayout = function () {
    return (
        <Drawer anchor="left"
                variant="permanent"
                classes={{
                    paper: 'search-sidebar-drawer-paper search-sidebar-drawer-paper-borderless'
                }}
                open={true}>
            <SearchSidebar/>
        </Drawer>
    );
};

export default React.memo(SearchSidebarLayout);
