'use strict';

import Drawer from '@mui/material/Drawer';

import SearchSidebar from '../../search/sidebar';


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
