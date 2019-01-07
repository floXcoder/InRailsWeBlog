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

import styles from '../../../../../jss/article/form/common';

export default @withStyles(styles)

class ArticleAdvancedField extends React.PureComponent {
    static propTypes = {
        currentMode: PropTypes.string.isRequired,
        inheritVisibility: PropTypes.string,
        // from styles
        classes: PropTypes.object
    };

    render() {
        return (
            <div className="row">
                {
                    this.props.inheritVisibility !== 'only_me' &&
                    <div className="col s12 m6">
                        <Field name="visibility"
                               id="article_visibility"
                               className={this.props.classes.select}
                               label={I18n.t('js.article.model.visibility')}
                               options={I18n.t('js.article.enums.visibility')}
                               component={SelectFieldForm}/>
                    </div>
                }

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
                    <div className="col s12 center-align margin-top-30 margin-bottom-30">
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
                                   ),
                               }}
                               component={TextFieldForm}/>
                    </div>
                }

                {
                    // this.props.currentMode === 'story' &&
                    this.props.inheritVisibility !== 'only_me' &&
                    <div className="col s12 m6">
                        <Field name="allowComment"
                               id="article_allow_comment"
                               label={I18n.t('js.article.common.allow_comment.title')}
                               values={I18n.t('js.article.common.allow_comment')}
                               component={SwitchFormField}/>
                    </div>
                }

                <div className="col s12 center-align margin-top-10 margin-bottom-30">
                    <Field name="draft"
                           id="article_draft"
                           label={I18n.t('js.article.common.draft')}
                           component={CheckBoxFieldForm}/>
                </div>
            </div>
        );
    }
}
