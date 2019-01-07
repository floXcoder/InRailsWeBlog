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
        params: PropTypes.object.isRequired,
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
                        paper: this.props.classes.drawerPaper
                    }}
                    open={true}>
                <ArticleSidebar params={this.props.params}/>
            </Drawer>
        );
    }
}
