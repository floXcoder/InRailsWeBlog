'use strict';

import _ from 'lodash';

// TODO: how to use it?
// import AssociatedTagBox from '../../components/tags/associated/box';

import TopicStore from '../../stores/topicStore';

import TagActions from '../../actions/tagActions';
import TagStore from '../../stores/tagStore';

import TagRelationshipDisplay from './display/relationship';
import SearchBar from '../theme/search-bar';
import Spinner from '../materialize/spinner';

import Fuzzy from 'fuzzy';

export default class TagSidebar extends Reflux.Component {
    static propTypes = {
        router: PropTypes.object.isRequired
    };

    static defaultProps = {};

    constructor(props) {
        super(props);

        this.mapStoreToState(TopicStore, this.onTopicChange);
        this.mapStoreToState(TagStore, this.onTagChange);
    }

    state = {
        isLoading: true,
        userTags: [],
        filterText: null
    };

    componentWillMount() {
        if ($app.isUserConnected()) {
            this.setState({
                userTags: $app.user.tags || [],
                isLoading: false
            });
        } else {
            TagActions.loadTags();
        }
    }

    componentDidMount() {
        // TODO
        // Mousetrap.bind('alt+t', () => {
        //     $('#toggle-tags').sideNav('show');
        //     return false;
        // }, 'keydown');
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.router.match, nextProps.router.match)) {
            this.setState({
                isLoading: true
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // TODO
        // return !this.state.userTags.isEqualIds(nextState.userTags) || !this.state.filterText !== nextState.filterText;

        return true;
    }

    onTopicChange(topicData) {
        if ($.isEmpty(topicData)) {
            return;
        }

        let newState = {};

        if (topicData.type === 'switchTopic' || topicData.type === 'addTopic') {
            newState.userTags = $app.user.tags;
            newState.isLoading = false;
        }

        if (!$.isEmpty(newState)) {
            this.setState(newState);
        }
    }

    onTagChange(tagData) {
        if ($.isEmpty(tagData)) {
            return;
        }

        let newState = {};

        if (tagData.type === 'loadTags') {
            newState.userTags = tagData.tags;
            newState.isLoading = false;
        }

        if (tagData.type === 'refreshTags') {
            newState.userTags = tagData.tags;
            newState.isLoading = false;
        }

        if (!$.isEmpty(newState)) {
            this.setState(newState);
        }
    }

    _handleSearchInput = (value) => {
        this.setState({
            filterText: value
        });
    };

    render() {
        const isSearching = !$.isEmpty(this.state.filterText);

        const tags = _.compact(this.state.userTags.map((tag) => {
            let parents = [];
            let children = [];

            if (!$.isEmpty(tag.parents)) {
                parents = _.compact(tag.parents.map((parentId) => {
                    const parentTag = _.find(this.state.userTags, {'id': parentId});
                    if (!!parentTag && !$.isEmpty(this.state.filterText) && !Fuzzy.match(this.state.filterText, parentTag.name)) {
                        return null;
                    } else {
                        return parentTag && _.omit(parentTag, ['parents', 'children']);
                    }
                }));
            }

            if (!$.isEmpty(tag.children)) {
                children = _.compact(tag.children.map((childId) => {
                    const childTag = _.find(this.state.userTags, {'id': childId});

                    if (!!childTag && !$.isEmpty(this.state.filterText) && !Fuzzy.match(this.state.filterText, childTag.name)) {
                        return null;
                    } else {
                        return childTag && _.omit(childTag, ['parents', 'children']);
                    }
                }));
            }

            if (!$.isEmpty(this.state.filterText) && $.isEmpty(children) && !Fuzzy.match(this.state.filterText, tag.name)) {
                return null;
            }

            return _.merge(_.omit(tag, ['parents', 'children']), {parents: parents, children: children});
        }));

        return (
            <div className="blog-sidebar-tag">
                {
                    this.state.isLoading &&
                    <div className="center">
                        <Spinner/>
                    </div>
                }

                {
                    !this.state.isLoading &&
                    <div>
                        <h3>
                            {I18n.t('js.tag.common.list')}
                        </h3>

                        <SearchBar label={I18n.t('js.tag.common.filter')}
                                   onSearchInput={this._handleSearchInput}>
                            {this.state.filterText}
                        </SearchBar>

                        {
                            !$.isEmpty(tags)
                                ?
                                <TagRelationshipDisplay router={this.props.router}
                                                        tags={tags}
                                                        isSearching={isSearching}/>
                                :
                                <div>
                                    {I18n.t('js.tag.common.no_results') + ' ' + this.state.filterText}
                                </div>
                        }
                    </div>
                }
            </div>
        );
    }
}
