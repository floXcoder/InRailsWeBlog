var ChildTag = React.createClass({
    _onTagClick: function (tagName, event) {
        event.preventDefault();
        this.props.onTagClick(this.props.parentTag.name, tagName);
        return true;
    },

    render: function () {
        return (
            <li className="">
                <span className="waves-light btn-small tag-children"
                      onClick={this._onTagClick.bind(this, this.props.tag.name)} >
                    {this.props.tag.name}
                </span>
            </li>
        );
    }
});

module.exports = ChildTag;
