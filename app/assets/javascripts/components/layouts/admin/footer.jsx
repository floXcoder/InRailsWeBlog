'use strict';

import {
    withStyles
} from '@material-ui/core/styles';

import styles from '../../../../jss/admin/layout';

export default @withStyles(styles)
class AdminFooterLayout extends React.PureComponent {
    static propTypes = {
        // from styles
        classes: PropTypes.object
    };

    render() {
        return (
            <footer className={this.props.classes.footer}>
                {/* Empty for now */}
            </footer>
        );
    }
}
