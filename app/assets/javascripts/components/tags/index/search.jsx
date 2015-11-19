var Input = require('../../../components/materialize/input');

var SearchBar = React.createClass({
    propTypes: {
        onUserInput: React.PropTypes.func.isRequired
    },

    _handleSearchChange: function () {
        this.props.onUserInput(ReactDOM.findDOMNode(this.refs.filterTextInput.refs.filterTextInput).value);
    },

    _onSubmit: function () {
        return false;
    },

    render: function () {
        return (
            <form className="tag-search" onSubmit={this._onSubmit}>
                <Input ref="filterTextInput" id="filterTextInput" onChange={this._handleSearchChange}>
                    {I18n.t('js.tag.filter')}
                </Input>
            </form>
        );
    }
});

module.exports = SearchBar;
