'use strict';

import {
    filterTags
} from '../../actions';

import {
    getClassifiedTags
} from '../../selectors';

// TODO: use selector to get current tags of fetch articles: load on click only
// import AssociatedTagBox from '../tags/associated/box';

import TagRelationshipDisplay from './display/relationship';
import SearchBar from '../theme/searchBar';
import Spinner from '../materialize/spinner';

@connect((state) => ({
    isLoading: state.tagState.isFetching,
    filterText: state.tagState.filterText,
    tags: getClassifiedTags(state)
}), {
    filterTags
})
export default class TagSidebar extends React.Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        // From connect
        isLoading: PropTypes.bool,
        filterText: PropTypes.string,
        tags: PropTypes.array,
        fetchTags: PropTypes.func,
        filterTags: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // Mousetrap.bind('alt+t', () => {
        //     $('#toggle-tags').sideNav('show');
        //     return false;
        // }, 'keydown');
    }

    _handleSearchInput = (value) => {
        this.props.filterTags(value);
    };

    render() {
        const isFiltering = !Utils.isEmpty(this.props.filterText);

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
                        <h3 className="sidebar-title">
                            {I18n.t('js.tag.common.list')}
                        </h3>

                        <SearchBar label={I18n.t('js.tag.common.filter')}
                                   onSearchInput={this._handleSearchInput}>
                            {this.props.filterText}
                        </SearchBar>

                        {
                            this.props.tags.length > 0
                                ?
                                <TagRelationshipDisplay tags={this.props.tags}
                                                        isFiltering={isFiltering}/>
                                :
                                <div>
                                    {I18n.t('js.tag.common.no_results') + ' ' + this.props.filterText}
                                </div>
                        }
                    </div>
                }
            </div>
        );
    }
}
