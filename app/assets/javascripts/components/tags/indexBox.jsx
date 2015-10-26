var IndexTagList = require('./indexList');
var TagStore = require('../../stores/tagStore');
var Input = require('../../components/materialize/input');
var Spinner = require('../../components/materialize/spinner');
var fuzzy = require('fuzzy');

var SearchBar = React.createClass({
    handleChange: function () {
        this.props.onUserInput(ReactDOM.findDOMNode(this.refs.filterTextInput.refs.filterTextInput).value);
    },

    _onSubmit: function () {
        return false;
    },

    render: function () {
        //value={this.props.filterText}
        return (
            <form className="tag-search" onSubmit={this._onSubmit}>
                <Input ref="filterTextInput" id="filterTextInput" onChange={this.handleChange}>
                    {I18n.t('js.tag.filter')}
                </Input>
            </form>
        );
    }
});


var IndexTagBox = React.createClass({
    mixins: [Reflux.listenTo(TagStore, 'onLoadTag')],

    getInitialState: function () {
        return {
            tags: {},
            filteredTags: {},
            isLoading: true,
            filterText: ''
        };
    },

    onLoadTag(tagStore) {
        this.setState({
            tags: _.indexBy(tagStore, 'id'),
            filteredTags: _.indexBy(tagStore, 'id'),
            isLoading: false
        });
    },

    handleUserInput: function (filterText) {
        var filteredTags = {};

        var tagsArray = _.toArray(this.state.tags);
        fuzzy.filter(filterText, tagsArray, {
            extract: function (tag) {
                return tag.name;
            }
        }).forEach(function (tag) {
            var tagId = tagsArray[tag.index].id;
            filteredTags[tagId] = this.state.tags[tagId];
        }.bind(this));

        this.setState({
            filterText: filterText,
            filteredTags: filteredTags
        });
    },

    render: function () {
        return (
            <div className="blog-index-tag">
                <SearchBar filterText={this.state.filterText}
                           onUserInput={this.handleUserInput} />

                <IndexTagList tags={this.state.tags}
                              filteredTags={this.state.filteredTags}
                              filterText={this.state.filterText} />

                <div className={this.state.isLoading ? 'center': 'hide'}>
                    <Spinner />
                </div>
            </div>
        );
    }

});

module.exports = IndexTagBox;
