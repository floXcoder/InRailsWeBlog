'use strict';

import Drawer from '@material-ui/core/Drawer';

import ArticleSidebar from '../../articles/sidebar';


export default class ArticleSidebarLayout extends React.PureComponent {
    static propTypes = {
        parentTagSlug: PropTypes.string
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Drawer anchor="right"
                    variant="permanent"
                    classes={{
                        paper: 'search-sidebar-drawerPaper search-sidebar-drawerPaperBorderless search-sidebar-drawerPaperOverflow'
                    }}
                    open={true}>
                <ArticleSidebar parentTagSlug={this.props.parentTagSlug}/>
            </Drawer>
        );
    }
}
