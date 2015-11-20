"use strict";

var Tag = React.createClass({
    displayName: 'Tag',

    propTypes: {
        labelField: React.PropTypes.string,
        onDelete: React.PropTypes.func.isRequired,
        tag: React.PropTypes.object.isRequired
    },

    getDefaultProps: function () {
        return {
            labelField: 'name'
        };
    },

    getInitialState: function() {
        return {
            hover: false
        }
    },

    _onMouseOver: function() {
        this.setState({hover: true});
    },

    _onMouseOut: function() {
        this.setState({hover: false});
    },

    render: function () {
        var label = this.props.tag[this.props.labelField];
        var hoverClass = this.state.hover ? 'icon-highlight' : '';

        return (
            <span className={"tagsinput-tag waves-effect waves-light btn-small grey lighten-5 black-text " + this.props.labelClass}
                  onClick={this.props.onClickTag}
                  onContextMenu={this.props.handleContextMenu}
                  data-name={label}>
                {label}
                <a className={"tagsinput-remove " + hoverClass}
                   onClick={this.props.onDelete}
                   onMouseOver={this._onMouseOver}
                   onMouseOut={this._onMouseOut}>
                    <i className="material-icons">clear</i>
                </a>
            </span>
        );
    }
});

module.exports = Tag;
