'use strict';

import _ from 'lodash';

import {
    fetchTags
} from '../../actions';

import {
    getTags
} from '../../selectors';

// TODO: use normalizr to get current tags of fetch articles (write evol)
// import AssociatedTagBox from '../tags/associated/box';

import TagRelationshipDisplay from './display/relationship';
import SearchBar from '../theme/searchBar';
import Spinner from '../materialize/spinner';

import Fuzzy from 'fuzzy';

@connect((state) => ({
    isLoading: state.tagState.isFetching,
    // TODO : use selector in render
    tags: state.tagState.tags.toJS()
}), {
    fetchTags
})
export default class TagSidebar extends React.Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        // From connect
        isLoading: PropTypes.bool,
        tags: PropTypes.array,
        fetchTags: PropTypes.func
    };

    constructor(props) {
        super(props);

        // Tags of current user are fetched if connected
        this.props.fetchTags();
    }

    state = {
        filterText: undefined
    };

    componentDidMount() {
        // TODO
        // Mousetrap.bind('alt+t', () => {
        //     $('#toggle-tags').sideNav('show');
        //     return false;
        // }, 'keydown');
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.params, nextProps.params)) {
            // TODO: fetch tags by topic too or if topic changed (params changed ?)
            this.props.fetchTags(this.props.params);
        }
    }

    _handleSearchInput = (value) => {
        this.setState({
            filterText: value
        });
    };

    render() {
        const isFiltering = !$.isEmpty(this.state.filterText);

        // TODO: use selector
        const tags = this.props.tags.map((tag) => {
            let parents = [];
            let children = [];

            if (!$.isEmpty(tag.parents)) {
                parents = tag.parents.map((parentId) => {
                    const parentTag = this.props.tags.find((tag) => tag.id === parentId);
                    if (!!parentTag && !$.isEmpty(this.state.filterText) && !Fuzzy.match(this.state.filterText, parentTag.name)) {
                        return null;
                    } else {
                        return parentTag && _.omit(parentTag, ['parents', 'children']);
                    }
                });
            }

            if (!$.isEmpty(tag.children)) {
                children = tag.children.map((childId) => {
                    const childTag = this.props.tags.find((tag) => tag.id === childId);
                    if (!!childTag && !$.isEmpty(this.state.filterText) && !Fuzzy.match(this.state.filterText, childTag.name)) {
                        return null;
                    } else {
                        return childTag && _.omit(childTag, ['parents', 'children']);
                    }
                });
            }

            if (!$.isEmpty(this.state.filterText) && $.isEmpty(children) && !Fuzzy.match(this.state.filterText, tag.name)) {
                return null;
            }

            return _.merge(_.omit(tag, ['parents', 'children']), {parents: parents, children: children});
        });

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
                                                        isFiltering={isFiltering}/>
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
