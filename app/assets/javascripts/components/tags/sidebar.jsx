'use strict';

import _ from 'lodash';

import {
    connect
} from 'react-redux';

import {
    loadTagArticles
} from '../../actions/index';

// TODO: how to use it?
// import AssociatedTagBox from '../tags/associated/box';

// import TopicStore from '../../stores/topicStore';

// import TagActions from '../../actions/tagActions';
// import TagStore from '../../stores/tagStore';

import TagRelationshipDisplay from './display/relationship';
import SearchBar from '../theme/searchBar';
import Spinner from '../materialize/spinner';

import Fuzzy from 'fuzzy';

@connect((state, props) => ({
    isLoading: false,
    tags: state.tagState.tags
}), {
    loadTagArticles
})
export default class TagSidebar extends React.Component {
    static propTypes = {
        loadTagArticles: PropTypes.func.isRequired,
        isLoading: PropTypes.bool,
        tags: PropTypes.array
    };

    static defaultProps = {
        isLoading: true,
        tags: []
    };

    constructor(props) {
        super(props);

        // this.mapStoreToState(TopicStore, this.onTopicChange);
        // this.mapStoreToState(TagStore, this.onTagChange);
    }

    state = {
        filterText: null
    };

    componentWillMount() {
        // TODO
        // if ($app.isUserConnected()) {
        //     this.setState({
        //         tags: $app.user.tags || [],
        //         isLoading: false
        //     });
        // } else {
        //     TagActions.loadTags();
        // }
    }

    componentDidMount() {
        // TODO
        // Mousetrap.bind('alt+t', () => {
        //     $('#toggle-tags').sideNav('show');
        //     return false;
        // }, 'keydown');
    }

    // TODO
    // componentWillReceiveProps(nextProps) {
    //     if (!_.isEqual(this.props.router.match, nextProps.router.match)) {
    //         this.setState({
    //             isLoading: true
    //         });
    //     }
    // }

    shouldComponentUpdate(nextProps, nextState) {
        // TODO
        // return !this.state.tags.isEqualIds(nextState.tags) || !this.state.filterText !== nextState.filterText;

        return true;
    }

    // onTopicChange(topicData) {
    //     if ($.isEmpty(topicData)) {
    //         return;
    //     }
    //
    //     let newState = {};
    //
    //     if (topicData.type === 'switchTopic' || topicData.type === 'addTopic') {
    //         newState.tags = $app.user.tags;
    //         newprops.isLoading = false;
    //     }
    //
    //     if (!$.isEmpty(newState)) {
    //         this.setState(newState);
    //     }
    // }

    // onTagChange(tagData) {
    //     if ($.isEmpty(tagData)) {
    //         return;
    //     }
    //
    //     let newState = {};
    //
    //     if (tagData.type === 'loadTags') {
    //         newState.tags = tagData.tags;
    //         newprops.isLoading = false;
    //     }
    //
    //     if (tagData.type === 'refreshTags') {
    //         newState.tags = tagData.tags;
    //         newprops.isLoading = false;
    //     }
    //
    //     if (!$.isEmpty(newState)) {
    //         this.setState(newState);
    //     }
    // }

    _handleSearchInput = (value) => {
        this.setState({
            filterText: value
        });
    };

    render() {
        const isFiltering = !$.isEmpty(this.state.filterText);

        const tags = (this.props.tags.map((tag) => {
            let parents = [];
            let children = [];

            if (!$.isEmpty(tag.parents)) {
                parents = tag.parents.map((parentId) => {
                    const parentTag = _.find(this.props.tags, {'id': parentId});
                    if (!!parentTag && !$.isEmpty(this.state.filterText) && !Fuzzy.match(this.state.filterText, parentTag.name)) {
                        return null;
                    } else {
                        return parentTag && _.omit(parentTag, ['parents', 'children']);
                    }
                }).compact();
            }

            if (!$.isEmpty(tag.children)) {
                children = tag.children.map((childId) => {
                    const childTag = _.find(this.props.tags, {'id': childId});

                    if (!!childTag && !$.isEmpty(this.state.filterText) && !Fuzzy.match(this.state.filterText, childTag.name)) {
                        return null;
                    } else {
                        return childTag && _.omit(childTag, ['parents', 'children']);
                    }
                }).compact();
            }

            if (!$.isEmpty(this.state.filterText) && $.isEmpty(children) && !Fuzzy.match(this.state.filterText, tag.name)) {
                return null;
            }

            return _.merge(_.omit(tag, ['parents', 'children']), {parents: parents, children: children});
        }));

        return (
            <div className="blog-sidebar-tag">
                {
                    this.props.isLoading &&
                    <div className="center">
                        <Spinner/>
                    </div>
                }

                {
                    !this.props.isLoading &&
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
                                <TagRelationshipDisplay tags={tags}
                                                        isFiltering={isFiltering}
                                                        onTagClick={this.props.loadTagArticles}/>
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
