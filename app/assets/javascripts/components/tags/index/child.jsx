'use strict';

var ChildTag = React.createClass({
    propTypes: {
        tag: React.PropTypes.object.isRequired,
        onClickTag: React.PropTypes.func.isRequired,
        parentTagName: React.PropTypes.string.isRequired
    },

    _handleTagClick (tagName, event) {
        event.preventDefault();
        this.props.onClickTag(this.props.parentTagName, tagName);
        return true;
    },

    render () {
        return (
            <li className="">
                <span className="waves-light btn-small tag-children"
                      onClick={this._handleTagClick.bind(this, this.props.tag.name)}>
                    {this.props.tag.name}
                </span>
            </li>
        );
    }
});

module.exports = ChildTag;
