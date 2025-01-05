import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import {
    Field
} from 'react-final-form';

import InputAdornment from '@mui/material/InputAdornment';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import I18n from '@js/modules/translations';

import SelectFormField from '@js/components/material-ui/form/select';
import TextFormField from '@js/components/material-ui/form/text';
import CheckBoxFieldForm from '@js/components/material-ui/form/checkbox';
import SwitchFormField from '@js/components/material-ui/form/switch';


export default class ArticleAdvancedField extends React.PureComponent {
    static propTypes = {
        currentMode: PropTypes.string.isRequired,
        isEditing: PropTypes.bool.isRequired,
        change: PropTypes.func.isRequired,
        inheritVisibility: PropTypes.string,
        currentVisibility: PropTypes.string,
        currentDraft: PropTypes.bool
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

    _handleVisibilityChange = (event) => {
        if (event.target.value === 'everyone') {
            this.props.change('draft', false);
            this.props.change('visibility', 'everyone');
        } else {
            return this.props.change('visibility', event.target.value);
        }
    };

    _handleDraftChange = (event) => {
        if (event.target.checked) {
            this.props.change('visibility', 'only_me');
        } else {
            return event;
        }
    };

    render() {
        return (
            <div className="row margin-top-40 margin-bottom-50">
                {
                    this.props.inheritVisibility !== 'only_me' &&
                    <div className={classNames('col s12 center-align', {
                        m6: this.props.currentVisibility !== 'everyone'
                    })}>
                        <Field name="visibility"
                               component={SelectFormField}
                               id="article_visibility"
                               onChange={this._handleVisibilityChange}
                               className="article-form-select"
                               label={I18n.t('js.article.model.visibility')}
                               options={I18n.t('js.article.enums.visibility')}/>
                    </div>
                }

                {
                    this.props.currentVisibility !== 'everyone' &&
                    <div className={classNames('col s12 center-align', {
                        m6: this.props.inheritVisibility !== 'only_me'
                    })}>
                        <Field name="draft"
                               type="checkbox"
                               onChange={this._handleDraftChange}
                               component={CheckBoxFieldForm}
                               className="margin-top-15"
                               id="article_draft"
                               label={I18n.t('js.article.common.draft')}/>
                    </div>
                }

                {
                    !!(this.props.inheritVisibility !== 'only_me' || this.props.currentVisibility !== 'everyone' || this.props.isEditing) &&
                    <div className="col s12 center-align">
                        <Divider className="article-form-advanced-divider"/>
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

                        <Divider className="article-form-advanced-divider"/>
                    </div>
                }

                {/*<div className="col s12 m6">*/}
                {/*    <Field name="language"*/}
                {/*           id="article_language"*/}
                {/*           className={article-form-select}*/}
                {/*           label={I18n.t('js.article.model.language')}*/}
                {/*           options={I18n.t('js.languages')}*/}
                {/*           component={SelectFormField}/>*/}
                {/*</div>*/}

                {
                    this.props.currentMode !== 'link' &&
                    <div className="col s12 center-align">
                        <a className="article-form-external-reference-button"
                           href="#"
                           onClick={this._handleExpandClick}>
                            <Typography variant="body1"
                                        gutterBottom={false}>
                                {I18n.t('js.article.common.external_source')}

                                <IconButton
                                    className={classNames('article-form-external-reference-expand', {
                                        'article-form-external-reference-expand-open': this.state.isSourceExpanded
                                    })}
                                    aria-label="Show more"
                                    size="large">
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
                               className="article-form-select"
                               icon="open_in_new"
                               label={I18n.t(`js.article.common.placeholders.reference.${this.props.currentMode}`)}
                               slotProps={{
                                   input: {
                                       startAdornment: (
                                           <InputAdornment position="start">
                                               <OpenInNewIcon/>
                                           </InputAdornment>
                                       )
                                   }
                               }}/>
                    </Collapse>
                </div>
            </div>
        );
    }
}
