'use strict';

// const AssociatedTagBox = require('../../components/tags/associated/box');

const TagStore = require('../../stores/tagStore');

const IndexTagList = require('./display/relationship');
const SearchBar = require('../theme/search-bar');
const Spinner = require('../materialize/spinner');

const classNames = require('classnames');

import {Drawer, Subheader} from 'material-ui';

var TagSidebar = React.createClass({
    propTypes: {
        isOpened: React.PropTypes.bool
    },

    mixins: [Reflux.connectFilter(TagStore, 'userTags', function (tagData) {
        if (tagData.type === 'userTags') {
            return tagData.userTags;
        } else {
            return this.state.userTags;
        }
    })],

    getDefaultProps () {
        return {
            isOpened: false
        };
    },

    getInitialState () {
        return {
            isOpened: this.props.isOpened,
            filterText: ''
        };
    },

    componentDidMount () {
        // Mousetrap.bind('alt+t', () => {
        //     $('#toggle-tags').sideNav('show');
        //     return false;
        // }, 'keydown');
    },

    componentWillReceiveProps(nextProps) {
        this.setState({
            isOpened: nextProps.isOpened
        });
    },

    _handleUserInput (filterText) {
        this.setState({
            filterText: filterText
        });
    },

    _handleCloseClick (event) {
        event.preventDefault();

        this.setState({
            isOpened: false
        });
    },

    render () {
        const isLoading = $.isEmpty(this.state.userTags);

        return (
            <Drawer width={300}
                    open={this.state.isOpened}>
                <div className="blog-sidebar-tag">
                    <a className="right"
                       onClick={this._handleCloseClick}>
                        <i className="material-icons">close</i>
                    </a>

                    <SearchBar label={I18n.t('js.tag.common.filter')}
                               onUserInput={this._handleUserInput}>
                        {this.state.filterText}
                    </SearchBar>

                    <Subheader>
                        {I18n.t('js.tag.common.list')}
                    </Subheader>

                    <IndexTagList tags={this.state.userTags}
                                  filterText={this.state.filterText}/>

                    <div className={classNames({'center': isLoading, 'hide': !isLoading})}>
                        <Spinner />
                    </div>
                </div>
            </Drawer>
        );
    }
});

module.exports = TagSidebar;
