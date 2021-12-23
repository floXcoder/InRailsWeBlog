'use strict';

import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import EditIcon from '@mui/icons-material/Edit';
import LabelIcon from '@mui/icons-material/Label';
import SendIcon from '@mui/icons-material/Send';


const ArticleFormStepper = function ({tabIndex, onTabChange}) {
    return (
        <div className="article-form-stepper-stepper"
            // id="article-edit-stepper"
        >
            <AppBar className="article-form-stepper-stepperAppBar"
                    position="static"
                    color="inherit">
                <Tabs classes={{
                    indicator: 'article-form-stepper-tabs-indicator'
                }}
                      value={tabIndex}
                      onChange={onTabChange}
                      indicatorColor="secondary"
                      textColor="primary"
                      variant="fullWidth">
                    <Tab classes={{
                        labelIcon: 'article-form-stepper-tab',
                        selected: 'article-form-stepper-selected'
                    }}
                         index={0}
                         disableRipple={true}
                         icon={<EditIcon/>}
                         iconPosition="start"
                         label={I18n.t('js.article.form.tabs.content')}/>

                    <Tab classes={{
                        root: 'article-form-stepper-middle-tab',
                        labelIcon: 'article-form-stepper-tab',
                        selected: 'article-form-stepper-selected'
                    }}
                         index={1}
                         disableRipple={true}
                         icon={<LabelIcon/>}
                         iconPosition="start"
                         label={I18n.t('js.article.form.tabs.tags')}/>

                    <Tab classes={{
                        labelIcon: 'article-form-stepper-tab',
                        selected: 'article-form-stepper-selected'
                    }}
                         index={2}
                         disableRipple={true}
                         icon={<SendIcon/>}
                         iconPosition="start"
                         label={I18n.t('js.article.form.tabs.publish')}/>
                </Tabs>
            </AppBar>
        </div>
    );
};

ArticleFormStepper.propTypes = {
    tabIndex: PropTypes.number.isRequired,
    onTabChange: PropTypes.func.isRequired
};

export default React.memo(ArticleFormStepper);
