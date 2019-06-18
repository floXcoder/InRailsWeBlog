'use strict';

import {
    withStyles
} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

import SearchSidebar from '../../search/sidebar';

import styles from '../../../../jss/user/sidebar';

export default @withStyles(styles)
class SearchSidebarLayout extends React.PureComponent {
    static propTypes = {
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Drawer anchor="left"
                    variant="permanent"
                    classes={{
                        paper: classNames(this.props.classes.drawerPaper, this.props.classes.drawerPaperBorderless)
                    }}
                    open={true}>
                <SearchSidebar/>
            </Drawer>
        );
    }
}
