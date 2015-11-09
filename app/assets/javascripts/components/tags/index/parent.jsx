var ChildTag = require('./child');

var ParentTag = React.createClass({

    _onTagClick: function (parentTagName, childTagName, event) {
        if (event) {
            event.preventDefault();
        }
        this.props.onTagClick(parentTagName, childTagName);
        return false;
    },

    _renderArrow: function () {
        if (this.props.tag.children.length > 0) {
            return (
                <i className="material-icons tag-dropdown">
                    arrow_drop_down
                </i>
            );
        }
    },

    _renderChildrenTag: function () {
        return _.map(this.props.tag.children, function (tag) {
            var childTag = this.props.filteredTags[tag.id];
            if (childTag) {
                return (
                    <ChildTag key={childTag.id + '-' + tag.id}
                              tag={childTag}
                              parentTag={this.props.tag}
                              onTagClick={this._onTagClick}/>
                );
            }
        }, this);
    },

    render: function () {
        return (
            <li>
                <a className={(this.props.textFiltered ? 'active ' : '') + 'collapsible-header'}>
                    <span className="waves-light btn-small tag-parent"
                          onClick={this._onTagClick.bind(this, this.props.tag.name, null)}>
                        {this.props.tag.name}
                    </span>
                    {this._renderArrow()}
                </a>

                <div className="collapsible-body tag-children">
                    <ul>
                        {this._renderChildrenTag()}
                    </ul>
                </div>
            </li>
        );
    }
});

module.exports = ParentTag;
