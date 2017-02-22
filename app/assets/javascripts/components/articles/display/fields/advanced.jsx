'use strict';

const Select = require('../../../materialize/select');
const Switch = require('../../../materialize/switch');
const Checkbox = require('../../../materialize/checkbox');
const CategorizedTag = require('../../../materialize/categorized-tag');

var ArticleAdvancedField = ({article, tags, isTemporary, isLink, multipleId}) => (
    <div className="row margin-top-10">
        <div className="col s12 m6 l6">
            <CategorizedTag id="article_parent_tags"
                            title={I18n.t('js.article.model.parent_tags')}
                            placeholder={I18n.t('js.article.common.tags.parent')}
                            isSortingCategoriesByAlpha={false}
                            isHorizontal={true}
                            categorizedTags={ArticleAdvancedField._categorizedTags(tags)}
                            transformInitialTags={(tag) => { return {category: tag.visibility, value: tag.name}}}>
                {article.parent_tags}
            </CategorizedTag>

            <CategorizedTag id="article_child_tags"
                            title={I18n.t('js.article.model.child_tags')}
                            placeholder={I18n.t('js.article.common.tags.child')}
                            isHorizontal={true}
                            categorizedTags={ArticleAdvancedField._categorizedTags(tags)}
                            transformInitialTags={(tag) => { return {category: tag.visibility, value: tag.name}}}>
                {article.child_tags}
            </CategorizedTag>
        </div>

        <div className="col s12 m6 l3">
            <Checkbox id="article_temporary"
                      multipleId={multipleId}
                      title={I18n.t('js.article.common.temporary')}>
                {isTemporary}
            </Checkbox>

            <div className="margin-bottom-20"/>

            <Checkbox id="article_is_link"
                      multipleId={multipleId}
                      title={I18n.t('js.article.common.link')}>
                {isLink}
            </Checkbox>
        </div>

        <div className="col s12 m6 l3">
            <Switch id="article_allow_comment"
                    multipleId={multipleId}
                    title={I18n.t('js.article.common.allow_comment.title')}
                    values={I18n.t('js.article.common.allow_comment')}>
                {article.allow_comment}
            </Switch>

            <div className="margin-bottom-40"/>

            <Select id="article_visibility"
                    multipleId={multipleId}
                    title={I18n.t('js.article.model.visibility')}
                    default={I18n.t('js.article.common.visibility')}
                    options={I18n.t('js.article.enums.visibility')}>
                {article.visibility}
            </Select>
        </div>
    </div>
);

ArticleAdvancedField._categorizedTags = (tags) => {
    let categorizedTags = [];

    if (tags) {
        let tagsByVisibility = {};
        tags.forEach((tag) => {
            if (!tagsByVisibility[tag.visibility]) {
                tagsByVisibility[tag.visibility] = [tag.name];
            } else {
                tagsByVisibility[tag.visibility].push(tag.name);
            }
        });

        if (!tagsByVisibility.everyone) {
            tagsByVisibility.everyone = [];
        }
        if (!tagsByVisibility.only_me) {
            tagsByVisibility.only_me = [];
        }

        categorizedTags = Object.keys(tagsByVisibility).map((visibility) => {
            return {
                id: visibility,
                type: ' ',
                title: I18n.t('js.tag.enums.visibility.' + visibility),
                items: tagsByVisibility[visibility]
            }
        });
    }

    return categorizedTags;
};

ArticleAdvancedField.propTypes = {
    article: React.PropTypes.object,
    tags: React.PropTypes.array,
    isTemporary: React.PropTypes.bool,
    isLink: React.PropTypes.bool,
    multipleId: React.PropTypes.number
};

ArticleAdvancedField.defaultProps = {
    article: {},
    tags: [],
    isTemporary: false,
    isLink: false,
    multipleId: null
};

module.exports = ArticleAdvancedField;
