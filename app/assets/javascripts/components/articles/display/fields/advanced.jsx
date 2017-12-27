'use strict';

import {
    Field
} from 'redux-form/immutable';

import CategorizedField from '../../../materialize/form/categorized';
import CheckBoxField from '../../../materialize/form/checkbox';
import SwitchButtonField from '../../../materialize/form/switchButton';
import SelectField from '../../../materialize/form/select';

const ArticleAdvancedField = ({article, tags, isDraft, isLink, multipleId}) => (
    <div className="row margin-top-10">
        <div className="col s12 m6 l6">
            <Field id="article_parent_tags"
                   name="parent_tags"
                   title={I18n.t('js.article.model.parent_tags')}
                   placeholder={I18n.t('js.article.common.tags.parent')}
                   isSortingCategoriesByAlpha={false}
                   isHorizontal={true}
                   categorizedTags={tags}
                   transformInitialTags={(tag) => ({category: tag.visibility, value: tag.name})}
                   component={CategorizedField}
                   componentContent={article.parent_tags}/>

            <Field id="article_child_tags"
                   name="child_tags"
                   title={I18n.t('js.article.model.child_tags')}
                   placeholder={I18n.t('js.article.common.tags.child')}
                   isSortingCategoriesByAlpha={false}
                   isHorizontal={true}
                   categorizedTags={tags}
                   transformInitialTags={(tag) => ({category: tag.visibility, value: tag.name})}
                   component={CategorizedField}
                   componentContent={article.child_tags}/>
        </div>

        <div className="col s12 m6 l3">
            <Field id="article_draft"
                   name="draft"
                   title={I18n.t('js.article.common.draft')}
                   multipleId={multipleId}
                   component={CheckBoxField}
                   componentContent={isDraft}/>
        </div>

        <div className="col s12 m6 l3">
            <Field id="article_allow_comment"
                   name="allow_comment"
                   multipleId={multipleId}
                   title={I18n.t('js.article.common.allow_comment.title')}
                   values={I18n.t('js.article.common.allow_comment')}
                   component={SwitchButtonField}
                   componentContent={article.allow_comment}/>

            <div className="margin-bottom-40"/>

            <Field id="article_visibility"
                   name="visibility"
                   multipleId={multipleId}
                   title={I18n.t('js.article.model.visibility')}
                   default={I18n.t('js.article.common.visibility')}
                   options={I18n.t('js.article.enums.visibility')}
                   component={SelectField}
                   componentContent={article.visibility}/>
        </div>
    </div>
);

ArticleAdvancedField.propTypes = {
    article: PropTypes.object,
    tags: PropTypes.array,
    isDraft: PropTypes.bool,
    isLink: PropTypes.bool,
    multipleId: PropTypes.number
};

ArticleAdvancedField.defaultProps = {
    article: {},
    tags: [],
    isDraft: false,
    isLink: false
};

export default ArticleAdvancedField;
