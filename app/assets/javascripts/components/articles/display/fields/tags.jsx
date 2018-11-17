'use strict';

import {
    Field
} from 'redux-form/immutable';

import {
    withStyles
} from '@material-ui/core/styles';
import CategorizedField from '../../../materialize/form/categorized';

import styles from '../../../../../jss/article/form/common';

export default @withStyles(styles)

class ArticleTagField extends React.Component {
    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
        article: PropTypes.object,
        availableTags: PropTypes.array,
        parentTags: PropTypes.array,
        childTags: PropTypes.array,
        isDraft: PropTypes.bool,
        onInputsChange: PropTypes.func,
        onIsLinkChange: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    static defaultProps = {
        article: {},
        parentTags: [],
        childTags: [],
        availableTags: []
    };

    constructor(props) {
        super(props);
    }

    state = {
        hasChildTagFocus: false,
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
            <div className={this.props.classes.tags}>
                <div className={classNames('categorized-parent-tag', this.props.classes.tagBox)}>
                    <Field name="parent_tags"
                           id="article_parent_tags"
                           title={I18n.t('js.article.model.parent_tags')}
                           placeholder={I18n.t('js.article.common.tags.parent')}
                           addNewPlaceholder={I18n.t('js.article.common.tags.placeholder')}
                           addNewText={I18n.t('js.article.common.tags.add')}
                           isSortingCategoriesByAlpha={false}
                           labelClass={this.props.classes.tagLabel}
                           categorizedTags={this.props.availableTags}
                           transformInitialTags={this._normalizeTags}
                           onTabPress={this._handleSwitchTag}
                           onSubmit={this.props.onSubmit}
                           component={CategorizedField}
                           componentContent={this.props.parentTags}/>
                </div>

                <div className={classNames('categorized-child-tag margin-top-40', this.props.classes.tagBox)}>
                    <Field name="child_tags"
                           id="article_child_tags"
                           title={I18n.t('js.article.model.child_tags')}
                           placeholder={I18n.t('js.article.common.tags.child')}
                           addNewPlaceholder={I18n.t('js.article.common.tags.placeholder')}
                           addNewText={I18n.t('js.article.common.tags.add')}
                           hasChildTagFocus={this.state.hasChildTagFocus}
                           isSortingCategoriesByAlpha={false}
                           labelClass={this.props.classes.tagLabel}
                           categorizedTags={this.props.availableTags}
                           transformInitialTags={this._normalizeTags}
                           onSubmit={this.props.onSubmit}
                           component={CategorizedField}
                           componentContent={this.props.childTags}/>
                </div>
            </div>
        );
    }
}
