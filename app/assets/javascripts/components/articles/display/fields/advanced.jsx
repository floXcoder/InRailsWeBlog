'use strict';

import {
    Field
} from 'react-final-form';

import {
    withStyles
} from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import SelectFormField from '../../../material-ui/form/select';
import TextFormField from '../../../material-ui/form/text';
import CheckBoxFieldForm from '../../../material-ui/form/checkbox';
import SwitchFormField from '../../../material-ui/form/switch';

import styles from '../../../../../jss/article/form/shared';

export default @withStyles(styles)
class ArticleAdvancedField extends React.PureComponent {
    static propTypes = {
        currentMode: PropTypes.string.isRequired,
        isEditing: PropTypes.bool.isRequired,
        change: PropTypes.func.isRequired,
        inheritVisibility: PropTypes.string,
        currentVisibility: PropTypes.string,
        currentDraft: PropTypes.bool,
        // from styles
        classes: PropTypes.object
    };

    state = {
        isSourceExpanded: false
    };

    _handleExpandClick = (event) => {
        event.preventDefault();

        this.setState((state) => ({
            isSourceExpanded: !state.isSourceExpanded
        }));
    };

    _handleDraftChange = (event) => {
        if (event.target.checked) {
            this.props.change('visibility', 'only_me');
        }
    };

    render() {
        return (
            <div className="row margin-top-20 margin-bottom-50">
                {
                    this.props.inheritVisibility !== 'only_me' &&
                    <div className="col s12 m6 center-align">
                        <Field name="visibility"
                               component={SelectFormField}
                               id="article_visibility"
                               className={this.props.classes.select}
                               label={I18n.t('js.article.model.visibility')}
                               options={I18n.t('js.article.enums.visibility')}/>
                    </div>
                }

                {
                    !this.props.isEditing &&
                    <div className="col s12 m6 center-align">
                        <Field name="draft"
                               type="checkbox"
                               onChange={this._handleDraftChange}
                               component={CheckBoxFieldForm}
                               id="article_draft"
                               label={I18n.t('js.article.common.draft')}/>
                    </div>
                }

                {
                    (this.props.inheritVisibility !== 'only_me' || !this.props.isEditing) &&
                    <div className="col s12 center-align">
                        <Divider className={this.props.classes.advancedDivider}/>
                    </div>
                }

                {
                    (this.props.inheritVisibility !== 'only_me' && this.props.currentVisibility !== 'only_me' && this.props.currentDraft !== true) &&
                    <div className="col s12 center-align">
                        <Field name="allowComment"
                               component={SwitchFormField}
                               id="article_allow_comment"
                               label={I18n.t('js.article.common.allow_comment.title')}
                               values={I18n.t('js.article.common.allow_comment')}/>

                        <Divider className={this.props.classes.advancedDivider}/>
                    </div>
                }

                {/*<div className="col s12 m6">*/}
                {/*    <Field name="language"*/}
                {/*           id="article_language"*/}
                {/*           className={this.props.classes.select}*/}
                {/*           label={I18n.t('js.article.model.language')}*/}
                {/*           options={I18n.t('js.languages')}*/}
                {/*           component={SelectFormField}/>*/}
                {/*</div>*/}

                {
                    this.props.currentMode !== 'link' &&
                    <div className="col s12 center-align">
                        <a className={this.props.classes.externalReferenceButton}
                           href="#"
                           onClick={this._handleExpandClick}>
                            <Typography variant="body1"
                                        gutterBottom={false}>
                                {I18n.t('js.article.common.external_source')}

                                <IconButton className={classNames(this.props.classes.externalReferenceExpand, {
                                    [this.props.classes.externalReferenceExpandOpen]: this.state.isSourceExpanded
                                })}
                                            aria-label="Show more">
                                    <ExpandMoreIcon/>
                                </IconButton>
                            </Typography>
                        </a>
                    </div>
                }

                <div className="col s12 center-align">
                    <Collapse in={this.state.isSourceExpanded}
                              timeout="auto"
                              unmountOnExit={true}>
                        <Field name="reference"
                               component={TextFormField}
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
                               }}/>
                    </Collapse>
                </div>
            </div>
        );
    }
}
