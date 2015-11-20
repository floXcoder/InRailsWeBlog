"use strict";

var ChildTag = React.createClass({
    propTypes: {
        tag: React.PropTypes.object.isRequired,
        onClickTag: React.PropTypes.func.isRequired
    },

    _onClickTag: function (tagName, event) {
        event.preventDefault();
        this.props.onClickTag(this.props.parentTag.name, tagName);
        return true;
    },

    render: function () {
        return (
            <li className="">
                <span className="waves-light btn-small tag-children"
                      onClick={this._onClickTag.bind(this, this.props.tag.name)} >
                    {this.props.tag.name}
                </span>
            </li>
        );
    }
});

module.exports = ChildTag;
