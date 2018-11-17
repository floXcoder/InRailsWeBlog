'use strict';

import {
    withStyles
} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import EditIcon from '@material-ui/icons/Edit';
import LabelIcon from '@material-ui/icons/Label';
import SendIcon from '@material-ui/icons/Send';

import styles from '../../../../../jss/article/form/stepper';

export default @withStyles(styles)

class ArticleFormStepper extends React.Component {
    static propTypes = {
        tabIndex: PropTypes.number.isRequired,
        onTabChange: PropTypes.func.isRequired,
        // from styles
        classes: PropTypes.object
    };

    static defaultProps = {};

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.classes.root}>
                <AppBar className={this.props.classes.appBar}
                        position="static"
                        color="inherit">
                    <Tabs classes={{indicator: this.props.classes.tabsIndicator}}
                          value={this.props.tabIndex}
                          onChange={this.props.onTabChange}
                          indicatorColor="secondary"
                          textColor="primary"
                          fullWidth={true}>
                        <Tab classes={{
                            labelIcon: this.props.classes.tab
                        }}
                             disableRipple={true}
                             icon={<EditIcon/>}
                             label="Article"/>
                        <Tab classes={{
                            labelIcon: this.props.classes.tab
                        }}
                             disableRipple={true}
                             icon={<LabelIcon/>}
                             label="Labels"/>
                        <Tab classes={{
                            labelIcon: this.props.classes.tab
                        }}
                             disableRipple={true}
                             icon={<SendIcon/>}
                             label="Publier"/>
                    </Tabs>
                </AppBar>
            </div>
        );
    }
}
