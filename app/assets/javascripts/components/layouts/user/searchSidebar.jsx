'use strict';

import Drawer from '@mui/material/Drawer';

import SearchSidebar from '../../search/sidebar';


const SearchSidebarLayout = function () {
    return (
        <Drawer anchor="left"
                variant="permanent"
                classes={{
                    paper: 'search-sidebar-drawerPaper search-sidebar-drawerPaperBorderless'
                }}
                open={true}>
            <SearchSidebar/>
        </Drawer>
    );
};

export default React.memo(SearchSidebarLayout);
