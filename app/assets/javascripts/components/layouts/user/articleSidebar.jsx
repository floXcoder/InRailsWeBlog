'use strict';

import {
    withStyles
} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

import ArticleSidebar from '../../articles/sidebar';

import styles from '../../../../jss/user/sidebar';

export default @withStyles(styles)

class ArticleSidebarLayout extends React.PureComponent {
    static propTypes = {
        parentTag: PropTypes.string,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Drawer anchor="right"
                    variant="permanent"
                    classes={{
                        paper: classNames(this.props.classes.drawerPaper, this.props.classes.drawerPaperBorderless)
                    }}
                    open={true}>
                <ArticleSidebar parentTag={this.props.parentTag}/>
            </Drawer>
        );
    }
}
