var IndexTagList = require('./indexList');

var TagStore = require('../../stores/tagStore');

var Spinner = require('../../components/materialize/spinner');

var IndexTagBox = React.createClass({
    mixins: [Reflux.listenTo(TagStore, 'onTagChange')],

    getInitialState: function() {
        return {
            tags: null,
            isLoading: true
        };
    },

    onTagChange(tagStore) {
        this.setState({
            tags: tagStore,
            isLoading: false
        });
    },

    _displayTagsIfExist: function () {
        if (this.state.tags) {
            return (
                <IndexTagList tags={this.state.tags}/>
            );
        }
    },

    render: function () {
        return (
            <div className="blog-index-tag">
                { this._displayTagsIfExist() }
                <div className={this.state.isLoading ? 'center': 'hide'}>
                    <Spinner />
                </div>
            </div>
        );
    }
});

module.exports = IndexTagBox;
