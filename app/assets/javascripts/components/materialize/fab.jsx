'use strict';

var FixedActionButton = React.createClass({
    propTypes: {
        children: React.PropTypes.array.isRequired
    },

    componentDidMount () {
    },

    componentWillUpdate () {
    },

    _renderButton () {
        return React.Children.map(this.props.children, function (button) {
            return (
                <li>
                    {button}
                </li>
            );
        });
    },

    render () {
        return (
            <div className="fixed-action-btn horizontal click-to-toggle">
                <a className="btn-floating btn-large blue-grey darken-2">
                    <i className="material-icons">menu</i>
                </a>
                <ul>
                    {this._renderButton()}
                </ul>
            </div>

        );
    }
});

module.exports = FixedActionButton;
