'use strict';

import {
    Field
} from 'redux-form/immutable';

import {
    getCurrentLocale
} from '../../../../selectors';

import SwitchButtonField from '../../../materialize/form/switchButton';
import SelectField from '../../../materialize/form/select';

const ArticleAdvancedField = ({currentMode, articleVisibility, articleLanguage, articleAllowComment, defaultVisibility, multipleId}) => (
    <div className="row margin-top-10">
        <div className="col s12 m6 l4">
            <Field id="article_language"
                   name="language"
                   multipleId={multipleId}
                   title={I18n.t('js.article.model.language')}
                   options={I18n.t('js.languages')}
                   component={SelectField}
                   componentContent={articleLanguage || getCurrentLocale()}/>
        </div>

        <div className="col s12 m6 l4 center-align">
            <Field id="article_allow_comment"
                   name="allow_comment"
                   multipleId={multipleId}
                   title={I18n.t('js.article.common.allow_comment.title')}
                   values={I18n.t('js.article.common.allow_comment')}
                   component={SwitchButtonField}
                   componentContent={articleAllowComment}/>
        </div>

        <div className="col s12 m6 l4">
            <Field id="article_visibility"
                   name="visibility"
                   multipleId={multipleId}
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
