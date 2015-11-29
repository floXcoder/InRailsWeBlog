'use strict';

var classNames = require('classnames');

var ChildTag = require('./child');

var ParentTag = React.createClass({
    propTypes: {
        filteredTags: React.PropTypes.object.isRequired,
        textFiltered: React.PropTypes.bool.isRequired,
        tag: React.PropTypes.object.isRequired,
        onClickTag: React.PropTypes.func.isRequired
    },

    _handleTagClick (parentTagName, childTagName, event) {
        if (event) {
            event.preventDefault();
        }
        this.props.onClickTag(parentTagName, childTagName);
        return false;
    },

    _renderArrow () {
        if (this.props.tag.children.length > 0) {
            return (
                <i className="material-icons tag-dropdown">arrow_drop_down</i>
            );
        }
    },

    _renderChildrenTag () {
        return _.map(this.props.tag.children, function (tag) {
            let childTag = this.props.filteredTags[tag.id];
            if (childTag) {
                return (
                    <ChildTag key={childTag.id + '-' + tag.id}
                              tag={childTag}
                              parentTagName={this.props.tag.name}
                              onClickTag={this._handleTagClick}/>
                );
            }
        }, this);
    },

    render () {
        let parentLinkClasses = classNames(
            'collapsible-header',
            {
                'active': this.props.textFiltered
            }
        );

        return (
            <li>
                <a className={parentLinkClasses}>
                    <span className="waves-light btn-small tag-parent"
                          onClick={this._handleTagClick.bind(this, this.props.tag.name, null)}>
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
