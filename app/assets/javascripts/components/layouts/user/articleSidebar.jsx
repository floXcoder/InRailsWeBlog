'use strict';

import Drawer from '@mui/material/Drawer';

import ArticleSidebar from '../../articles/sidebar';


const ArticleSidebarLayout = function ({parentTagSlug}) {
    return (
        <Drawer anchor="right"
                variant="permanent"
                classes={{
                    paper: 'search-sidebar-drawerPaper search-sidebar-drawerPaperBorderless search-sidebar-drawerPaperOverflow'
                }}
                open={true}>
            <ArticleSidebar parentTagSlug={parentTagSlug}/>
        </Drawer>
    );
};

ArticleSidebarLayout.propTypes = {
    parentTagSlug: PropTypes.string
};

export default React.memo(ArticleSidebarLayout);
