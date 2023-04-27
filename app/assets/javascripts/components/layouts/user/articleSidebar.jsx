'use strict';

import Drawer from '@mui/material/Drawer';

import ArticleSidebar from '../../articles/sidebar';


const ArticleSidebarLayout = function ({parentTagSlug, isArticle}) {
    return (
        <Drawer anchor="right"
                variant="permanent"
                classes={{
                    paper: 'search-sidebar-drawer-paper search-sidebar-drawer-paper-borderless search-sidebar-drawer-paper-overflow'
                }}
                open={true}>
            <ArticleSidebar parentTagSlug={parentTagSlug}
                            isArticle={isArticle}/>
        </Drawer>
    );
};

ArticleSidebarLayout.propTypes = {
    parentTagSlug: PropTypes.string,
    isArticle: PropTypes.bool
};

ArticleSidebarLayout.defaultProps = {
    isArticle: false
};

export default React.memo(ArticleSidebarLayout);
