'use strict';

// import AssociatedTagBox from '../../components/tags/associated/box';

import TagStore from '../../stores/tagStore';

import IndexTagList from './display/relationship';
import SearchBar from '../theme/search-bar';
import Spinner from '../materialize/spinner';

export default class TagSidebar extends Reflux.Component {
    static propTypes = {
        isOpened: React.PropTypes.bool
    };

    static defaultProps = {
        isOpened: false
    };

    state = {
        isOpened: this.props.isOpened,
        filterText: ''
    };

    constructor(props) {
        super(props);

        // mixins: [Reflux.connectFilter(TagStore, 'userTags', function (tagData) {
        //     if (tagData.type === 'userTags') {
        //         return tagData.userTags;
        //     } else {
        //         return this.state.userTags;
        //     }
        // })],
    }

    componentDidMount() {
        // Mousetrap.bind('alt+t', () => {
        //     $('#toggle-tags').sideNav('show');
        //     return false;
        // }, 'keydown');
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            isOpened: nextProps.isOpened
        });
    }

    _handleUserInput = (filterText) => {
        this.setState({
            filterText: filterText
        });
    };

    _handleCloseClick = (event) => {
        event.preventDefault();

        this.setState({
            isOpened: false
        });
    };

    render() {
        const isLoading = $.isEmpty(this.state.userTags);

        return (
            <div className="blog-sidebar-tag">
                <a className="right"
                   onClick={this._handleCloseClick}>
                    <i className="material-icons">close</i>
                </a>

                <SearchBar label={I18n.t('js.tag.common.filter')}
                           onUserInput={this._handleUserInput}>
                    {this.state.filterText}
                </SearchBar>

                {I18n.t('js.tag.common.list')}

                <IndexTagList tags={this.state.userTags}
                              filterText={this.state.filterText}/>

                <div className={classNames({'center': isLoading, 'hide': !isLoading})}>
                    <Spinner />
                </div>
            </div>
        );
    }
}
