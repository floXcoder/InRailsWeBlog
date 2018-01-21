'use strict';

import {
    Field
} from 'redux-form/immutable';

import {
    getCurrentLocale
} from '../../../../selectors';

import SwitchButtonField from '../../../materialize/form/switchButton';
import SelectField from '../../../materialize/form/select';
import TextField from "../../../materialize/form/text";

const ArticleAdvancedField = ({currentMode, articleReference, articleVisibility, articleLanguage, articleAllowComment, defaultVisibility, multipleId}) => (
    <div className="row margin-top-10">
        {
            currentMode !== 'link' &&
            <div className="col s12 margin-bottom-30">
                <Field id="article_reference"
                       multipleId={multipleId}
                       name="reference"
                       icon="open_in_new"
                       placeholder={I18n.t(`js.article.common.placeholders.reference.${currentMode}`)}
                       component={TextField}
                       componentContent={articleReference}/>
            </div>
        }

        <div className="col s12 m6 l4">
            <Field id="article_language"
                   multipleId={multipleId}
                   name="language"
                   title={I18n.t('js.article.model.language')}
                   options={I18n.t('js.languages')}
                   component={SelectField}
                   componentContent={articleLanguage || getCurrentLocale()}/>
        </div>

        {
            currentMode === 'story' &&
            <div className="col s12 m6 l4 center-align">
                <Field id="article_allow_comment"
                       multipleId={multipleId}
                       name="allow_comment"
                       title={I18n.t('js.article.common.allow_comment.title')}
                       values={I18n.t('js.article.common.allow_comment')}
                       component={SwitchButtonField}
                       componentContent={articleAllowComment}/>
            </div>
        }

        <div className="col s12 m6 l4">
            <Field id="article_visibility"
                   multipleId={multipleId}
                   name="visibility"
                   title={I18n.t('js.article.model.visibility')}
                   default={I18n.t('js.article.common.visibility')}
                   options={I18n.t('js.article.enums.visibility')}
                   component={SelectField}
                   componentContent={articleVisibility || defaultVisibility}/>
        </div>
    </div>
);

ArticleAdvancedField.propTypes = {
    currentMode: PropTypes.string.isRequired,
    articleReference: PropTypes.bool,
    articleAllowComment: PropTypes.bool,
    articleLanguage: PropTypes.bool,
    articleVisibility: PropTypes.string,
    defaultVisibility: PropTypes.string,
    multipleId: PropTypes.number
};

ArticleAdvancedField.defaultProps = {
    articleAllowComment: true
};

export default ArticleAdvancedField;
