'use strict';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import EditIcon from '@material-ui/icons/Edit';
import LabelIcon from '@material-ui/icons/Label';
import SendIcon from '@material-ui/icons/Send';


export default class ArticleFormStepper extends React.Component {
    static propTypes = {
        tabIndex: PropTypes.number.isRequired,
        onTabChange: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="article-edit-stepper"
                 className="article-form-stepper-stepper">
                <AppBar className="article-form-stepper-stepperAppBar"
                        position="static"
                        color="inherit">
                    <Tabs classes={{indicator: 'article-form-stepper-tabsIndicator'}}
                          value={this.props.tabIndex}
                          onChange={this.props.onTabChange}
                          indicatorColor="secondary"
                          textColor="primary"
                          variant="fullWidth">
                        <Tab classes={{
                            labelIcon: 'article-form-stepper-tab'
                        }}
                             disableRipple={true}
                             icon={<EditIcon/>}
                             label={I18n.t('js.article.form.tabs.content')}/>
                        <Tab classes={{
                            root: 'article-form-stepper-middleTab',
                            labelIcon: 'article-form-stepper-tab'
                        }}
                             disableRipple={true}
                             icon={<LabelIcon/>}
                             label={I18n.t('js.article.form.tabs.tags')}/>
                        <Tab classes={{
                            labelIcon: 'article-form-stepper-tab'
                        }}
                             disableRipple={true}
                             icon={<SendIcon/>}
                             label={I18n.t('js.article.form.tabs.publish')}/>
                    </Tabs>
                </AppBar>
            </div>
        );
    }
}
