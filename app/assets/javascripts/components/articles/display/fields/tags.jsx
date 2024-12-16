import React from 'react';
import PropTypes from 'prop-types';

import {
    Field
} from 'react-final-form';

import I18n from '@js/modules/translations';

import CategorizedField from '@js/components/materialize/form/categorized';


export default class ArticleTagsField extends React.Component {
    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
        availableParentTags: PropTypes.array,
        availableChildTags: PropTypes.array,
        parentTags: PropTypes.array,
        childTags: PropTypes.array
    };

    static defaultProps = {
        parentTags: [],
        childTags: [],
        availableParentTags: [],
        availableChildTags: []
    };

    constructor(props) {
        super(props);
    }

    state = {
        hasChildTagFocus: false
    };

    _handleSwitchTag = () => {
        this.setState({
            hasChildTagFocus: !this.state.hasChildTagFocus
        });
    };

    _normalizeTags = (tag) => {
        return {
            category: tag.visibility,
            value: tag.name
        };
    };

    render() {
        return (
            <>
                <div className="categorized-parent-tag">
                    <Field name="parent_tags"
                           component={CategorizedField}
                           id="article_parent_tags"
                           title={I18n.t('js.article.model.parent_tags')}
                           placeholder={I18n.t('js.article.common.tags.parent')}
                           addNewPlaceholder={I18n.t('js.article.common.tags.placeholder')}
                           addNewText={I18n.t('js.article.common.tags.add')}
                           isSortingCategoriesByAlpha={false}
                           labelClass="article-form-tag-label"
                           categorizedTags={this.props.availableParentTags}
                           transformInitialTags={this._normalizeTags}
                           onTabPress={this._handleSwitchTag}
                           onSubmit={this.props.onSubmit}
                           componentContent={this.props.parentTags}/>
                </div>

                <div className="categorized-child-tag margin-top-40">
                    <Field name="child_tags"
                           component={CategorizedField}
                           id="article_child_tags"
                           title={I18n.t('js.article.model.child_tags')}
                           placeholder={I18n.t('js.article.common.tags.child')}
                           addNewPlaceholder={I18n.t('js.article.common.tags.placeholder')}
                           addNewText={I18n.t('js.article.common.tags.add')}
                           hasChildTagFocus={this.state.hasChildTagFocus}
                           isSortingCategoriesByAlpha={false}
                           labelClass="article-form-tag-label"
                           categorizedTags={this.props.availableChildTags}
                           transformInitialTags={this._normalizeTags}
                           onSubmit={this.props.onSubmit}
                           componentContent={this.props.childTags}/>
                </div>
            </>
        );
    }
}
