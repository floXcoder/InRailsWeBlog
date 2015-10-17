var ReactTags = require('./reactTags');
var Tag = require('./Tag');
var TagStore = require('../../stores/tagStore');

var TagsInput = React.createClass({
    mixins: [Reflux.listenTo(TagStore, 'onTagChange')],

    propTypes: {
        labelField: React.PropTypes.string
    },

    getDefaultProps: function () {
        return {
            labelField: 'name'
        };
    },

    getInitialState: function() {
        return {
            selectedTags: [],
            tagList: []
        }
    },

    onTagChange(tagStore) {
        this.setState({tagList: tagStore});
    },

    _onTagExists(tag) {
        var $existingTag = $(".tagsinput-tag", ".tagsinput-tags").filter(function () { return $(this).data("name") === tag; });
        $existingTag.fadeOut(200).fadeIn(200);
    },

    handleDelete: function(i) {
        var selectedTags = this.state.selectedTags;
        selectedTags.splice(i, 1);
        this.setState({selectedTags: selectedTags});
    },

    handleAddition: function(tag) {
        if (!tag) {
            return;
        }

        // Create tag object if new tag
        tag = tag.hasOwnProperty(this.props.labelField) ? tag : {id: null, name: tag};

        // Trim tag
        tag.name = tag.name.trim();

        // Ignore strings only contain whitespace
        if (tag.name.toString().match(/^\s*$/)) {
            return;
        }

        // Ignore items all ready added
        var existing = _.filter(this.state.selectedTags, function(selectedTag) { return selectedTag.name === tag.name})[0];
        if (existing) {
            this._onTagExists(tag.name);
            return;
        }

        // if length greater than limit
        if (tag.length + 1 > 128) {
            return;
        }

        var selectedTags = this.state.selectedTags;
        selectedTags.push(tag);
        this.setState({selectedTags: selectedTags});
    },

    //handleDrag: function(tag, currPos, newPos) {
    //    var selectedTags = this.state.selectedTags;
    //
    //    // mutate array
    //    selectedTags.splice(currPos, 1);
    //    selectedTags.splice(newPos, 0, tag);
    //
    //    // re-render
    //    this.setState({ selectedTags: selectedTags });
    //},

    //moveTag: function (id, afterId) {
    //    var selectedTags = this.props.selectedTags;
    //
    //    // locate tags
    //    var tag = selectedTags.filter(function (t) {
    //        return t.id === id;
    //    })[0];
    //    var afterTag = selectedTags.filter(function (t) {
    //        return t.id === afterId;
    //    })[0];
    //
    //    // find their position in the array
    //    var tagIndex = selectedTags.indexOf(tag);
    //    var afterTagIndex = selectedTags.indexOf(afterTag);
    //
    //    // call handler with current position and after position
    //    this.props.handleDrag(tag, tagIndex, afterTagIndex);
    //},

    render: function() {
        var tagItems = this.state.selectedTags.map((function (tag, i) {
            return (
                <Tag key={i}
                     tag={tag}
                     labelField={this.props.labelField}
                     onDelete={this.handleDelete.bind(this, i)}/>
            );
        }).bind(this));

        return (
            <div ref="tagsSelection" className="tagsinput-tags">
                <div className="tagsinput-selected">
                    {tagItems}
                    <ReactTags selectedTags={this.state.selectedTags}
                               tagList={this.state.tagList}
                               labelField={this.props.labelField}
                               handleDelete={this.handleDelete}
                               handleAddition={this.handleAddition}/>
                </div>
            </div>
        )
    }
});

module.exports = TagsInput;
