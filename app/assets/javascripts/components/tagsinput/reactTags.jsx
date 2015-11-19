'use strict';

var Suggestions = require('./suggestions');

//var DragDropContext = require('react-dnd').DragDropContext;
//var HTML5Backend = require('react-dnd-html5-backend');

// Constants
var Keys = {
    ENTER: 13,
    TAB: 9,
    BACKSPACE: 8,
    UP_ARROW: 38,
    DOWN_ARROW: 40,
    ESCAPE: 27
};

var ReactTags = React.createClass({
    displayName: 'ReactTags',

    propTypes: {
        selectedTags: React.PropTypes.array,
        placeholder: React.PropTypes.string,
        inputId: React.PropTypes.string,
        tagList: React.PropTypes.array,
        labelField: React.PropTypes.string,
        autofocus: React.PropTypes.bool,
        handleDelete: React.PropTypes.func.isRequired,
        handleAddition: React.PropTypes.func.isRequired
    },

    getDefaultProps: function () {
        return {
            placeholder: null,
            selectedTags: [],
            tagList: [],
            autofocus: true
        };
    },

    getInitialState: function () {
        return {
            tagList: this.props.tagList,
            query: '',
            selectedIndex: -1,
            selectionMode: false
        };
    },

    componentDidMount: function () {
        if (this.props.autofocus) {
            this.refs.input.focus();
        }
    },

    handleDelete: function (i, e) {
        this.props.handleDelete(i);
        this.setState({query: ''});
    },

    _handleInputChange: function (e) {
        var query = e.target.value.trim();
        var suggestions = this.props.tagList.filter(function (item) {
            if (this.props.labelField) {
                return item[this.props.labelField].toLowerCase().search(query.toLowerCase()) === 0;
            } else {
                return item.toLowerCase().search(query.toLowerCase()) === 0;
            }
        }.bind(this));

        this.setState({
            query: query,
            tagList: suggestions
        });
    },

    _handleKeyDown: function (e) {
        var _state = this.state;
        var query = _state.query;
        var selectedIndex = _state.selectedIndex;
        var tags = _state.tagList;

        // hide tags menu on escape
        if (e.keyCode === Keys.ESCAPE) {
            e.preventDefault();
            this.setState({
                selectedIndex: -1,
                selectionMode: false,
                tagList: []
            });
        }

        // when enter or tab is pressed add query to tags
        if ((e.keyCode === Keys.ENTER || e.keyCode === Keys.TAB) && query != '') {
            e.preventDefault();
            if (this.state.selectionMode) {
                query = this.state.tagList[this.state.selectedIndex];
            }
            this.addTag(query);
        }

        // when backspace key is pressed and query is blank, delete tag
        if (e.keyCode === Keys.BACKSPACE && query == '') {
            //
            this.handleDelete(this.props.selectedTags.length - 1);
        }

        // up arrow
        if (e.keyCode === Keys.UP_ARROW) {
            e.preventDefault();
            var selectedIndex = this.state.selectedIndex;
            // last item, cycle to the top
            if (selectedIndex <= 0) {
                this.setState({
                    selectedIndex: this.state.tagList.length - 1,
                    selectionMode: true
                });
            } else {
                this.setState({
                    selectedIndex: selectedIndex - 1,
                    selectionMode: true
                });
            }
        }

        // down arrow
        if (e.keyCode === Keys.DOWN_ARROW) {
            e.preventDefault();
            this.setState({
                selectedIndex: (this.state.selectedIndex + 1) % tags.length,
                selectionMode: true
            });
        }
    },

    addTag: function (tag) {
        var input = this.refs.input;

        // call method to add
        this.props.handleAddition(tag);

        // reset the state
        this.setState({
            query: '',
            selectionMode: false,
            selectedIndex: -1
        });

        // focus back on the input box
        input.value = '';
        input.focus();
    },

    _onClickSuggestion: function (i, e) {
        this.addTag(this.state.tagList[i]);
    },

    _handleSuggestionHover: function (i, e) {
        this.setState({
            selectedIndex: i,
            selectionMode: true
        });
    },

    render: function () {
        // get the tags for the given query
        var query = this.state.query.trim(),
            selectedIndex = this.state.selectedIndex,
            tags = this.state.tagList,
            placeholder = this.props.placeholder;

        return (
            <div className="input-field tagsinput-tagInput">
                <label htmlFor="tagSelection">{I18n.t('js.article.new.tags.placeholder')}</label>
                <input ref="input"
                       id="tagSelection"
                       type="text"
                       minLength={this.props.tagMinLength}
                       maxLength={this.props.tagMaxLength}
                       placeholder={placeholder}
                       onChange={this._handleInputChange}
                       onKeyDown={this._handleKeyDown}/>
                <Suggestions query={query}
                             tags={tags}
                             labelField={this.props.labelField}
                             selectedIndex={selectedIndex}
                             onClickSuggestion={this._onClickSuggestion}
                             handleHover={this._handleSuggestionHover}/>
            </div>
        );
    }
});

module.exports = ReactTags;
//module.exports = {
//    WithContext: DragDropContext(HTML5Backend)(ReactTags),
//    WithOutContext: ReactTags
//};
