'use strict';

const ArticleActions = require('../../../actions/articleActions');
const ParentTag = require('./parent');

const TagStore = require('../../../stores/tagStore');

const Filtering = require('../../../modules/filter');

var IndexTagList = React.createClass({
    propTypes: {
        tags: React.PropTypes.array.isRequired,
        filterText: React.PropTypes.string.isRequired
    },

    contextTypes: {
        router: React.PropTypes.object
    },

    getInitialState () {
        return {};
    },

    componentDidMount () {
    },

    shouldComponentUpdate (nextProps, nextState) {
        return !this.props.tags.isEqualIds(nextProps.tags) || this.props.filterText !== nextProps.filterText;
    },

    componentDidUpdate () {
    },

    _handleTagClick (tagId, parentTagName, childTagName) {
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
    },

    render () {
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
});

module.exports = IndexTagList;
