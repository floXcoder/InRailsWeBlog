'use strict';

import ArticleActions from '../../../actions/articleActions';
import ParentTag from './parent';

import TagStore from '../../../stores/tagStore';

import Filtering from '../../../modules/filter';

export default class IndexTagList extends React.Component {
    static propTypes = {
        tags: React.PropTypes.array.isRequired,
        filterText: React.PropTypes.string.isRequired
    };

    static childContextTypes = {
        router: React.PropTypes.object
    };

    state = {};

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !this.props.tags.isEqualIds(nextProps.tags) || this.props.filterText !== nextProps.filterText;
    }

    componentDidUpdate() {
    }

    _handleTagClick(tagId, parentTagName, childTagName) {
        TagStore.onTrackClick(tagId);

        let params = {};
        if (!$.isEmpty(childTagName)) {
            params.childTags = [childTagName];
            params.parentTags = [parentTagName];
        } else if (!$.isEmpty(parentTagName)) {
            params.tags = [parentTagName];
        }

        this.context.router.push(`/article/tags/${parentTagName}`);
        ArticleActions.loadArticles(params);

        return true;
    }

    render() {
        let tags = _.keyBy(this.props.tags, 'id');
        let filteredTags = Filtering.filterObjectOfObject(tags, 'name', this.props.filterText);
        let parentFilteredTags = [];

        if (filteredTags) {
            _.toArray(tags).map((tag) => {
                if (filteredTags[tag.id]
                    || _.intersection(_.map(filteredTags, 'id'), _.map(tag.children, 'id')).length > 0) {
                    parentFilteredTags.push(tag);
                }
            });
        }

        if (!$.isEmpty(parentFilteredTags)) {
            return (
                <div>
                    {
                        parentFilteredTags.map((tag, i) =>
                            <ParentTag key={i}
                                       parentTag={tag}
                                       filteredTags={filteredTags}
                                       isFiltered={this.props.filterText !== ''}
                                       onClickTag={this._handleTagClick}/>
                        )
                    }
                </div>
            );
        }
        else {
            return (
                <div>
                    {I18n.t('js.tag.common.no_results') + ' ' + this.props.filterText}
                </div>
            );
        }
    }
}
