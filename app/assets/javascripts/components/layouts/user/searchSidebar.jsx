'use strict';

import Drawer from '@material-ui/core/Drawer';

import SearchSidebar from '../../search/sidebar';


export default class SearchSidebarLayout extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
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
    }
}
