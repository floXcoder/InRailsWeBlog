'use strict';

import {
    Field
} from 'redux-form/immutable';

import {
    withStyles
} from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';

import OpenInNewIcon from '@material-ui/icons/OpenInNew';

import SelectFieldForm from '../../../material-ui/form/select';
import TextFieldForm from '../../../material-ui/form/text';
import CheckBoxFieldForm from '../../../material-ui/form/checkbox';
import SwitchFormField from '../../../material-ui/form/switch';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';

import styles from '../../../../../jss/article/form/common';

export default @withStyles(styles)
class ArticleAdvancedField extends React.PureComponent {
    static propTypes = {
        currentMode: PropTypes.string.isRequired,
        inheritVisibility: PropTypes.string,
        // from styles
        classes: PropTypes.object
    };

    state = {
        isSourceExpanded: false
    };

    handleExpandClick = () => {
        this.setState((state) => ({
            isSourceExpanded: !state.isSourceExpanded
        }));
    };

    render() {
        return (
            <div className="margin-top-20 margin-bottom-20">
                {
                    this.props.inheritVisibility !== 'only_me' &&
                    <div className="row margin-bottom-50">
                        <div className="col s12 m6 center-align">
                            <Field name="visibility"
                                   id="article_visibility"
                                   className={this.props.classes.select}
                                   label={I18n.t('js.article.model.visibility')}
                                   options={I18n.t('js.article.enums.visibility')}
                                   component={SelectFieldForm}/>
                        </div>

                        <div className="col s12 m6 center-align">
                            <Field name="allowComment"
                                   id="article_allow_comment"
                                   label={I18n.t('js.article.common.allow_comment.title')}
                                   values={I18n.t('js.article.common.allow_comment')}
                                   component={SwitchFormField}/>
                        </div>
                    </div>
                }

                <div className="row margin-bottom-30">
                    <div className="col s12 m6 center-align">
                        <Field name="draft"
                               id="article_draft"
                               label={I18n.t('js.article.common.draft')}
                               component={CheckBoxFieldForm}/>
                    </div>

                    {/*<div className="col s12 m6">*/}
                    {/*<Field name="language"*/}
                    {/*id="article_language"*/}
                    {/*className={this.props.classes.select}*/}
                    {/*label={I18n.t('js.article.model.language')}*/}
                    {/*options={I18n.t('js.languages')}*/}
                    {/*component={SelectFieldForm}/>*/}
                    {/*</div>*/}

                    {
                        this.props.currentMode !== 'link' &&
                        <div className="col s12 m6 center-align">
                            <Typography variant="body2"
                                        gutterBottom={false}>
                                {I18n.t('js.article.common.external_source')}

                                <IconButton className={classNames(this.props.classes.expand, {
                                    [this.props.classes.expandOpen]: this.state.isSourceExpanded
                                })}
                                            onClick={this.handleExpandClick}
                                            aria-label="Show more">
                                    <ExpandMoreIcon/>
                                </IconButton>
                            </Typography>
                        </div>
                    }
                </div>

                <div className="row">
                    <div className="col s12 margin-top-20 margin-bottom-20 center-align">
                        <Collapse in={this.state.isSourceExpanded}
                                  timeout="auto"
                                  unmountOnExit={true}>
                            <Field name="reference"
                                   id="article_reference"
                                   className={this.props.classes.select}
                                   icon="open_in_new"
                                   label={I18n.t(`js.article.common.placeholders.reference.${this.props.currentMode}`)}
                                   InputProps={{
                                       startAdornment: (
                                           <InputAdornment position="start">
                                               <OpenInNewIcon/>
                                           </InputAdornment>
                                       )
                                   }}
                                   component={TextFieldForm}/>
                        </Collapse>
                    </div>
                </div>
            </div>
        );
    }
}
